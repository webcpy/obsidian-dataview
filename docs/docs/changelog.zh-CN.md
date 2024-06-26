# 0.5.66

修复了版本比较中的一个错误，解决了其他插件与Dataview交互时出现的一些问题。

---

# 0.5.65

一个维护更新，修复了一些Dataview中渲染嵌入内容的问题，并添加了一些新功能。

- 添加了`hash()`函数，用于生成基于任意输入的一致的均匀分布的值。主要用于创建在页面刷新后仍保持一致的“随机”视图。感谢@holroy。
- 添加了`slice()`函数，用于对数组进行切片操作，类似于Javascript的`Array.slice`。感谢@holroy。
- 修复了在Dataview中渲染嵌入内容时出现的多个问题。感谢@GottZ。
- 对任务相关的文档进行了多项改进。感谢@holroy和@RaviOnline。

---

# 0.5.64

更多修复了内联字段渲染的错误。

---

# 0.5.63

- @RyotaUshio修复了Markdown段落和其他DataviewJS块的渲染问题。

---

# 0.5.62

@RyotaUshio进行了更多内联字段修复，包括更多的配置选项，修复了内联字段在代码块内渲染的问题，以及更多。谢谢！

---

# 0.5.61

- @RyotaUshio：修复了与新内联字段渲染相关的多个错误，包括源模式和日期格式化问题。

---

# 0.5.60

- @RyotaUshio：在实时预览中显式渲染内联字段。它们现在更加明显！
- @MarioRicalde：在插件API中添加了`PluginApi#evaluateInline(expression, path)`，该方法允许在给定页面上评估表达式。

---

# 0.5.59

- 修复了插件在iOS上运行失败的问题，原因是一个罕见的正则表达式问题。

---

# 0.5.58

- 负数持续时间现在将被正确渲染。

---

# 0.5.57

维护补丁，更新了许多内部依赖版本，并包含了大约20个社区贡献的PR，添加了一些新功能，修复了一些Dataview与属性的交互问题等！

---

# 未发布

- DQL：添加了新的`durationformat(duration, string)`函数。
- DQL：添加了新的数学舍入函数，`trunc(number)`，`floor(number)`，`ceil(number)`。

# 0.5.56

- 包括了一些性能修复，针对Obsidian 1.3+的最新版本，感谢@kometenstaub。
- 文档清理和改进，感谢@mocsa，@protofarer，@seanlzx，和@somidad。
- 添加了新的`flat(array)`方法用于扁平化嵌套数组，以及使用`date(text, "format")`解析使用任意格式的日期。感谢@holroy！

---

# 0.5.55

- 持续时间现在使用luxon的新国际化支持进行了国际化。
- Dataview应该现在在Canvas和一些其他上下文中正确渲染。感谢@GamerGirlandCo！

---

# 0.5.54

- 在任务视图中，普通列表项现在也可以点击，而不仅仅是任务行！感谢@LilaRest。

---

# 0.5.53

- 修复了一些导致文档未更新的文档问题。

---

# 0.5.52

感谢@s-blu和@AB1908的大量文档改进！

- 对于担心从复制粘贴中执行dataviewjs代码的人，@eyuelt已经使其可以更改dataviewjs代码块前缀。
- @sohanglal为`task.visual`添加了一些文档，用于更改任务的视觉文本。
- @Chouffy和@Daryl-Horton修复了一些错误的文档链接！
- @vrtmrz将用于解析标签的正则表达式更改为更好地匹配Obsidian的解析器。
- @alexfertel添加了`regextest`，它允许匹配字符串的一部分，而不是整个字符串。
- @iamrecursion为文件链接添加了更多元数据，现在它们包括部分元数据。这可能会导致链接视图中的一些细微视觉变化。

---

# 0.5.51（测试版）

- 允许通过配置选项禁用常规Dataview内联查询。

---

# 0.5.50（测试版）

- 将Dataview表达式和查询的解析暴露给dataview npm插件，以便其他人可以解析Dataview ASTs。
- 修复了`join`的文档问题。

---

# 0.5.49 (Beta)

- 添加了 `average` 函数，用于计算列表的平均值 (`average([things的列表])`)。
- 为 `average`、`min`、`max`、`minby` 和 `maxby` 函数添加了文档。
- 修复了 `nonnull` 函数的错误，并提供了相关文档。

