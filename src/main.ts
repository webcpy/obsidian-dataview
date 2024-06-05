import {
    App,
    Component,
    debounce,
    MarkdownPostProcessorContext,
    MarkdownView,
    Plugin,
    PluginSettingTab,
    Setting,
    WorkspaceLeaf,
} from "obsidian";
import { renderErrorPre } from "ui/render";
import { FullIndex } from "data-index/index";
import { parseField } from "expression/parse";
import { tryOrPropogate } from "util/normalize";
import { DataviewApi, isDataviewDisabled } from "api/plugin-api";
import { DataviewSettings, DEFAULT_QUERY_SETTINGS, DEFAULT_SETTINGS } from "settings";
import { DataviewInlineRenderer } from "ui/views/inline-view";
import { DataviewInlineJSRenderer } from "ui/views/js-view";
import { currentLocale } from "util/locale";
import { DateTime } from "luxon";
import { DataviewInlineApi } from "api/inline-api";
import { replaceInlineFields } from "ui/views/inline-field";
import {
    inlineFieldsField,
    replaceInlineFieldsInLivePreview,
    workspaceLayoutChangeEffect,
} from "./ui/views/inline-field-live-preview";
import { DataviewInit } from "ui/markdown";
import { inlinePlugin } from "./ui/lp-render";
import { Extension } from "@codemirror/state";

export default class DataviewPlugin extends Plugin {
    /** Plugin-wide default settings. */
    public settings: DataviewSettings;

    /** The index that stores all dataview data. */
    public index: FullIndex;
    /** External-facing plugin API. */
    public api: DataviewApi;

    /** CodeMirror 6 extensions that dataview installs. Tracked via array to allow for dynamic updates. */
    private cmExtension: Extension[];

    async onload() {
        // Settings initialization; write defaults first time around.
        this.settings = Object.assign(DEFAULT_SETTINGS, (await this.loadData()) ?? {});
        this.addSettingTab(new GeneralSettingsTab(this.app, this));

        this.index = this.addChild(
            FullIndex.create(this.app, this.manifest.version, () => {
                if (this.settings.refreshEnabled) this.debouncedRefresh();
            })
        );

        // Set up automatic (intelligent) view refreshing that debounces.
        this.updateRefreshSettings();

        // From this point onwards the dataview API is fully functional (even if the index needs to do some background indexing).
        this.api = new DataviewApi(this.app, this.index, this.settings, this.manifest.version);

        // Register API to global window object.
        (window["DataviewAPI"] = this.api) && this.register(() => delete window["DataviewAPI"]);

        // Dataview query language code blocks.
        this.registerPriorityCodeblockPostProcessor("dataview", -100, async (source: string, el, ctx) =>
            this.dataview(source, el, ctx, ctx.sourcePath)
        );

        // DataviewJS codeblocks.
        this.registerPriorityCodeblockPostProcessor(
            this.settings.dataviewJsKeyword,
            -100,
            async (source: string, el, ctx) => this.dataviewjs(source, el, ctx, ctx.sourcePath)
        );

        // Dataview inline queries.
        this.registerPriorityMarkdownPostProcessor(-100, async (el, ctx) => {
            // Allow for turning off inline queries.
            if (!this.settings.enableInlineDataview || isDataviewDisabled(ctx.sourcePath)) return;

            this.dataviewInline(el, ctx, ctx.sourcePath);
        });

        // Dataview inline-inline query fancy rendering. Runs at a low priority; should apply to Dataview views.
        this.registerPriorityMarkdownPostProcessor(100, async (el, ctx) => {
            // Allow for lame people to disable the pretty rendering.
            if (!this.settings.prettyRenderInlineFields || isDataviewDisabled(ctx.sourcePath)) return;

            // Handle p, header elements explicitly (opt-in rather than opt-out for now).
            for (let p of el.findAllSelf("p,h1,h2,h3,h4,h5,h6,li,span,th,td")) {
                const init: DataviewInit = {
                    app: this.app,
                    index: this.index,
                    settings: this.settings,
                    container: p,
                };

                await replaceInlineFields(ctx, init);
            }
        });

        // editor extensions
        this.cmExtension = [];
        this.registerEditorExtension(this.cmExtension);
        this.updateEditorExtensions();

        // Dataview "force refresh" operation.
        this.addCommand({
            id: "dataview-force-refresh-views",
            name: "强制刷新所有视图和区块",
            callback: () => {
                this.index.revision += 1;
                this.app.workspace.trigger("dataview:refresh-views");
            },
        });

        this.addCommand({
            id: "dataview-drop-cache",
            name: "删除所有缓存的文件元数据",
            callback: () => {
                this.index.reinitialize();
            },
        });

        interface WorkspaceLeafRebuild extends WorkspaceLeaf {
            rebuildView(): void;
        }

        this.addCommand({
            id: "dataview-rebuild-current-view",
            name: "重建当前视图",
            callback: () => {
                const activeView: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (activeView) {
                    (activeView.leaf as WorkspaceLeafRebuild).rebuildView();
                }
            },
        });

        // Run index initialization, which actually traverses the vault to index files.
        if (!this.app.workspace.layoutReady) {
            this.app.workspace.onLayoutReady(async () => this.index.initialize());
        } else {
            this.index.initialize();
        }

        // Not required anymore, though holding onto it for backwards-compatibility.
        this.app.metadataCache.trigger("dataview:api-ready", this.api);
        console.log(`Dataview: version ${this.manifest.version} (requires obsidian ${this.manifest.minAppVersion})`);

        // Mainly intended to detect when the user switches between live preview and source mode.
        this.registerEvent(
            this.app.workspace.on("layout-change", () => {
                this.app.workspace.iterateAllLeaves(leaf => {
                    if (leaf.view instanceof MarkdownView && leaf.view.editor.cm) {
                        leaf.view.editor.cm.dispatch({
                            effects: workspaceLayoutChangeEffect.of(null),
                        });
                    }
                });
            })
        );

        this.registerDataviewjsCodeHighlighting();
        this.register(() => this.unregisterDataviewjsCodeHighlighting());
    }

