# 常见问题解答

一个关于Dataview查询和表达式语言的常见问题集合。

### 如何使用与关键词（如"from"，"where"）同名的字段？

Dataview提供了一个特殊的“虚拟”字段`row`，可以通过索引它来获取与Dataview关键词冲突的字段：

```javascript
row.from // 等同于 "from"
row.where // 等同于 "where"
```

### 如何访问名称包含空格的字段？

有两种方法：

1. 使用Dataview中为这类字段提供的规范化名称——只需将名称转换为小写，并将空格替换为连字符（"-"）。例如，`Field With Space In It`可以变为`field-with-space-in-it`。
2. 使用隐含的`row`字段：
    ```javascript
    row["Field With Space In It"]
    ```

### 有没有可以学习的资源列表？

有的！请参阅[资源](../resources/resources-and-support.md)页面。

### 我能保存查询结果以供重用吗？

你可以使用[dv.view](../../api/code-reference/#dvviewpath-input)函数编写可重用的JavaScript查询。在DQL中，除了可以在模板内编写查询（可以使用[核心插件模板](***或流行的社区插件[模板器](***），还可以通过[内联DQL](../../queries/dql-js-inline#inline-dql)**在元数据字段中保存计算结果**，例如：

```markdown
start:: 07h00m
end:: 18h00m
pause:: 01h30m
duration:: `= this.end - this.start - this.pause`
```

你可以在表格中列出这个值（以我们的例子，是9小时30分钟），而无需重复计算：

````markdown
```dataview
TABLE start, end, duration
WHERE duration
```
````

这会给你

| 文件（1） | 开始    | 结束       | 持续时间             |
| -------- | ------- | -------- | ------------------- |
| 示例      | 7小时   | 18小时   | 9小时30分钟          |

**但是，将内联DQL保存在字段中带有局限性**：虽然显示在结果中的值是计算出的值，但**在元数据字段中保存的值仍然是你的内联DQL计算**。该值实际上是`= this.end - this.start - this.pause`。这意味着你不能使用该值进行过滤，例如：

````markdown
```dataview
TABLE start, end, duration
WHERE duration > dur("10h")
```
````

这将返回示例页面，即使结果不满足`WHERE`子句，因为与你比较的值是`= this.end - this.start - this.pause`，而不是持续时间。

### 如何在TABLE查询中隐藏结果计数？

从Dataview 0.5.52开始，你可以通过设置隐藏TABLE和TASK查询的结果计数。转到Dataview的设置 -> 显示结果计数。

### 如何对查询进行样式设置？

您可以使用 [CSS Snippets](*** 来为 Obsidian 定义自定义样式。例如，如果您定义 `cssclasses: myTable` 作为属性，并启用下面的代码片段，您可以设置数据视图生成的表格的背景颜色。类似地，要定位 `TASK` 或 `LIST` 查询的外层 `<ul>`，您可以使用 `ul.contains-task-list` 或 `ul.list-view-ul`。

```css
.myTable dataview.table {
     background-color: green;
}
```

通常，页面上的特定表格没有唯一 ID，所以提到的定位适用于任何具有该 `cssclasses` 定义的笔记，并且**所有**该页面上的表格。目前，您不能通过普通查询直接定位特定表格，但如果您使用 JavaScript，您可以直接向查询结果添加类 `clsname`，如下所示：

```js
dv.container.className += ' clsname'
```

然而，有一种技巧可以使用标签在 Obsidian 中定位任何表格，这适用于包含该标签的任何表格。这适用于手动和数据视图生成的表格。为了使下面的代码片段生效，您需要在表格输出的任何位置添加标签 `#myId`。

```css
[href="#myId"] {
     display: none; /* 在表格视图中隐藏标签 */
}

table:has([href="#myId"]) {
    /* 按您的喜好设置表格样式 */
   background-color: #262626;
   & tr:nth-child(even) td:first-child{
     background-color: #3f3f3f;  
   }
}
```

这将使整个表格具有灰色背景，并且每行的偶数行的第一个单元格具有不同深浅的灰色。**免责声明：** 我们不是风格专家，所以这只是一个展示如何为表格的不同部分设置样式的例子。

此外，在 [Style dataview table columns](*** 描述了一种使用 `<span>` 来样式化表格单元格（和列）的另一种技巧。