---

# 0.5.48 (Beta)

我们恢复了更频繁的Beta版本发布，以便测试新功能！

- 修复了 `dv.markdownTaskList` 中列表行为的错误。
- @GamerGirlandCo：改进了勾选任务时对块ID的处理！
- @s-blu 和 @AB1908：大量的文档升级！做得好！
- @leoccyao：更多关于块ID任务检查的修复。这次之后应该可以正常工作。
- 在dataview NPM包中添加了表达式/查询解析功能。
- @charleshan：修复了dataview `dv.header` 示例中的缺失的标题级别。

---

# 0.5.47

改进了 `date + duration` 行为，当日期或持续时间为null时也能正确处理。

---

# 0.5.46

- 修复了 #1412：由于错误设置的时区，修复了 `file.cday` 和 `file.ctime` 的不正确比较。哎。

---

# 0.5.45

- #1400：正确使用用于分组名称的分组字段。
- 修复了一些主题中表格高亮显示的问题。

---

# 0.5.44

- #1404：修复了非本地时区中的日期解析错误。
- 解决了一些构建非确定性问题。
- 改用拉取请求来添加新功能，并增加了一些内部测试。

---

# 0.5.43

- 修复 #1366：更好地处理用于任务截止日期的日历表情符号。

---

# 0.5.42

已经有一个多月没有发布新版本了！不管怎样，这个版本包含了几个用户贡献的特色功能：

- @AB1908：标签查询现在不区分大小写。
- @AB1908：在Mac上，现在可以通过Shift-点击链接/任务来在新标签页中打开。
- @AB1908：进行了大量文档修正，以提高清晰度和增加示例。
- @AnnaKornfeldSimpson：为更多任务字段（完成、截止）添加了额外的表情符号缩写。
- @ooker777：对DataviewJS函数的文档进行了改进，并支持使用内联表情符号来跟踪完成情况。
- @mt-krainski：为任务完成提供了自定义日期格式。
- @gentlegiantJGC：更好地支持嵌套内联字段（即，崩溃更少）。

---

# 0.5.41

- 修复了在Markdown表格中进行转义的不良正则表达式。
- 改进了异步文档。

---

# 0.5.40

添加了一些关于新Markdown功能的文档。

---

# 0.5.39

- 修复了一个问题，即在任务视图中勾选任务会错误地视觉上检查错误的框。
- 添加了实验性的插件API，用于直接查询dataview作为Markdown，并将dataview结果转换为格式良好的Markdown。

---

# 0.5.38

- 进行了一些小的文档改进。
- 修复了一个问题，即内联字段的渲染顺序不正确。这是一个奇怪的bug。

---

# 0.5.37

修复了内联字段的渲染，使其再次适用于高亮显示/链接，以及内联查询在代码块中的其他渲染怪癖。

---

# 0.5.36

- 修复了一个错误，即检查一个元素是否是HTMLElement。
- 正确地包含了文件计数在表格和列表中的改进。

---

# 0.5.35

- 修复了 #1196，#1176：重新启用HTML值。这从未是我宣传的功能，因为它只是用于一些内部hackery，但似乎人们在DataviewJS查询中发现了它。
- 提高了使用 `file.starred` 的流行查询的初始时间。

---

# 0.5.34

- 修复了 #1174：修复了使用变量进行索引的问题。
- 修复了实验性日历视图中的一个问题。

---

# 0.5.33

- 修复了在0.5.32中引入的一个内联视图的bug。

---

# 0.5.32

Dataview API 已经有了显著的更新——现在插件 API 上可用的函数大约是更新前的两倍，同时为插件和内联 API 添加了一些额外的实用工具。我很快将完成相关的新“扩展”功能，这将允许：

1. 通过插件添加自定义的 Dataview + DataviewJS 函数。
2. 通过插件向任何 Dataview 视图添加可渲染对象（进度条、嵌入式任务列表、嵌入式表格）。
3. 插件提供一些 Dataview 功能的替代行为（例如，将任务插件与 Dataview 任务查询集成）。

随着 API 的更新，现在可以使用程序方式执行 Dataview 和 DataviewJS 查询——既可以用于在自己的插件中使用现有的 Dataview 查询语言，也可以用于嵌入 Dataview。Dataview npm 库现在也公开了许多有用的内部 Dataview 类型，包括所有 Dataview 查询的 AST 结构。