    public registerDataviewjsCodeHighlighting(): void {
        window.CodeMirror.defineMode(this.settings.dataviewJsKeyword, config =>
            window.CodeMirror.getMode(config, "javascript")
        );
    }

    public unregisterDataviewjsCodeHighlighting(): void {
        window.CodeMirror.defineMode(this.settings.dataviewJsKeyword, config =>
            window.CodeMirror.getMode(config, "null")
        );
    }

    private debouncedRefresh: () => void = () => null;

    private updateRefreshSettings() {
        this.debouncedRefresh = debounce(
            () => this.app.workspace.trigger("dataview:refresh-views"),
            this.settings.refreshInterval,
            true
        );
    }

    public onunload() {
        console.log(`Dataview: version ${this.manifest.version} unloaded.`);
    }

    /** Register a markdown post processor with the given priority. */
    public registerPriorityMarkdownPostProcessor(
        priority: number,
        processor: (el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<void>
    ) {
        let registered = this.registerMarkdownPostProcessor(processor);
        registered.sortOrder = priority;
    }

    /** Register a markdown codeblock post processor with the given priority. */
    public registerPriorityCodeblockPostProcessor(
        language: string,
        priority: number,
        processor: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<void>
    ) {
        let registered = this.registerMarkdownCodeBlockProcessor(language, processor);
        registered.sortOrder = priority;
    }

    public updateEditorExtensions() {
        // Don't create a new array, keep the same reference
        this.cmExtension.length = 0;
        // editor extension for inline queries: enabled regardless of settings (enableInlineDataview/enableInlineDataviewJS)
        this.cmExtension.push(inlinePlugin(this.app, this.index, this.settings, this.api));
        // editor extension for rendering inline fields in live preview
        if (this.settings.prettyRenderInlineFieldsInLivePreview) {
            this.cmExtension.push(inlineFieldsField, replaceInlineFieldsInLivePreview(this.app, this.settings));
        }
        this.app.workspace.updateOptions();
    }

    /**
     * Based on the source, generate a dataview view. This works by doing an initial parsing pass, and then adding
     * a long-lived view object to the given component for life-cycle management.
     */
    public async dataview(
        source: string,
        el: HTMLElement,
        component: Component | MarkdownPostProcessorContext,
        sourcePath: string
    ) {
        el.style.overflowX = "auto";
        this.api.execute(source, el, component, sourcePath);
    }

    /** Generate a DataviewJS view running the given source in the given element. */
    public async dataviewjs(
        source: string,
        el: HTMLElement,
        component: Component | MarkdownPostProcessorContext,
        sourcePath: string
    ) {
        el.style.overflowX = "auto";
        this.api.executeJs(source, el, component, sourcePath);
    }

    /** Render all dataview inline expressions in the given element. */
    public async dataviewInline(
        el: HTMLElement,
        component: Component | MarkdownPostProcessorContext,
        sourcePath: string
    ) {
        if (isDataviewDisabled(sourcePath)) return;

        // Search for <code> blocks inside this element; for each one, look for things of the form `= ...`.
        let codeblocks = el.querySelectorAll("code");
        for (let index = 0; index < codeblocks.length; index++) {
            let codeblock = codeblocks.item(index);

            // Skip code inside of pre elements if not explicitly enabled.
            if (
                codeblock.parentElement &&
                codeblock.parentElement.nodeName.toLowerCase() == "pre" &&
                !this.settings.inlineQueriesInCodeblocks
            )
                continue;

            let text = codeblock.innerText.trim();
            if (this.settings.inlineJsQueryPrefix.length > 0 && text.startsWith(this.settings.inlineJsQueryPrefix)) {
                let code = text.substring(this.settings.inlineJsQueryPrefix.length).trim();
                if (code.length == 0) continue;

                component.addChild(new DataviewInlineJSRenderer(this.api, code, el, codeblock, sourcePath));
            } else if (this.settings.inlineQueryPrefix.length > 0 && text.startsWith(this.settings.inlineQueryPrefix)) {
                let potentialField = text.substring(this.settings.inlineQueryPrefix.length).trim();
                if (potentialField.length == 0) continue;

                let field = tryOrPropogate(() => parseField(potentialField));
                if (!field.successful) {
                    let errorBlock = el.createEl("div");
                    renderErrorPre(errorBlock, `Dataview (inline field '${potentialField}'): ${field.error}`);
                } else {
                    let fieldValue = field.value;
                    component.addChild(
                        new DataviewInlineRenderer(
                            fieldValue,
                            text,
                            el,
                            codeblock,
                            this.index,
                            sourcePath,
                            this.settings,
                            this.app
                        )
                    );
                }
            }
        }
    }

    /** Update plugin settings. */
    async updateSettings(settings: Partial<DataviewSettings>) {
        Object.assign(this.settings, settings);
        this.updateRefreshSettings();
        await this.saveData(this.settings);
    }

    /** @deprecated Call the given callback when the dataview API has initialized. */
    public withApi(callback: (api: DataviewApi) => void) {
        callback(this.api);
    }

    /**
     * Create an API element localized to the given path, with lifecycle management managed by the given component.
     * The API will output results to the given HTML element.
     */
    public localApi(path: string, component: Component, el: HTMLElement): DataviewInlineApi {
        return new DataviewInlineApi(this.api, component, el, path);
    }
}

/** All of the dataview settings in a single, nice tab. */
class GeneralSettingsTab extends PluginSettingTab {
    constructor(app: App, private plugin: DataviewPlugin) {
        super(app, plugin);
    }

