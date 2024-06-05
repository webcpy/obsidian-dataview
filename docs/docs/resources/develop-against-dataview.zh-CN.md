# 针对 Dataview 的开发

Dataview 包含一个面向插件的高级 API、TypeScript 定义以及一个实用程序库；要安装它，请使用：

```bash
npm install -D obsidian-dataview
```

要验证是否安装了正确的版本，可以执行：

```bash
npm list obsidian-dataview
```

如果该命令未能报告最新版本（当前为 0.5.64），可以执行以下命令：

```bash
npm install obsidian-dataview@0.5.64
```

**注意**：如果本地系统尚未安装 [Git](***，则需要先安装它。安装 Git 后可能需要重启设备才能完成安装，然后才能安装 Dataview API。

##### 访问 Dataview API

你可以使用 `getAPI()` 函数来获取 Dataview 插件 API；它返回一个 `DataviewApi` 对象，提供了包括渲染 dataview、检查 dataview 版本、接入 dataview 事件生命周期以及查询 dataview 元数据等在内的各种实用工具。

```ts
import { getAPI } from "obsidian-dataview";

const api = getAPI();
```

要查看所有可用的 API 定义，请参阅 [index.ts](*** 或插件 API 定义 [plugin-api.ts](***。

##### 绑定 Dataview 事件

你可以通过以下方式绑定到 dataview 元数据事件，这些事件会在所有文件更新和更改时触发：

```ts
plugin.registerEvent(plugin.app.metadataCache.on("dataview:index-ready", () => {
     ...
});

plugin.registerEvent(plugin.app.metadataCache.on("dataview:metadata-change",
    (type, file, oldPath?) => { ... }));
```

对于所有绑定在 MetadataCache 上的事件，请查看 [index.ts](***。

##### 值实用工具

你可以访问各种类型实用工具，允许你检查对象类型并使用 `Values` 进行比较：

```ts
import { getAPI, Values } from "obsidian-dataview";

const field = getAPI(plugin.app)?.page('sample.md').field;
if (!field) return;

if (Values.isHtml(field)) // 执行某些操作
else if (Values.isLink(field)) // 执行某些操作
// ...
```