我希望通过清理 Dataview API 并使其更具扩展性，能让 Dataview 更好地与现有插件集成，并为插件提供内存索引的全部功能。我最近一直在密切关注索引性能，以确保使用 API 的任何人前端性能平滑（目标是大多数查询的执行时间<10ms）。

---

# 0.5.31

任务现在有一个 `outlinks` 列表字段，其中包含了任务中所有的链接；这可以用来查找包含链接的任务。

---

# 0.5.30

- 在 Dataview 中添加了 `typeof(any)` 函数，该函数用于获取任何值的类型以进行比较：

```javascript
typeof("text") = "string"
typeof(1) = "number"
typeof([1, 2, 3]) = "array"
```

```markdown
- 添加了模运算符 (`%`) 用于执行整数除法余数。例如，`14 % 2 = 0` 和 `14 % 3 = 2`。
- 修复了表格中列表的某些小间距问题。

---

# 0.5.29

修正了0.4.26与0.5.29之间的另一个细微不兼容性——如果你经常使用空的内联字段（如`Key::`没有值），那么0.5+的行为现在与0.4的行为相同，将这些字段映射为null，而不是空字符串。

这可能解决了升级后你可能遇到的各种“微妙错误”的查询。

---

# 0.5.28

- 修复了一些字符串拼接和空值处理的错误。

---

# 0.5.27

更多的性能和正确性错误修复。

- 解析器变得更加健壮，以防止（或快速恢复）主要的索引问题。
- 支持了一些新的奇怪的标签变体。
- Markdown链接现在再次被正确索引。

DataviewJS的一些性能问题现在应该已经解决，特别是对于使用Dataview的外部插件。此修复涉及到API的轻微断开连接，相对于哪些类型被包装到Dataview数组中（提供了`.where()`等函数）。通常，只有Dataview提供的隐式被包装到数据数组中；元数据和内联字段现在总是普通的JS数组——如果你想使用高级查询，请使用`dv.array()`显式创建一个数据数组。

---

# 0.5.26

更多的小错误修复：

- 修复了一些小的链接渲染问题。
- 从任务中提取标签现在正确处理标点符号。
- 将嵌入在DataviewJS中的luxon升级到2.4.0。

---

# 0.5.25

- 修复#1147：修正了空的`tag`或`tags`元数据导致的`#null`标签问题。

---

# 0.5.24

多个错误修复：

- 空值现在首先排序，而不是最后，通常在查询中显式检查null值以避免奇怪的行为。
- Dataview现在正确解析空格分隔的标签（如`tags: abc def ghi`）。
- Dataview现在支持在遇到错误时丢弃整个文件缓存。

---

# 0.5.23

- 修复#1140：强制API对象为数组，如果它们是可迭代的。

---

# 0.5.22

- 修复#1135：使用'x'代替'X'来表示复选框。

---

# 0.5.21

长期推迟的从beta分支切换到稳定分支。Beta分支不应该包含任何（有意的）重大变更，并且还带来了一些不错的性能改进。以下是主要变更：

- 大多数视图现在使用React，并且更新时不再闪烁；DataviewJS还没有获得同等处理，但将来会得到。
- Dataview现在缓存元数据，所以打开你的保管库后，Dataview的加载非常快。当更新插件版本时，Dataview仍需访问每个文件，所以这是你唯一会遇到加载时间变慢的时候。
- 一个全新的任务视图后端和查询，允许你按任务过滤，而不是按页面！请查看文档了解详情，但总的来说，`WHERE`语句现在使用任务属性而不是页面属性。
- 可供使用的额外元数据更多了——`file.starred`、`file.lists`等，以及`file.tasks`中的更多元数据。

文档也进行了一些适度的更新，以保持更新；我仍在编写关于常见Dataview用例的演练。此审查还包括约30-40个错误修复；由于内部变更，可能会出现一些新的错误，请在遇到时标记它们。

---

# 0.5.20 (Beta)

对可能改进一些奇怪的启动时索引问题进行了轻微修复。

---

# 0.5.19 (Beta)

