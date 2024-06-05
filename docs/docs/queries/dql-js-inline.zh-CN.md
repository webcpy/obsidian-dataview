# 数据查看、JavaScript和内联

在你向相关页面添加了[有用的数据](../annotation/add-metadata.md)之后，你可能会想要在某个地方展示它，或者对它进行操作。Dataview 允许你通过四种不同的方式来实现，这四种方式都可以直接在你的 Markdown 中的代码块内编写，并且当你的文件库发生变化时会实时重新加载。

## 数据查看查询语言（DQL）

[**数据查看查询语言**](../../queries/structure)（简称 **DQL**）是一种类似于 SQL 的语言，它是 Dataview 的核心功能。它支持 [四种查询类型](./query-types.md) 以产生不同的输出，[数据命令](./data-commands.md) 以精炼、重排或分组你的结果，以及[丰富的函数](../reference/functions.md)来实现许多操作和调整，以达到你想要的输出。

!!! warning 与 SQL 的差异
如果你熟悉 SQL，请阅读 [DQL 与 SQL 的差异](../../queries/differences-to-sql)，以免将 DQL 与 SQL 混淆。

你可以使用一个以 `dataview` 为类型的代码块来创建一个 **DQL** 查询：

````
```dataview
TABLE rating AS "Rating", summary AS "Summary" FROM #games
SORT rating DESC
```
````

!!! attention 注意引号
一个有效的代码块需要在开始和结束时使用反引号（\`\`），并且每个方向各需要三个。请不要将反引号与类似的引号（'）混淆！

有关如何编写 DQL 查询的详细信息，请参阅 [查询语言参考](../../queries/structure)。如果你通过示例学习得更好，可以查看 [查询示例](../../resources/examples)。

## 内联 DQL

内联 DQL 使用内联块格式而不是代码块，并使用可配置的前缀来标记这个内联代码块为 DQL 块。

```
`= this.file.name`
```

!!! info 更改 DQL 前缀
你可以在 Dataview 的设置中更改 `=` 为另一个令牌（如 `dv:` 或 `~`），在“代码块设置” > “内联查询前缀”中找到。

内联 DQL 查询**恰好在一个值**中显示，它位于笔记内容的中间某处。它们自然地融入了你笔记的内容：

```markdown
今天是 `= date(today)` - `= [[考试]].截止日期 - date(today)` 天后就考试了！
```

例如，可能会渲染成：

```markdown
今天是2022年11月07日 - 从今天起还有2个月零5天考试！
```

**内联 DQL** 无法查询多个页面。它们总是只显示一个值，而不是一个值列表（或表格）。你只能通过前缀 `this.` 访问**当前页面**的属性，或者通过 `[[链接页面]]` 访问另一个页面的属性。

```markdown
`= this.file.name`
`= this.file.mtime`
`= this.someMetadataField`
`= [[第二页]].file.name`
`= [[第二页]].file.mtime`
`= [[第二页]].someMetadataField`
```

你可以在内联 DQL 查询中使用所有可用的 [表达式](../../reference/expressions) 和 [字面量](../../reference/literals)，包括 [函数](../../reference/functions)。但是，查询类型和数据命令在内联中是**不可用的**。

```markdown
作业截止日期是 `= this.due - date(today)`
最终论文截止日期是 `= [[计算机科学理论]].due - date(today)`

🏃‍♂️ 达到目标了吗？ `= choice(this.steps > 10000, "YES!", "**No**, 加油！")`

你还有 `= length(filter(link(dateformat(date(today), "yyyy-MM-dd")).file.tasks, (t) => !***pleted))` 项任务要完成。 `= choice(date(today).weekday > 5, "休息一下！", "是时候工作了！")`

## Dataview JS

Dataview的[JavaScript API](../../api/intro)赋予你使用JavaScript的全部力量，并提供了一个DSL来拉取Dataview数据和执行查询，使你可以创建任意复杂的查询和视图。类似于查询语言，你可以通过带有`dataviewjs`注释的代码块来创建Dataview JS块：

````java
```dataviewjs
let pages = dv.pages("#books and -#books/finished").where(b => b.rating >= 7);
for (let group of pages.groupBy(b => b.genre)) {
    dv.header(3, group.key);
    dv.list(group.rows.file.name);
}
```
````

在JS Dataview块内部，你可以通过`dv`变量访问整个Dataview API。有关你可以使用它的更多信息，请参阅[API文档](../../api/code-reference)或[API示例](../../api/code-examples)。

!!! 注意 "高级用法"
使用JavaScript查询是一种高级技术，需要编程和JS方面的理解。请小心，因为JS查询有权访问你的文件系统。在使用其他人的JS查询时要特别小心，尤其是当它们没有公开通过Obsidian社区分享时。

## 内联Dataview JS

与查询语言类似，你可以编写JS内联查询，这允许你直接嵌入计算出的JS值。你通过内联代码块创建JS内联查询：

```
`$= dv.current().file.mtime`
```

在内联DataviewJS中，你可以使用`dv`变量，就像在`dataviewjs`代码块中一样，并且可以执行所有相同的调用。结果应该是一个评估为JavaScript值的东西，Dataview会自动适当地渲染它。

与内联DQL查询不同，内联JS查询可以访问Dataview JS查询可以访问的所有内容，因此可以查询和输出多个页面。

!!! 信息 "更改内联JS前缀"
你可以在Dataview的设置中更改`$=`为另一个标记（如`dvjs:`或`$~`），在"代码块设置" > "JavaScript内联查询前缀"中进行更改。

