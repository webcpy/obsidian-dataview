# 概述

Dataview 是一个实时索引和查询引擎，用于你的个人知识库。你可以为笔记[**添加元数据**](annotation/add-metadata.md)，并使用[**Dataview 查询语言**](queries/structure.md)来查询它们，列出、过滤、排序或分组你的数据。Dataview 使你的查询始终保持最新，并使数据聚合变得简单。

你可以：

- 通过在每日笔记中记录睡眠情况，自动创建每周的睡眠时间表。
- 自动收集笔记中的书籍链接，并按评分排序显示它们。
- 自动收集与今天日期相关的页面，并在你的每日笔记中显示它们。
- 找到没有标签的页面以便后续跟进，或显示特定标签页面的美观视图。
- 创建动态视图，展示记录在你笔记中的即将到来的生日或事件。

等等。

!!! hint "Dataview 提供了一种快速搜索、显示和操作索引数据的方法！"

Dataview 非常通用且性能高，可以轻松处理数十万条带注释的笔记。

如果内置的[查询语言](query/queries/)无法满足你的需求，你可以使用[dataview API](api/intro/)运行任意 JavaScript，并在你的笔记中构建所需的任何实用工具。

!!! info "Dataview 关注于显示而非编辑"
Dataview 用于显示和计算数据。它不用于编辑你的笔记/元数据，并始终保留它们不变（…除非你在检查一个 [Task](queries/query-types.md#task-queries) 通过 Dataview。）

## 如何使用 Dataview

Dataview 由两个主要的构建块组成：**数据索引**和**数据查询**。

!!! info "更多细节请访问相关文档页面"
以下各节将为您提供关于 Dataview 可以做些什么以及如何操作的一般性概述。确保访问相关页面以了解有关各个部分的更多信息。

### 数据索引

Dataview 仅在您 Markdown 文件中的元数据上运行。它无法读取您知识库中的所有内容，而只能读取特定数据。您的一些内容，如标签和子弹点（包括任务）会[自动提供](annotation/add-metadata.md#implicit-fields)给 Dataview。您可以通过在文件顶部的 [YAML Frontmatter](annotation/add-metadata.md#frontmatter) 或在内容中间通过 [Inline Fields](annotation/add-metadata.md#inline-fields) 以 `[key:: value]` 语法添加其他数据。Dataview 会*索引*这些数据，以便您可以查询。

!!! hint "Dataview 会索引 [某些信息](annotation/add-metadata.md#implicit-fields)，如标签和列表项以及通过字段添加的数据。只有索引数据才可在 Dataview 查询中使用！"

例如，一个文件可能看起来像这样：

```markdown
---
author: "Edgar Allan Poe"
published: 1845
tags: poems
---

# The Raven

Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
```

或者像这样：

```markdown
#poems

# The Raven

From [author:: Edgar Allan Poe], written in (published:: 1845)

Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
```

在可查询的元数据（或您能查询的内容）方面，它们是相同的，只是它们的注释风格有所不同。如何[注释您的元数据](annotation/add-metadata.md)完全取决于您和您的个人偏好。有了这个文件，您就可以访问 **元数据字段** `author`，以及 Dataview 自动提供给您的 [作为隐式字段](annotation/metadata-pages.md) 的所有内容，如标签或笔记标题。

!!! attention "需要索引数据"
在上面的例子中，您*没有*在 Dataview 中获得诗歌本身：它是一个段落，不是元数据字段，也不是 Dataview 自动索引的内容。它不是 Dataview 索引的一部分，因此您将无法查询它。

### 数据查询

您可以通过**查询**访问**索引数据**。

您可以以三种不同的方式编写查询：使用[Dataview 查询语言（DQL）](queries/dql-js-inline/#dataview-query-language-dql)、作为[内联语句](queries/dql-js-inline#inline-dql)或以最灵活但最复杂的方式：作为[Javascript 查询](queries/dql-js-inline#dataview-js)。

**Dataview 查询语言（DQL）**为您提供了一个广泛的强大工具集，用于查询、显示和操作您的数据。一个[**内联查询**](queries/dql-js-inline#inline-dql)使您能够在笔记中的任何位置精确显示一个索引值。您也可以这样进行计算。有了DQL在手，您可能不需要任何Javascript就能完成数据之旅。

一个DQL查询包含几个部分：

- 确定您的查询输出看起来如何的**[一个查询类型](queries/query-types.md)**
- 选择特定标签或文件夹（或另一个[源](reference/sources.md)）进行查看的[**FROM语句**](queries/data-commands#from)（可选）
- 帮助您过滤、分组和排序所需输出的[**其他数据命令**](queries/data-commands.md)（可选）

例如，查询可能如下所示：

````markdown
```dataview
LIST
```
````

这将列出您保险库中的所有文件。

!!! info "除了查询类型外，其他一切都是可选的"
对于一个有效的DQL查询，您需要的是查询类型（对于[日历](queries/query-types#calendar-queries)查询，还需要一个日期字段）。

一个更受限制的查询可能看起来像这样：

````markdown
```dataview
LIST
FROM #poems
WHERE author = "Edgar Allan Poe"
```
````

这将列出您的保险库中带有标签`#poems`和一个[字段](annotation/add-metadata.md)名为`author`，其值为`Edgar Allan Poe`的文件。这个查询将找到我们上面提到的示例页面。

`LIST`只是您可以使用的四个[查询类型](queries/query-types.md)中的一个。例如，使用`TABLE`，我们可以为输出添加更多信息：

````markdown
```dataview
TABLE author, published, file.inlinks AS "Mentions"
FROM #poems
```
````

这将为您提供以下结果：

| 文件（3）          | 作者           | 发表年份 | 提及次数                |
| ---------------- | --------------- | --------- | ---------------------- |
| The Bells         | Edgar Allan Poe | 1849       |                        |
| The New Colossus | Emma Lazarus     | 1883       | - \[\[Favorite Poems]] |
| The Raven         | Edgar Allan Poe | 1845       | - \[\[Favorite Poems]] |

但是Dataview的功能远不止于此。您还可以通过帮助[**函数**](reference/functions.md)操作您的数据。请注意，这些操作只在查询内部进行——您的**文件中的数据保持不变**。

````markdown
```dataview
TABLE author, date(now).year - published AS "Age in Yrs", length(file.inlinks) AS "Counts of Mentions"
FROM #poems
```
````

将为您提供以下结果：

| 文件（3）          | 作者           | 年龄（岁） | 提及次数 |
| ---------------- | --------------- | ---------- | ----------------- |
| The Bells         | Edgar Allan Poe | 173         | 0                  |
| The New Colossus | Emma Lazarus     | 139         | 1                  |
| The Raven         | Edgar Allan Poe | 177         | 1                  |

!!! info "更多示例请参见[这里](resources/examples.md)。"

正如您所看到的，Dataview不仅允许您快速聚合数据并始终保持最新，还可以帮助您进行操作，为您提供关于数据集的新见解。浏览文档以了解如何与您的数据交互。

祝您在探索保险库的新方法中玩得开心！

## 资源与帮助

这份文档并不是帮助您进行数据之旅的唯一资源。您可以查看[资源与支持](./zh-cn/resources/resources-and-support.md)来获取一份有用的页面和视频列表。