Dataview现在使用IndexedDB来缓存文件元数据，如果之前打开过保管库，启动时间几乎为零；如果你有一个小的保管库（<1000个笔记），你可能会注意到一些轻微的改进，但对于大型保管库和移动设备，会注意到性能提升非常显著，对“首次有效渲染”。还调整了一些其他性能参数，以希望使默认体验更好。

还解决了一些与渲染相关的其他小错误，包括图片缩放不正确的问题。
```
请注意，由于翻译后的文本需要适应Markdown格式，因此上述文本中的标题和列表格式保持不变。如果原始Markdown包含任何特定的格式化指令或语法，可能需要额外的调整以确保输出在Markdown解析器中保持有效。

---

# 0.5.18（Beta）

- 在任务视图中，任务现在支持使用'!'和'/'等替代任务状态字符；感谢 @ebullient。
- 完成了部分文档的细节修正。
- 添加了`DataArray#sortInPlace`方法，为特定使用场景提供了更高效的可变排序功能。

---

# 0.5.17（Beta）

- 在任务视图中点击任务时的行为得到改进，现在可以正确滚动到长文件中的相关行！
- 修正了任务视图中显示错误计数的问题。
- 为任务项添加了`tags`字段，现在可以通过`TASK WHERE contains(tags, "#tag")`等方式进行操作。

---

# 0.5.16（Beta）

Dataview现在能够追踪初始化过程，并在控制台报告所有文件已索引的情况；您可以通过`dataview:index-ready`或检查`api.index.initialized`来编程式地查看这一状态。

---

# 0.5.15（Beta）

- 在表格中添加了悬停高亮，使查看行变得更简单。
- 表格和任务列表现在在表头中包含了结果数量的计数。
- 进一步改进了任务视图中的任务选择功能。

---

# 0.5.14（Beta）

- 修正了未分组时任务高亮显示的问题。
- 移除了一些多余的控制台日志。
- 稍微改进了点击任务时的任务高亮行为。

---

# 0.5.13（Beta）

修正了几个较小的错误！

- 修正了#997：在表格名称中使用分组字段名称。
- 防止了如果错误设置内联查询前缀时出现大量错误。

---

# 0.5.12（Beta）

对查询的错误信息进行了改进，并消除了某些不美观的输出。

---

# 0.5.11（Beta）

检测了块引用中的任务，并正确实现了这些任务的自动检查和取消检查。

---

# 0.5.10（Beta）

添加了`Dataview: Force Refresh Views`命令（可通过Ctrl+P命令视图访问），用于立即刷新当前视图。

---

# 0.5.9（Beta）

再次修正了与任务截止日期相关的表情符号问题。我讨厌表情符号。

---

# 0.5.8（Beta）

修正了一些由于不良的Obsidian元数据（可能是由于过时？）导致的无限任务循环问题。

---

# 0.5.7（Beta）

修正了解析任务上的'🗓️2021-08-29'截止日期注释的问题，以及正确提取截止/完成/完成时间以便在查询中使用的问题。

---

# 0.5.6（Beta）

0.5.5的正式发布以及一个小改进：

- 添加了`duration * number`和`duration / number`操作，用于对持续时间进行数值操作。

---

# 0.5.5（Beta）

更多的小特性：

- 修正了任务排序不起作用的问题。尽情排序吧！
- 表格头部现在可以是任意的Markdown。因此，您可以在头部放置类似链接的内容：`TABLE (1 + 2) AS "[[File]]"`。
- 您现在可以通过在显示属性中提供WxH来指定图像嵌入的大小：`![[image.png|50x50]]`。

---

# 0.5.4（Beta）

改进了某些链接类型的图像渲染，并添加了`embed(link)`和`embed(link, false)`选项，用于在嵌入链接和其等效形式之间进行转换。

---

# 0.5.3（Beta）

这是一个迭代Beta版本，添加了一些不错的QoL功能并修正了一些其他错误：

- 内部已切换到基于React的渲染器；这不应有明显的性能或可用性影响，但使实现复杂的表格/列表行为变得更容易。
- 现在，为字段命名时使用`AS "Name"`是可选的；Dataview将自动从表达式推断名称。例如，`TABLE 8 + 4, 3 + 6 FROM ...`现在是一个有效的表格表达式，列将分别被命名为`8 + 4`和`3 + 6`。
- 修正了一些数组和对象渲染的问题。
- 对于所有视图，空的dataview结果的错误消息得到了改进，并且现在会显示出来。

