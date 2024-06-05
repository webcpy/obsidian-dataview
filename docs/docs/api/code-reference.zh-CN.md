# 代码块参考

Dataview JavaScript 代码块使用 `dataviewjs` 语言规范创建：

````
```dataviewjs
dv.table([], ...)
```
````

通过隐式提供的 `dv`（或 `dataview`）变量，可以使用 API 进行查询、渲染 HTML 和配置视图。

异步 API 调用会标记为 `⌛`。

## 查询

查询方法允许您查询 Dataview 索引以获取页面元数据；要渲染这些数据，请使用[渲染部分](#render)中的方法。

### `dv.current()`

获取当前执行脚本的页面信息（通过 `dv.page()`）。

### `dv.pages(source)`

接受单个字符串参数 `source`，这是与[查询语言源](../../reference/sources)相同的形式。返回一个页面对象的[数据数组](../data-array)，这些对象是包含页面字段值的普通对象。

```js
dv.pages() => 你的仓库中所有页面
dv.pages("#books") => 所有带有标签 'books' 的页面
dv.pages('"folder"') => 所有来自文件夹 "folder" 的页面
dv.pages("#yes or -#no") => 所有带有标签 #yes 的页面，或不带有标签 #no 的页面
dv.pages('"folder" or #tag') => 所有带有标签 #tag 的页面，或来自文件夹 "folder" 的页面
```

请注意，文件夹需要在字符串中使用双引号（即 `dv.pages("folder")` 不起作用，但 `dv.pages('"folder"')` 可以）——这是为了准确匹配查询语言中源的写法。

### `dv.pagePaths(source)`

与 `dv.pages` 类似，但只返回匹配给定源的页面路径的[数据数组](../data-array)。

```js
dv.pagePaths("#books") => 具有标签 'books' 的页面路径
```

### `dv.page(path)`

将简单的路径或链接映射到完整的页面对象，该对象包括页面的所有字段。自动进行链接解析，并且如果没有指定扩展名，将自动确定扩展名。

```js
dv.page("Index") => /Index 页面对象
dv.page("books/The Raisin.md") => /books/The Raisin.md 页面对象
```

请根据上述指南调整翻译，确保输出仍然是有效的 Markdown 文件。

## 渲染

### `dv.el(element, text)`

在指定的 HTML 元素中渲染任意文本。

```js
dv.el("b", "这是粗体文本");
```

您可以通过 `cls` 指定要添加到元素的自定义类，并通过 `attr` 指定额外的属性：

```js
dv.el("b", "这是文本", { cls: "dataview dataview-class", attr: { alt: "Nice!" } });
```

### `dv.header(level, text)`

使用给定文本渲染 1 到 6 级标题。

```js
dv.header(1, "大标题！");
dv.header(6, "小标题");
```

### `dv.paragraph(text)`

在段落中渲染任意文本。

```js
dv.paragraph("这是文本");
```

### `dv.span(text)`

在 span 中渲染任意文本（与段落不同，span 上下没有填充）。

```js
dv.span("这是文本");
```

### `dv.execute(source)`

执行任意的 Dataview 查询，并将其嵌入到当前页面。

```js
dv.execute("从 #标签 列出");
dv.execute("从 #事物 表格列出 field1, field2");
```

### `dv.executeJs(source)`

执行任意的 DataviewJS 查询，并将其嵌入到当前页面。

```js
dv.executeJs("dv.list([1, 2, 3])");
```

### `dv.view(path, input)`

这是一个复杂的函数，允许自定义视图。它会尝试在给定路径加载一个 JavaScript 文件，并将 `dv` 和 `input` 传递给它，让它执行。这允许您跨多个页面重用自定义视图代码。请注意，由于涉及文件 I/O，这是一个异步函数——确保您等待结果！

```js
await dv.view("views/custom", { arg1: ..., arg2: ... });
```

如果您还想在您的视图中包含自定义 CSS，您可以传递一个包含 `view.js` 和 `view.css` 的文件夹路径；CSS 将会自动添加到视图中：

```
views/custom
 -> view.js
 -> view.css
```

视图脚本可以访问 `dv` 对象（API 对象），以及一个 `input` 对象，它完全等同于 `dv.view()` 的第二个参数。

请记住，`dv.view()` 无法从以点（`.`）开头的目录中读取，例如 `.views`。以下是一个不正确的使用示例：

```js
await dv.view(".views/view1", { arg1: 'a', arg2: 'b' });
```

尝试这样做会导致以下异常：

```
Dataview: 无法找到自定义视图 '.views/view1/view.js' 或 '.views/view1.js'。
```

此外，请注意，目录路径始终源自仓库根目录。

#### 示例

在这个示例中，我们在 `scripts` 目录下有一个名为 `view1.js` 的自定义脚本文件。

**文件:** `scripts/view1.js`

```js
console.log(`加载 view1`);

function foo(...args) {
  console.log('foo 被调用，参数为', ...args);
}
foo(input)
```

我们还有一个位于 `projects` 下的 Obsidian 文档。我们将从这个文档中使用 `scripts/view1.js` 路径调用 `dv.view()`。

**文档:** `projects/customViews.md`

```js
await dv.view("scripts/view1", { arg1: 'a', arg2: 'b' }) 
```

当执行上述脚本时，它将打印以下内容：

```
加载 view1
foo 被调用，参数为 {arg1: 'a', arg2: 'b'}
```

## 数据视图

### `dv.list(elements)`

渲染一个数据视图列表，可以接收普通数组和数据数组。

```js
dv.list([1, 2, 3]) => 列出 1, 2, 3
dv.list(dv.pages().file.name) => 列出所有文件名
dv.list(dv.pages().file.link) => 列出所有文件链接
dv.list(dv.pages("#book").where(p => p.rating > 7)) => 列出所有评分大于7的书籍
```

### `dv.taskList(tasks, groupByFile)`

渲染一个由 `Task` 对象组成的数据视图列表，这些对象通过 `page.file.tasks` 获取。默认情况下，此视图会自动根据任务来源文件进行分组。如果你提供 `false` 作为第二个参数，则会将它们渲染为一个统一的列表。

```js
// 列出所有标记为 '#project' 页面的任务
dv.taskList(dv.pages("#project").file.tasks)

// 列出所有标记为 '#project' 页面且未完成的任务
dv.taskList(dv.pages("#project").file.tasks
     .where(t => !***pleted))

// 列出所有标记为 '#project' 页面且包含 '#tag' 标签的任务
dv.taskList(dv.pages("#project").file.tasks
     .where(t => t.text.includes("#tag")))

// 列出所有标记为 '#project' 页面的任务，不进行分组
dv.taskList(dv.pages("#project").file.tasks, false)
```

### `dv.table(headers, elements)`

渲染一个数据视图表格。`headers` 是一个列标题数组。`elements` 是一个行数组。每行本身是一个列数组。在一行中，每个是数组的列将被渲染为列表项。

```js
dv.table(
	["Col1", "Col2", "Col3"],
			[
				["Row1", "Dummy", "Dummy"],
				["Row2", 
					["Bullet1",
					 "Bullet2",
					 "Bullet3"],
					"Dummy"],
				["Row3", "Dummy", "Dummy"]
			]
	);
```

一个如何渲染按评分排序的书籍信息的简单表格的例子。

```js
dv.table(["File", "Genre", "Time Read", "Rating"], dv.pages("#book")
     .sort(b => b.rating)
     .map(b => [b.file.link, b.genre, b["time-read"], b.rating]))
```

## Markdown 数据视图

这些函数可以将渲染为纯Markdown字符串，以便你可以根据需要进行渲染或操作。

### `dv.markdownTable(headers, values)`

等同于 `dv.table()`，它使用给定的列标题列表和2D元素数组来渲染一个表格，但返回的是纯Markdown。

```js
// 渲染按评分排序的书籍信息的简单表格。
const table = dv.markdownTable(["File", "Genre", "Time Read", "Rating"], dv.pages("#book")
     .sort(b => b.rating)
     .map(b => [b.file.link, b.genre, b["time-read"], b.rating]))

dv.paragraph(table);
```

### `dv.markdownList(values)`

等同于 `dv.list()`，它渲染给定元素的列表，但返回的是纯Markdown。

```js
const markdown = dv.markdownList([1, 2, 3]);
dv.paragraph(markdown);
```

### `dv.markdownTaskList(tasks)`

等同于 `dv.taskList()`，它渲染任务列表，但返回的是纯Markdown。

```js
const markdown = dv.markdownTaskList(dv.pages("#project").file.tasks);
dv.paragraph(markdown);
```

## 工具

### `dv.array(value)`

将给定的值或数组转换为 Dataview [数据数组](../data-array)。如果值已经是数据数组，则返回它本身。

```js
dv.array([1, 2, 3]) => 返回 Dataview 数据数组 [1, 2, 3]
```

### `dv.isArray(value)`

如果给定的值是数组或 Dataview 数组，则返回 true。

```js
dv.isArray(dv.array([1, 2, 3])) => 返回 true
dv.isArray([1, 2, 3]) => 返回 true
dv.isArray({ x: 1 }) => 返回 false
```

### `dv.fileLink(path, [embed?], [display-name])`

将文本路径转换为 Dataview `Link` 对象；可以指定链接是否嵌入以及其显示名称。

```js
dv.fileLink("2021-08-08") => 返回指向名为 "2021-08-08" 文件的链接
dv.fileLink("book/The Raisin", true) => 返回嵌入式链接 "The Raisin"
dv.fileLink("Test", false, "Test File") => 返回指向名为 "Test" 文件的链接，并显示名称为 "Test File"
```

### `dv.sectionLink(path, section, [embed?], [display?])`

将文本路径 + 节名称转换为 Dataview `Link` 对象；可以指定链接是否嵌入以及其显示名称。

```js
dv.sectionLink("Index", "Books") => 返回 [[Index#Books]]
dv.sectionLink("Index", "Books", false, "My Books") => 返回 [[Index#Books|My Books]]
```

### `dv.blockLink(path, blockId, [embed?], [display?])`

将文本路径 + 块 ID 转换为 Dataview `Link` 对象；可以指定链接是否嵌入以及其显示名称。

```js
dv.blockLink("Notes", "12gdhjg3") => 返回 [[Index#^12gdhjg3]]
```

### `dv.date(text)`

将文本和链接转换为 luxon `DateTime`；如果提供的是 `DateTime`，则返回它本身。

```js
dv.date("2021-08-08") => 返回 2021 年 8 月 8 日的 DateTime
dv.date(dv.fileLink("2021-08-07")) => 返回 2021 年 8 月 8 日的 DateTime
```

### `dv.duration(text)`

将文本转换为 luxon `Duration`；使用与 Dataview 时长类型相同的解析规则。

```js
dv.duration("8 minutes") => 返回持续时间 8 分钟
dv.duration("9 hours, 2 minutes, 3 seconds") => 返回持续时间 9 小时, 2 分钟, 3 秒
```

### `***pare(a, b)`

根据 Dataview 的默认比较规则比较两个任意 JavaScript 值；如果您正在编写自定义比较器并希望回退到默认行为，这非常有用。如果 `a < b`，返回负值；如果 `a = b`，返回 0；如果 `a > b`，返回正值。

```**
***pare(1, 2) = **
***pare("yes", "no") = *
***pare({ what: 0 }, { what: 0 }) = 0
```

### `dv.equal(a, b)`

根据 Dataview 的默认比较规则比较两个任意 JavaScript 值，并在它们相等时返回 true。

```js
dv.equal(1, 2) = false
dv.equal(1, 1) = true
```

### `dv.clone(value)`

深度克隆任何 Dataview 值，包括日期、数组和链接。

```js
dv.clone(1) = 1
dv.clone({ a: 1 }) = { a: 1 }
```

### `dv.parse(value)`

将任意字符串对象解析为复杂的 Dataview 类型（主要支持链接、日期和持续时间）。

```js
dv.parse("[[A]]") = Link { path: A }
dv.parse("2020-08-14") = DateTime { 2020-08-14 }
dv.parse("9 seconds") = Duration { 9 seconds }
```

请注意，以上代码块中的示例应转换为中文注释，以符合 BCP 47 标准。在实际的 Markdown 文件中，您需要将注释和示例翻译成中文，并确保 Markdown 的语法正确。

## 文件 I/O

这些实用工具方法都包含在 `dv.io` 子 API 中，它们都是*异步的*（标记为 ⌛）。

### ⌛ `dv.io.csv(path, [origin-file])`

从给定路径加载 CSV 文件（链接或字符串）。相对路径将相对于可选的原文件（默认为当前文件，如果未提供）。返回一个数据视图数组，每个元素包含一个 CSV 值的对象；如果文件不存在，则返回 `undefined`。

```js
await dv.io.csv("hello.csv") => [{ column1: ..., column2: ...}, ...]
```

### ⌛ `dv.io.load(path, [origin-file])`

异步加载给定路径（链接或字符串）的内容。相对路径将相对于可选的原文件（默认为当前文件，如果未提供）进行解析。返回文件的字符串内容，如果文件不存在，则返回 `undefined`。

```js
await dv.io.load("File") => "# File\nThis is an example file..."
```

### `dv.io.normalize(path, [origin-file])`

将相对链接或路径转换为绝对路径。如果提供了 `origin-file`，那么解析链接的过程就像是从那个文件中进行的；如果没有提供，路径将相对于当前文件进行解析。

```js
dv.io.normalize("Test") => "dataview/test/Test.md"，如果在 "dataview/test" 内部
dv.io.normalize("Test", "dataview/test2/Index.md") => "dataview/test2/Test.md"，不受当前文件的影响
```

## 查询评估

### ⌛ `dv.query(source, [file, settings])`

执行Dataview查询并以结构化格式返回结果。
此函数返回的类型根据执行的查询类型而变化，但总是包含一个`type`来表示返回类型。这个版本的`query`返回一个结果类型 - 你可能需要`tryQuery`，它在查询执行失败时抛出错误。

```javascript
await dv.query("LIST FROM #tag") =>
     { successful: true, value: { type: "list", values: [value1, value2, ...] } }

await dv.query(`TABLE WITHOUT ID file.name, value FROM "path"`) =>
     { successful: true, value: { type: "table", headers: ["file.name", "value"], values: [["A", 1], ["B", 2]] } }

await dv.query("TASK WHERE due") =>
     { successful: true, value: { type: "task", values: [task1, task2, ...] } }
```

`dv.query`接受两个额外的、可选的参数：

1. `file`：解析查询时使用的文件路径（在引用`this`时）。默认为当前文件。
2. `settings`：执行查询的执行设置。这是一个高级用例（我建议你直接检查API实现以查看所有可用选项）。

### ⌛ `dv.tryQuery(source, [file, settings])`

与`dv.query`相同，但在短脚本中使用更为方便，因为执行失败将作为JavaScript异常抛出，而不是返回结果类型。

### ⌛ `dv.queryMarkdown(source, [file], [settings])`

与`dv.query()`相同，但返回渲染后的Markdown。

```js
await dv.queryMarkdown("LIST FROM #tag") =>
    { successful: true, value: { "- [[Page 1]]\n- [[Page 2]]" } }
```

### ⌛ `dv.tryQueryMarkdown(source, [file], [settings])`

与`dv.queryMarkdown()`相同，但在解析失败时抛出错误。

### `dv.tryEvaluate(expression, [context])`

评估任意Dataview表达式（如`2 + 2`或`link("text")`或`x * 9`）；在解析或评估失败时抛出`Error`。`this`是一个始终可用的隐式变量，指当前文件。

```js
dv.tryEvaluate("2 + 2") => 4
dv.tryEvaluate("x + 2", {x: 3}) => 5
dv.tryEvaluate("length(this.file.tasks)") => 当前文件的任务数量
```

### `dv.evaluate(expression, [context])`

评估任意Dataview表达式（如`2 + 2`或`link("text")`或`x * 9`），返回一个`Result`对象的结果。你可以通过检查`result.successful`来解包结果类型（然后获取`result.value`或`result.error`）。如果你想要一个在评估失败时抛出错误的更简单的API，请使用`dv.tryEvaluate`。

```js
dv.evaluate("2 + 2") => 成功 { value: 4 }
dv.evaluate("2 +") => 失败 { error: "解析失败..." }
```

请注意，由于Markdown文件的特殊性，直接执行JavaScript代码是不可行的。Markdown文件不支持执行脚本或动态生成内容。因此，上述函数不能在标准Markdown文件中直接使用。这些函数的使用场景通常是特定的插件或扩展，如Dataview插件用于特定的笔记应用或知识管理系统。在翻译过程中，我已尽量保持原意，同时确保输出是一个有效的Markdown文件。