    public display(): void {
        this.containerEl.empty();

        new Setting(this.containerEl)
            .setName("启用内联查询")
            .setDesc("启用或禁用执行常规内联 Dataview 查询。")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.enableInlineDataview)
                    .onChange(async value => await this.plugin.updateSettings({ enableInlineDataview: value }))
            );

        new Setting(this.containerEl)
            .setName("启用 JavaScript 查询")
            .setDesc("启用或禁用执行 DataviewJS 查询。")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.enableDataviewJs)
                    .onChange(async value => await this.plugin.updateSettings({ enableDataviewJs: value }))
            );
        new Setting(this.containerEl)
            .setName("启用内联 JavaScript 查询")
            .setDesc(
                "启用或禁用执行内联 DataviewJS 查询。需要启用 DataviewJS 查询。"
            )
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.enableInlineDataviewJs)
                    .onChange(async value => await this.plugin.updateSettings({ enableInlineDataviewJs: value }))
            );

        new Setting(this.containerEl)
            .setName("在阅读视图中启用内联字段高亮显示")
            .setDesc("启用或禁用在阅读视图中内联字段的视觉高亮显示/美观渲染。")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.prettyRenderInlineFields)
                    .onChange(async value => await this.plugin.updateSettings({ prettyRenderInlineFields: value }))
            );

        new Setting(this.containerEl)
            .setName("在实时预览中启用内联字段高亮显示")
            .setDesc("启用或禁用在实时预览中内联字段的视觉高亮显示/美观渲染。")
            .addToggle(toggle =>
                toggle.setValue(this.plugin.settings.prettyRenderInlineFieldsInLivePreview).onChange(async value => {
                    await this.plugin.updateSettings({ prettyRenderInlineFieldsInLivePreview: value });
                    this.plugin.updateEditorExtensions();
                })
            );

        new Setting(this.containerEl).setName("代码块").setHeading();

        new Setting(this.containerEl)
            .setName("DataviewJS 关键字")
            .setDesc(
                "DataviewJS 代码块的关键字。默认为 'dataviewjs'。更改后需要重新加载才能生效。"
            )
            .addText(text =>
                text
                    .setPlaceholder("dataviewjs")
                    .setValue(this.plugin.settings.dataviewJsKeyword)
                    .onChange(async value => {
                        if (value.length == 0) return;
                        this.plugin.unregisterDataviewjsCodeHighlighting();
                        await this.plugin.updateSettings({ dataviewJsKeyword: value });
                        this.plugin.registerDataviewjsCodeHighlighting();
                    })
            );

        new Setting(this.containerEl)
            .setName("内联查询前缀")
            .setDesc("内联查询的前缀（用于将其标记为 Dataview 查询）。默认为 '='。")
            .addText(text =>
                text
                    .setPlaceholder("=")
                    .setValue(this.plugin.settings.inlineQueryPrefix)
                    .onChange(async value => {
                        if (value.length == 0) return;

                        await this.plugin.updateSettings({ inlineQueryPrefix: value });
                    })
            );

        new Setting(this.containerEl)
            .setName("JavaScript 内联查询前缀")
            .setDesc("JavaScript 内联查询的前缀（用于将其标记为 DataviewJS 查询）。默认为 '$='。")
            .addText(text =>
                text
                    .setPlaceholder("$=")
                    .setValue(this.plugin.settings.inlineJsQueryPrefix)
                    .onChange(async value => {
                        if (value.length == 0) return;

                        await this.plugin.updateSettings({ inlineJsQueryPrefix: value });
                    })
            );

        new Setting(this.containerEl)
            .setName("代码块内联查询")
            .setDesc("如果启用，内联查询也将在完整的代码块中进行评估。")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.inlineQueriesInCodeblocks)
                    .onChange(async value => await this.plugin.updateSettings({ inlineQueriesInCodeblocks: value }))
            );

        new Setting(this.containerEl).setName("视图").setHeading();

        new Setting(this.containerEl)
            .setName("显示结果计数")
            .setDesc("如果关闭，TASK 和 TABLE 查询结果标题中的小数字将被隐藏。")
            .addToggle(toggle =>
                toggle.setValue(this.plugin.settings.showResultCount).onChange(async value => {
                    await this.plugin.updateSettings({ showResultCount: value });
                    this.plugin.index.touch();
                })
            );

        new Setting(this.containerEl)
            .setName("空结果警告")
            .setDesc("如果设置，当查询返回 0 结果时，将显示警告消息。")
            .addToggle(toggle =>
                toggle.setValue(this.plugin.settings.warnOnEmptyResult).onChange(async value => {
                    await this.plugin.updateSettings({ warnOnEmptyResult: value });
                    this.plugin.index.touch();
                })
            );

        new Setting(this.containerEl)
            .setName("将 null 渲染为")
            .setDesc("在表格中，默认情况下，null/不存在的内容应显示为。这支持 Markdown 标记。")
            .addText(text =>
                text
                    .setPlaceholder("-")
                    .setValue(this.plugin.settings.renderNullAs)
                    .onChange(async value => {
                        await this.plugin.updateSettings({ renderNullAs: value });
                        this.plugin.index.touch();
                    })
            );

        new Setting(this.containerEl)
            .setName("自动视图刷新")
            .setDesc(
                "如果启用，当你的仓库中的文件发生变化时，视图将自动刷新；这可能会对一些功能（如视图中的嵌入）产生负面影响，因此如果此类功能不起作用，请将其关闭。"
            )
            .addToggle(toggle =>
                toggle.setValue(this.plugin.settings.refreshEnabled).onChange(async value => {
                    await this.plugin.updateSettings({ refreshEnabled: value });
                    this.plugin.index.touch();
                })
            );

        new Setting(this.containerEl)
            .setName("刷新间隔")
            .setDesc("在更新视图之前等待文件停止更改的时间（以毫秒为单位）。")
            .addText(text =>
                text
                    .setPlaceholder("500")
                    .setValue("" + this.plugin.settings.refreshInterval)
                    .onChange(async value => {
                        let parsed = parseInt(value);
                        if (isNaN(parsed)) return;
                        parsed = parsed < 100 ? 100 : parsed;
                        await this.plugin.updateSettings({ refreshInterval: parsed });
                    })
            );

        let dformat = new Setting(this.containerEl)
            .setName("日期格式")
            .setDesc(
                "默认日期格式（参见 Luxon 日期格式选项）。" +
                " 当前格式: " +
                DateTime.now().toFormat(this.plugin.settings.defaultDateFormat, { locale: currentLocale() })
            )
            .addText(text =>
                text
                    .setPlaceholder(DEFAULT_QUERY_SETTINGS.defaultDateFormat)
                    .setValue(this.plugin.settings.defaultDateFormat)
                    .onChange(async value => {
                        dformat.setDesc(
                            "默认日期格式（参见 Luxon 日期格式选项）。" +
                            " 当前格式: " +
                            DateTime.now().toFormat(value, { locale: currentLocale() })
                        );
                        await this.plugin.updateSettings({ defaultDateFormat: value });

                        this.plugin.index.touch();
                    })
            );

        let dtformat = new Setting(this.containerEl)
            .setName("日期和时间格式")
            .setDesc(
                "默认日期和时间格式（参见 Luxon 日期格式选项）。" +
                " 当前格式: " +
                DateTime.now().toFormat(this.plugin.settings.defaultDateTimeFormat, { locale: currentLocale() })
            )
            .addText(text =>
                text
                    .setPlaceholder(DEFAULT_QUERY_SETTINGS.defaultDateTimeFormat)
                    .setValue(this.plugin.settings.defaultDateTimeFormat)
                    .onChange(async value => {
                        dtformat.setDesc(
                            "默认日期和时间格式（参见 Luxon 日期格式选项）。" +
                            " 当前格式: " +
                            DateTime.now().toFormat(value, { locale: currentLocale() })
                        );
                        await this.plugin.updateSettings({ defaultDateTimeFormat: value });

                        this.plugin.index.touch();
                    })
            );

        new Setting(this.containerEl).setName("表格").setHeading();

        new Setting(this.containerEl)
            .setName("主列名称")
            .setDesc(
                "表格中默认 ID 列的名称；这是自动生成的第一列，链接到源文件。"
            )
            .addText(text =>
                text
                    .setPlaceholder("File")
                    .setValue(this.plugin.settings.tableIdColumnName)
                    .onChange(async value => {
                        await this.plugin.updateSettings({ tableIdColumnName: value });
                        this.plugin.index.touch();
                    })
            );

        new Setting(this.containerEl)
            .setName("分组列名称")
            .setDesc(
                "当表格显示分组数据时，默认 ID 列的名称；这是自动生成的第一列，链接到源文件/组。"
            )
            .addText(text =>
                text
                    .setPlaceholder("Group")
                    .setValue(this.plugin.settings.tableGroupColumnName)
                    .onChange(async value => {
                        await this.plugin.updateSettings({ tableGroupColumnName: value });
                        this.plugin.index.touch();
                    })
            );

        new Setting(this.containerEl).setName("任务").setHeading();

        let taskCompletionSubsettingsEnabled = this.plugin.settings.taskCompletionTracking;
        let taskCompletionInlineSubsettingsEnabled =
            taskCompletionSubsettingsEnabled && !this.plugin.settings.taskCompletionUseEmojiShorthand;

        new Setting(this.containerEl)
            .setName("自动任务完成跟踪")
            .setDesc(
                createFragment(el => {
                    el.appendText(
                        "如果启用，当在 Dataview 视图中勾选任务时，Dataview 将自动附加任务的完成日期。"
                    );
                    el.createEl("br");
                    el.appendText(
                        "示例（使用默认字段名称和日期格式）：- [x] 我的任务 [completion:: 2022-01-01]"
                    );
                })
            )
            .addToggle(toggle =>
                toggle.setValue(this.plugin.settings.taskCompletionTracking).onChange(async value => {
                    await this.plugin.updateSettings({ taskCompletionTracking: value });
                    taskCompletionSubsettingsEnabled = value;
                    this.display();
                })
            );

        let taskEmojiShorthand = new Setting(this.containerEl)
            .setName("使用表情符号简写完成任务")
            .setDisabled(!taskCompletionSubsettingsEnabled);
        if (taskCompletionSubsettingsEnabled)
            taskEmojiShorthand
                .setDesc(
                    createFragment(el => {
                        el.appendText(
                            '如果启用，将使用表情符号简写而不是内联字段格式来填写隐式任务字段“完成”。'
                        );
                        el.createEl("br");
                        el.appendText("示例：- [x] 我的任务 ✅ 2022-01-01");
                        el.createEl("br");
                        el.appendText(
                            "禁用此选项以自定义完成日期格式或字段名称，或使用 Dataview 内联字段格式。"
                        );
                        el.createEl("br");
                        el.appendText('仅在启用“自动任务完成跟踪”时可用。');
                    })
                )
                .addToggle(toggle =>
                    toggle.setValue(this.plugin.settings.taskCompletionUseEmojiShorthand).onChange(async value => {
                        await this.plugin.updateSettings({ taskCompletionUseEmojiShorthand: value });
                        taskCompletionInlineSubsettingsEnabled = taskCompletionSubsettingsEnabled && !value;
                        this.display();
                    })
                );
        else taskEmojiShorthand.setDesc('仅在启用“自动任务完成跟踪”时可用。');

        let taskFieldName = new Setting(this.containerEl)
            .setName("完成字段名称")
            .setDisabled(!taskCompletionInlineSubsettingsEnabled);
        if (taskCompletionInlineSubsettingsEnabled)
            taskFieldName
                .setDesc(
                    createFragment(el => {
                        el.appendText(
                            "当在 Dataview 视图中切换任务的复选框时，作为任务完成日期的内联字段键使用的文本。"
                        );
                        el.createEl("br");
                        el.appendText(
                            '仅在启用“自动任务完成跟踪”和禁用“使用表情符号简写完成任务”时可用。'
                        );
                    })
                )
                .addText(text =>
                    text.setValue(this.plugin.settings.taskCompletionText).onChange(async value => {
                        await this.plugin.updateSettings({ taskCompletionText: value.trim() });
                    })
                );
        else
            taskFieldName.setDesc(
                '仅在启用“自动任务完成跟踪”和禁用“使用表情符号简写完成任务”时可用。'
            );

        let taskDtFormat = new Setting(this.containerEl)
            .setName("完成日期格式")
            .setDisabled(!taskCompletionInlineSubsettingsEnabled);
        if (taskCompletionInlineSubsettingsEnabled) {
            let descTextLines = [
                "当在 Dataview 视图中切换任务的复选框时，任务完成日期的日期时间格式（参见 Luxon 日期格式选项）。",
                '仅在启用“自动任务完成跟踪”和禁用“使用表情符号简写完成任务”时可用。',
                "当前格式: ",
            ];
            taskDtFormat
                .setDesc(
                    createFragment(el => {
                        el.appendText(descTextLines[0]);
                        el.createEl("br");
                        el.appendText(descTextLines[1]);
                        el.createEl("br");
                        el.appendText(
                            descTextLines[2] +
                            DateTime.now().toFormat(this.plugin.settings.taskCompletionDateFormat, {
                                locale: currentLocale(),
                            })
                        );
                    })
                )
                .addText(text =>
                    text
                        .setPlaceholder(DEFAULT_SETTINGS.taskCompletionDateFormat)
                        .setValue(this.plugin.settings.taskCompletionDateFormat)
                        .onChange(async value => {
                            taskDtFormat.setDesc(
                                createFragment(el => {
                                    el.appendText(descTextLines[0]);
                                    el.createEl("br");
                                    el.appendText(descTextLines[1]);
                                    el.createEl("br");
                                    el.appendText(
                                        descTextLines[2] +
                                        DateTime.now().toFormat(value.trim(), { locale: currentLocale() })
                                    );
                                })
                            );
                            await this.plugin.updateSettings({ taskCompletionDateFormat: value.trim() });
                            this.plugin.index.touch();
                        })
                );
        } else {
            taskDtFormat.setDesc(
                '仅在启用“自动任务完成跟踪”和禁用“使用表情符号简写完成任务”时可用。'
            );
        }
        new Setting(this.containerEl)
            .setName("递归子任务完成")
            .setDesc("如果启用，在 Dataview 中完成任务将自动完成其子任务。")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.recursiveSubTaskCompletion)
                    .onChange(async value => await this.plugin.updateSettings({ recursiveSubTaskCompletion: value }))
            );
    }
}