在Dataview表格和列表中，现在可以正确渲染内联图像，不再需要使用`app://local/`的变通方法！

---

# 0.5.2（Beta）

- 修正了#971：现在，DataviewQL评估中的对象可以正常工作。

---

# 0.5.1 (Beta)

- 暂时回退新的任务元数据行为：在任务的子列表中的内联字段会被添加到页面上，而不是任务本身。虽然这种行为不是很好，但它与任务元数据的遗留用法兼容，应该可以修复一些现有查询。
   - 这种行为将来会在一个标志后面被移除。
- 向任务中添加了“视觉”字段 - 如果设置，任务将显示“视觉”而不是它们的常规文本。
- 修复了 `DataArray#mutate()`。

---

# 0.5.0 (Beta)

重新发布损坏的版本0.4.23，现在希望它能在（大多数）机器上正常工作。我将进行一段时间的beta发布，直到我可以确认新版本稳定；如果您对尖端功能感兴趣，可以使用BRAT (<***>) 轻松跟踪Dataview的beta版本。

---

# 0.4.25

修复 #867：为每个任务列表创建一个容器div，以允许多个任务视图。

---

# 0.4.24

重新发布0.4.23f版本，因为Obsidian不会在非semver版本之间自动更新。

---

# 0.4.23f

移除了一些尝试使标签查询不区分大小写的代码；我将稍后更广泛地重新实现这一点（它与现有的查询冲突，这些查询通过类似`contains(file.tags, "#Tag")`的方式检查标签）。

---

# 0.4.23e

更多任务bug修复/改进，以及一个导致任务元数据重复的修复。

---

# 0.4.23d

更多内联字段列表解析的bug修复。希望我们已经恢复到一个很好的工作状态！

---

# 0.4.23c

修复了支持“1)”样式列表的bug，以及一个非常烦人的JavaScript语言问题导致的null问题。

---

# 0.4.23b

为不正确的内链/外链计算修复bug；链接没有被正确规范化，因此反向查找没有正常工作。

# 0.4.23

任务更新！此版本重新设计了数据视图处理任务和列表项的方式，以便它们使用起来更加直观和易于交互：

1. **子任务支持**：查询现在可以搜索所有列表项，而不仅仅是根元素。这将使任务过滤变得更加可用，特别是如果您倾向于将任务放在其他列表项下，或者特别关注子任务。
2. **多行支持**：数据视图现在能够理解多行任务，并正确地渲染/更新它们。
3. **立即导航到任务**：新的任务视图不仅看起来比以前的视图更干净，而且现在在点击时立即导航到任务在其原始文件中的位置并选中它。
4. **分组支持**：对于使用DataviewJS的用户，`dv.taskList`现在支持分组（由`groupBy`和新的`groupIn`生成）。

对于使用DataviewJS的用户，任务和列表的表示已经改变：`file.tasks`（以及新的`file.lists`）现在包含文件中的每个任务（包括子任务），而不仅仅是根元素。您可以通过过滤掉具有非空父元素的任务（即`file.tasks.where(task => !task.parent)`）回到以前的行为。`dv.taskList`将智能地处理任务的正确嵌套和去重，因此只需过滤出您想要渲染的任务，API将完成其余的工作。

此版本还包括一些社区贡献的API改进，为数据视图视图中的实时编辑做准备：

- `DataArray#groupIn`：现在可以使用`array.groupIn(v => ...)`对已经分组的数据进行分组，它将对数组中的原始数据进行分组，而不是顶层组。这使得更容易递归分组，例如`dv.pages().groupBy(page => page.file.folder).groupIn(page => page.title)`将按文件夹对页面进行分组，然后按页面标题进行分组。
- `substring(string, start[, end])`：最后一个重要的字符串函数现在可用！从字符串中提取子串。
- `dv.el()`和其他HTML函数得到了改进 - 感谢@vitaly。
- null和undefined条目默认按末尾排序，而不是开头；对于因为这个原因排序错误的代码表示歉意，但对于大多数用例来说，这是更好的默认设置。
- 所有链接现在都已正确规范化为其完整路径，解决了DataviewJS中许多链接比较边缘情况的问题。

关于新任务功能的文档将在接下来的几天内发布。下一个版本0.4.24目前正在针对扩展的`FROM`查询支持、基本表格视图改进和数据视图的通用导出功能进行开发。敬请期待！

