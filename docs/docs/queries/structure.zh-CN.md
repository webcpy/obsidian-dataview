# 查询结构

Dataview 提供了多种编写查询的方式，其语法因每种方式而异。

本页提供了如何编写 **Dataview 查询语言** (**DQL**) 查询的信息。如果你对如何编写内联查询感兴趣，请参阅 [DQL, JS 和内联](dql-js-inline.md#inline-dql) 部分。你可以在 [Javascript 参考](../api/intro.md) 页面找到更多关于 **Javascript 查询** 的信息。

**DQL** 是一种类似于 SQL 的查询语言，用于在数据上创建不同视图或计算。它支持以下功能：

- 选择 **输出格式**（参见 [查询类型](./query-types.md)）
- 从特定的 [来源](../reference/sources.md) 获取页面，例如标签、文件夹或链接
- 通过简单操作（如比较、存在检查等）**过滤页面/数据**
- 对字段进行 **转换** 以便显示，例如通过计算或分割多值字段
- 根据字段对结果进行 **排序**
- 根据字段对结果进行 **分组**
- **限制** 结果的数量

!!! 警告 注意 SQL 与 DQL 的差异
如果你熟悉 SQL，请阅读 [DQL 与 SQL 的差异](../../queries/differences-to-sql)，以避免将 DQL 与 SQL 混淆。

现在让我们看看如何使用 DQL。

## DQL 查询的通用格式

每个查询都遵循相同的结构，包括：

- **恰好一个** 查询类型，以及零个、一个或多个字段，这取决于查询类型
- 零个或一个 **FROM** 数据命令，以及一个到多个 [来源](../reference/sources.md)
- 零个或多个其他 **数据命令**，以及一个到多个 [表达式](../reference/expressions.md) 和/或其他信息，这取决于数据命令

在高层次上，查询遵循以下模式：

````
```dataview
<查询类型> <字段>
FROM <来源>
<数据命令> <表达式>
<数据命令> <表达式>
         ...
```
````

!!! 提示 "只有查询类型是强制性的。"

以下部分将更详细地解释理论。

## 选择输出格式

查询的输出格式由其 **查询类型** 决定。有四种可用：

1. **表格（TABLE）**：结果的表格，每行一个结果，一列或多列字段数据。
2. **列表（LIST）**：匹配查询的页面的项目符号列表。你可以为每个页面输出一个字段以及它们的文件链接。
3. **任务（TASK）**：一个交互式任务列表，匹配给定查询的任务。
4. **日历（CALENDAR）**：通过在引用日期上显示一个点来显示每个命中。

查询类型是查询中的 **唯一强制性命令**。其他一切都是可选的。

!!! 注意 "可能消耗大量内存的示例"
根据你的保险库的大小，执行以下示例可能需要很长时间，甚至在极端情况下可能导致 Obsidian 崩溃。建议你指定一个 `FROM` 来将查询执行限制到保险库文件的特定子集。请参见下一节。

````
列出你的保险库中的所有页面作为项目符号列表
```dataview
LIST
```

列出你的保险库中的所有任务（已完成或未完成）
```dataview
TASK
```

渲染一个日历视图，其中每个页面都用一个点表示，该点位于其创建日期上。
```dataview
CALENDAR file.cday
```

显示一个表格，其中包含保险库中所有页面的字段值（截止日期）、文件的标签以及多值字段工作小时的平均值
```dataview
TABLE due, file.tags AS "标签", average(working-hours)
```
````

!!! 信息 "阅读更多关于可用的查询类型以及如何使用它们 [此处](./query-types.md)。"

## 选择您的数据源

除了查询类型之外，您还可以使用几个**数据命令**来帮助您限制、细化、排序或分组查询。这些查询命令中的一个是**FROM**语句。`FROM`接受一个[数据源](../../reference/sources)或多个[数据源](../../reference/sources)的组合作为参数，并将查询限制在与您的数据源匹配的一组页面。

它与其它数据命令的行为有所不同：您可以在查询中添加**零个或一个**`FROM`数据命令，并且它必须紧跟在您的查询类型之后。您不能添加多个FROM语句，并且您不能在其他数据命令之后添加它。

````
列出“Books”文件夹及其子文件夹中的所有页面
```dataview
LIST
FROM "Books"
```

列出包含标签#status/open或#status/wip的所有页面
```dataview
LIST
FROM #status/open OR #status/wip
```

列出所有包含标签#assignment且位于文件夹“30 School”（或其子文件夹）中的页面，或位于文件夹“30 School/32 Homeworks”中且在页面School Dashboard Current To Dos上有链接的页面
```dataview
LIST
FROM (#assignment AND "30 School") OR ("30 School/32 Homeworks" AND outgoing([[School Dashboard Current To Dos]]))
```

````

!!! info "更多关于`FROM`的信息，请[点击此处](./data-commands.md#from)。"

## 过滤、排序、分组或限制结果

除了上面解释的查询类型和数据命令`FROM`之外，您还可以使用其他几个数据命令来帮助您限制、细化、排序或分组查询结果。

所有数据命令（除了`FROM`命令）都可以多次使用，并且可以按任意顺序使用（只要它们紧跟在查询类型之后，如果使用了`FROM`的话）。它们将按照书写的顺序执行。

可用的数据命令包括：

1. **FROM** 如上文所述。
2. **WHERE**：基于笔记内部的信息（元数据字段）过滤笔记。
3. **SORT**：根据字段和方向对结果进行排序。
4. **GROUP BY**：将多个结果合并为每组一个结果行。
5. **LIMIT**：将查询结果的数量限制为给定的数字。
6. **FLATTEN**：根据字段或计算结果将一个结果拆分为多个结果。

````

列出所有具有元数据字段`due`且`due`在今天的日期之前的页面
```dataview
LIST
WHERE due AND due < date(today)
```

列出您库中最近创建的10个带有标签#status/open的页面
```dataview
LIST
FROM #status/open
SORT file.ctime DESC
LIMIT 10
```

列出您库中最老的10个未完成任务作为交互式任务列表，按包含它们的文件分组，并从最旧的文件排序到最新的文件。
```dataview
TASK
WHERE !completed
SORT created ASC
LIMIT 10
GROUP BY file.link
SORT rows.file.ctime ASC
```

````

!!! info "更多关于可用的数据命令，请[点击此处](./data-commands.md)。"

## 示例

以下是一些示例查询。更多示例请[点击此处](../resources/examples.md)。

````
```dataview
TASK
```
````

````
```dataview
TABLE recipe-type AS "类型", portions, length
FROM #recipes
```
````

````
```dataview
LIST
FROM #assignments
WHERE status = "open"
```
````

````
```dataview
TABLE file.ctime, appointment.type, appointment.time, follow-ups
FROM "30 Protocols/32 Management"
WHERE follow-ups
SORT appointment.time
```
````

````
```dataview
TABLE L.text AS "我的列表"
FROM "dailys"
FLATTEN file.lists AS L
WHERE contains(L.author, "Surname")
```
````

````
```dataview
LIST rows.c
WHERE typeof(contacts) = "数组" AND contains(contacts, [[Mr. L]])
SORT length(contacts)
FLATTEN contacts as c
SORT link(c).age ASC
```
````