---

# 0.4.22

@pjeby的更新！这包括由@pjeby建议的几个性能改进，以显著提高后台数据视图的性能，并减少一些内存压力。还包括一些小的bug修复和初步功能：

- 目标ES2018，以便更好地支持Promise
- 允许在`dv.date()`中解析简写。
- 为内联字段渲染添加额外的元数据，可以进行样式化。
- 清理事件和工作线程，在插件卸载时改善数据视图的卸载/禁用/重新加载体验。
- 添加初步的`CALENDAR`查询 - 与obsidian-calendar插件类似的渲染，请参阅文档！

数据视图在启动时和当您打开许多标签页时应该会表现得更好 - 再次感谢@pjeby。

---

# 0.4.21

主要修复了数据视图在即将发布的Obsidian版本中的实时预览模式中遇到的问题；数据视图的实时预览现在应该可以正常工作。还包括一些较小的bug修复。

- 修复#646：添加`date(yesterday)`以创建24小时前的日期。
- 修复#618：Luxon现在在数据视图API (`dv.luxon`) 中可用。
- 修复#510：添加`dv.duration()`以解析持续时间。
- 修复#647：数据视图JS API中的所有HTML函数现在返回它们渲染的对象。
- 修复#652：修复无效日期的解析。
- 修复#629：修复块链接解析。
- 修复#601：时区现在在数据视图日期中正确渲染和解析。
- PR #637：添加`meta(link)`，允许您访问有关链接本身的多种元数据。
- 多个次要的空安全修复。
- 数据视图现在在日志中报告其确切版本和构建时间。

---

# 0.4.20

一些功能由其他贡献者开发，而我则在处理节元数据方面消磨时间。可能还会修复一些错误！

- 修正 #448：现在可以使用“任务完成跟踪”选项，通过 Dataview 检查/取消检查任务时，自动添加完成元数据。感谢 @sheeley。
- 在文档中添加搜索栏。感谢 @tzhou。
- 添加新的日期表达式，用于周的开始（`date(sow)`）和结束（`date(eow)`）。感谢 @Jeamee 和 @v_mujunma。

未来可能会有小的次要错误修正/安全版本发布；否则，下一个主要版本将包括节和对象元数据。

---

# 0.4.19

修正了表情解析和本地化问题的错误修正版本。

- 添加了 `DataArray#into`，允许您在不展平的情况下索引对象。
- 将任务元数据中的“header”重命名为“section”；为了方便人们自然过渡，“header”将在未来几个主要版本中保留。
- 修正 #487：在表达式中不再需要在星号（\*）周围添加空格。
- 修正 #559：修复了变量规范化中的Unicode问题，这导致了非拉丁文内联字段键的问题。

## 持续时间解析

现在，您可以在持续时间中包含多个单位：`dur(8 分钟, 4 秒)` 或 `dur(2yr8mo12d)`。您可以使用逗号分隔持续时间，也可以使用缩写语法，带有/没有空格。

---

# 0.4.18

这是一个修复版本，解决了如果在特定顺序中混合使用 ']' 和 '(' 时内联字段高亮显示的问题。

---

# 0.4.17

这是一个小功能版本，用于修补更多的实现漏洞。

## 单文件查询

您现在可以通过指定完整的文件路径来查询特定文件（而不仅仅是文件夹和标签）：

```
TASK FROM "dataview/Test"
...
```

这主要适用于任务查询，但很快也将适用于部分和对象查询。

## 更好的内联字段高亮显示

内联字段高亮显示的 CSS 已经修复，并且一些兼容性问题也得到了改进，因此它现在应该适用于所有主题，而不仅仅是一些主题。

## dv.el()

DataviewJS 现在有 `dv.el()`，它类似于现有的函数如 `dv.paragraph` 和 `dv.span`，但可以创建任何 HTML 元素类型；例如：

```js
dv.el("b", "Text!");
dv.el("i", 18);
```

---

# 0.4.16

这是一个小性能版本，通过分散文件加载，显著降低了 Dataview 对保险库加载时间的影响。Dataview 索引现在也被预先初始化，因此 API 的插件消费者可以立即开始使用它，而不是等待 `dataview:api-ready` 事件。

---

# 0.4.15

这是一个简单的修复，用于正确地在 `dv.view()` 中“等待”值的渲染。修复了值顺序渲染的问题。

---

# 0.4.14

这是一个小型修复版本。

- 修复了在使用新的花哨高亮显示时内联字段的评估。
- 您现在可以在“任务链接位置”设置中配置任务链接是否显示在任务的开始或结束（或完全禁用）。
- 大多数设置更新将立即应用于现有的 Dataview。

---

# 0.4.13

这是一个修复版本，为内联字段添加了花哨的渲染，并包括了一些修复。

## 漂亮的内联字段

形式为 `[key:: value]` 的内联字段现在将以漂亮的 HTML 呈现！默认情况下，它们以键和值的形式呈现。您可以通过括号只渲染值：`(key:: value)`。您可以在配置中禁用此功能。

全行内联字段（Dataview 很久以来一直支持的）将很快获得类似的渲染支持；在那之前，试试这个新语法！

### 任务链接

任务现在会渲染一个指向它们定义的页面/部分的链接，使 `GROUP BY` 和自定义任务编辑更容易执行：

- [ ] 一个任务。🔗
- [ ] 另一个任务。🔗
   - [ ] 一些随机子任务。🔗

您可以在设置中配置链接的符号或完全禁用它。

### 提高 DataviewJS 的姿态

我目前正在积极寻找改进 DataviewJS 沙盒和一般安全姿态的方法。作为第一步，我已经将 DataviewJS 从默认开启改为默认关闭，并添加了一个单独的内联 DataviewJS 控制。如果您使用它，可能需要在设置中重新启用它。

将跟随更多的改进和更好的 JavaScript 沙盒。

---

# 0.4.12-hotfix1

0.4.12 的重新发布，修复了一个重要的索引问题。

- 修复 #505：使用 `completion` 而不是 `completed` 来设置任务完成时间。
- 修复 #509：添加 `startswith` / `endswith` 字符串函数。
- 修复 #488：添加 `padleft` 和 `padright`，以及 `string`。
- 修复 #506, #512：修复日期比较问题，因为一个奇怪的日期区域问题。

---

# 0.4.12

这是一个修复版本，遵循 0.4.11 版本，包括一些小功能添加。

- 修复 #512：日期不相等的奇怪区域问题。
- 修复 #506：与 #512 相同。
- 修复 #488：添加 `padleft` / `padright` 函数。
- 修复 #509：添加 `startswith` 和 `endswith` 函数。
- 修复 #505：正确读取任务的完成日期。

这个版本还包括了由于模仿 Obsidian 插件 API 而改进的测试！

---

# 0.4.11

修复了任务行为并添加了“真正内联”的字段！

## 改进的任务行为

任务查询现在已从其原始基础大大改进——你可以现在过滤、排序和分组它们！`FROM` 块仍然是基于页面的，尽管你可以简单地使用 `WHERE` 来替代。例如，你现在可以访问任务字段，如 `text`、`line` 或 `completed`：

```
TASK WHERE contains(text, "#tag")
WHERE !completed
GROUP BY file.folder
```

所有可用的任务元数据的完整列表可以在这里找到：[任务元数据](***；任务包括所有需要来唯一标识它们的信息，并且会自动继承它们父文件的所有元数据（所以你可以访问 `file.name`，例如）。你也可以在下面的章节中描述的那样，用内联字段注释任务。

还有一些额外的用户体验工作需要做——主要是更轻松地让你导航到任务定义的位置，以及在除了 `TASK` 视图之外的视图中渲染任务。目前的分组语义（使它比现在更直观/有用）可能会被重新审视。

## 内联字段

对真正内联字段的早期支持已经被添加，你可以在句子中间添加元数据。它看起来类似于现有的内联字段语法，但使用方括号或圆括号：

```
我给这个评分为 [rating:: 6]。它是 (thoughts:: 可接受的)。
```

所有内联字段的改进渲染将在即将发布的更新中到来，以改善这些内联字段的视觉外观。

## 问题

- 解决 #496：修复任务 `SORT` 功能以实现其功能。
- 解决 #492：任务现在正确地注释了父文件信息。
- 解决 #498：修复任务勾选/取消勾选的逻辑（由于任务正则表达式的变化而中断）。

---

# 初始

自动变更日志的开始。

