# 查询类型

**查询类型**决定了您的数据查看查询输出的格式。这是您提供给数据查看查询的第一个也是唯一必要的规范。有四种可用：`LIST`，`TABLE`，`TASK` 和 `CALENDAR`。

查询类型还决定了查询执行的信息级别。`LIST`，`TABLE` 和 `CALENDAR` 在页面级别上操作，而 `TASK` 查询在 `file.tasks` 级别上操作。更多关于 `TASK` 查询类型的信息，请参阅 `TASK` 查询类型。

您可以将**每种查询类型与所有可用的 [数据命令](data-commands.md) 结合使用**，以细化结果集。更多关于查询类型和数据命令之间的联系，请参阅 [如何使用数据查看](../index.md#如何使用数据查看) 和 [结构页面](structure.md)。

!!! 摘要 "查询类型"
查询类型决定了查询的输出格式。它是查询的唯一必要信息。

## 列表

`LIST` 查询会输出一个包含您的文件链接或（如果您决定）[分组](data-commands.md#group-by)的组名的项目符号列表。您可以指定最多 **一项额外信息**，以与您的文件或组信息一起显示。

!!! summary "查询类型 `LIST`"
`LIST` 会输出一个包含页面链接或组键的项目符号列表。您可以指定一项额外信息，以显示每个结果。

最简单的 `LIST` 查询会输出您的保险库中所有文件的项目符号列表：

````
```dataview 
LIST
```
````

**输出**

- [经典奶酪蛋糕](#)
- [Git 基础](#)
- [如何修复 Git 备忘单](#)
- [英雄联盟](#)
- [永恒支柱 2](#)
- [星露谷物语](#)
- [仪表板](#)

但当然，您也可以使用 [数据命令](data-commands.md) 来限制您想要列出的页面：

````
```dataview
LIST 
FROM #games/mobas OR #games/crpg
```
````

**输出**

- [英雄联盟](#)
- [永恒支柱 2](#)

### 输出额外信息

要将 **额外信息** 添加到您的查询中，请在 `LIST` 命令之后并可能的可用数据命令之前指定它：

````
```dataview 
LIST file.folder
```
````

**输出**

- [经典奶酪蛋糕](#): 烘焙/食谱
- [Git 基础](#): 编程
- [如何修复 Git 备忘单](#): 编程/备忘单
- [英雄联盟](#): 游戏
- [永恒支柱 2](#): 游戏
- [星露谷物语](#): 游戏/已完成
- [仪表板](#):

您只能添加 **一项** 额外信息，而不是多个。但是，您可以指定一个计算值，而不是一个简单的元数据字段，它可以包含多个字段的信息：

````
```dataview 
LIST "文件路径: " + file.folder + " _(创建日期: " + file.cday + ")_"
FROM "Games"
```
````

**输出**

- [英雄联盟](#): 文件路径: Games *(创建日期: 2021年5月13日)*
- [永恒支柱 2](#): 文件路径: Games *(创建日期: 2022年2月2日)*
- [星露谷物语](#): 文件路径: Games/已完成 *(创建日期: 2021年4月4日)*

### 分组

**分组列表** 默认只显示它们的组键：

````
```dataview 
LIST
GROUP BY type
```
````

**输出**

- 游戏
- 知识
- moc
- 食谱
- 摘要

分组的 `LIST` 查询的一个常见用例是在输出中添加文件链接，通过将它们指定为额外信息来实现：

````
```dataview 
LIST rows.file.link
GROUP BY type
```
````

- 游戏:
   - [星露谷物语](#)
   - [英雄联盟](#)
   - [永恒支柱 2](#)
- 知识:
   - [Git 基础](#)
- moc:
   - [仪表板](#)
- 食谱:
   - [经典奶酪蛋糕](#)
- 摘要:
   - [如何修复 Git 备忘单](#)

### 不含ID的列表

如果您不希望在列表视图中包含文件名或组键，可以使用 `LIST WITHOUT ID`。`LIST WITHOUT ID` 的工作原理与 `LIST` 相同，但如果您添加了额外信息，它不会输出文件链接或组名称。

```
```dataview
LIST WITHOUT ID
```
```

**输出**

- [经典芝士蛋糕](#)
- [Git基础](#)
- [如何修正Git备忘单](#)
- [英雄联盟](#)
- [永恒支柱2](#)
- [星露谷物语](#)
- [仪表板](#)

它与 `LIST` 的工作方式相同，因为它不包含额外信息！

```
```dataview
LIST WITHOUT ID type
```
```

**输出**

- moc
- recipe
- summary
- knowledge
- game
- game
- game

`LIST WITHOUT ID` 在您想要输出计算值时非常有用，例如。

```
```dataview
LIST WITHOUT ID length(rows) + " 页类型为 " + key
GROUP BY type
```
```

**输出**

- 3 页类型为 game
- 1 页类型为 knowledge
- 1 页类型为 moc
- 1 页类型为 recipe
- 1 页类型为 summary

## 表格

`TABLE` 查询类型用于以表格形式输出页面数据。你可以将零个或多个元数据字段作为**逗号分隔列表**添加到 `TABLE` 查询中。你不仅可以使用普通的元数据字段作为列，还可以指定**计算**。可选地，你可以通过 `AS <header>` 语法指定表格标题。与其他查询类型一样，你可以使用[数据命令](data-commands.md)来细化你的查询结果集。

!!! summary "`TABLE` 查询类型"
`TABLE` 查询呈现任何数量的元数据值或计算结果的表格视图。你可以通过 Dataview 设置中的表格设置 -> 主要列名称 / 组名称来指定列标题。

````
```dataview
TABLE
```
````

**输出**

| 文件 (7)                        |
| ------------------------------ |
| [经典芝士蛋糕](#)                |
| [Git 基础](#)                   |
| [如何修复 Git 备忘单](#)        |
| [英雄联盟](#)                   |
| [永恒支柱 2](#)                 |
| [星露谷物语](#)                 |
| [仪表板](#)                     |

!!! hint "更改第一列标题名称"
你可以在 Dataview 设置中的表格设置 -> 主要列名称 / 组名称更改默认的“文件”或“组”标题名称。
如果你想只为特定的 `TABLE` 查询更改名称，请查看 `TABLE WITHOUT ID`。

!!! info "禁用结果计数"
表格的第一列始终显示结果计数。如果你不想显示它，你可以在 Dataview 的设置中禁用它（自 0.5.52 版本起可用，名为“显示结果计数”）。

当然，`TABLE` 用于指定一个到多个额外信息：

````
```dataview
TABLE 开始, 文件.文件夹, 文件.标签
从 #游戏
```
````

**输出**

| 文件 (3)                    | 开始         | 文件.文件夹     | 文件.标签           |
| -------------------------- | ------------ | -------------- | ------------------- |
| [英雄联盟](#)              | 2021年5月16日 | 游戏            | - #游戏/moba        |
| [永恒支柱 2](#)            | 2022年4月21日 | 游戏            | - #游戏/crpg        |
| [星露谷物语](#)            | 2021年4月4日  | 游戏/完成       | - #游戏/模拟        |

!!! hint "隐含字段"
对 `file.folder` 和 `file.etags` 感兴趣吗？请参阅[页面上的隐含字段](../annotation/metadata-pages.md)来了解更多信息。

### 自定义列标题

您可以使用 `AS` 语法来指定列的自定义标题：

````
```dataview
TABLE 开始时间, 文件.文件夹 AS 路径, 文件.etags AS "文件标签"
FROM #游戏
```
````

**输出**

| 文件 (3)                    | 开始时间          | 路径            | 文件标签            |
| -------------------------- | ---------------- | -------------- | ------------------- |
| [英雄联盟](#)               | 2021年5月16日     | 游戏            | - #游戏/moba         |
| [永恒之柱2](#)              | 2022年4月21日     | 游戏            | - #游戏/crpg         |
| [星露谷物语](#)             | 2021年4月4日      | 游戏/完成        | - #游戏/模拟         |

!!! info "包含空格的自定义标题"
如果您想要使用包含空格的自定义标题，例如 `文件标签`，您需要用双引号将其括起来："文件标签"。

这在您想要使用**计算或表达式作为列值**时非常有用：

````
```dataview
TABLE 
default(完成，今天的日期) - 开始时间 AS "玩了多久", 
文件.文件夹 AS 路径, 
文件.etags AS "文件标签"
FROM #游戏
```
````

**输出**

| 文件 (3)                    | 玩了多久                   | 路径            | 文件标签            |
| -------------------------- | -------------------------- | -------------- | ------------------- |
| [英雄联盟](#)               | 1年6个月1周                 | 游戏            | - #游戏/moba         |
| [永恒之柱2](#)              | 7个月2天                    | 游戏            | - #游戏/crpg         |
| [星露谷物语](#)             | 4个月3周3天                 | 游戏/完成        | - #游戏/模拟         |

!!! hint "计算和表达式"
了解关于计算表达式和计算功能的更多信息，请参阅[表达式](../reference/expressions.md)和[函数](../reference/functions.md)。

### 无ID的TABLE

如果您不希望第一列显示（默认为“文件”或“组”），可以使用 `TABLE WITHOUT ID`。`TABLE WITHOUT ID` 与 `TABLE` 功能相同，但如果您添加了额外信息，它不会输出文件链接或组名作为第一列。

您可以使用它，例如，输出另一个标识值：

````
```dataview
TABLE WITHOUT ID
steamid,
文件.etags AS "文件标签"
FROM #游戏
```
````

**输出**

| steamid (3) | 文件标签            |
| ----------- | ------------------- |
| 560130       | - #游戏/crog         |
| -            | - #游戏/moba         |
| 413150       | - #游戏/模拟         |

另外，您也可以使用 `TABLE WITHOUT ID` 如果您想要**为特定查询重命名第一列**。

````
```dataview
TABLE WITHOUT ID
文件.link AS "游戏",
文件.etags AS "文件标签"
FROM #游戏
```
````

**输出**

| 游戏 (3)                    | 文件标签            |
| -------------------------- | ------------------- |
| [英雄联盟](#)               | - #游戏/moba         |
| [永恒之柱2](#)              | - #游戏/crpg         |
| [星露谷物语](#)             | - #游戏/模拟         |

!!! info "一般重命名第一列"
如果您想要在所有情况下重命名第一列，请在 Dataviews 设置下的表格设置中更改名称。

## 任务

`TASK` 查询输出所有与给定的 [数据命令](data-commands.md)（如果有的话）相匹配的**任务列表**。`TASK` 查询与其他查询类型不同，因为它们返回的是任务，而不是页面。这意味着所有的[数据命令](data-commands.md)都应用于任务级别，并且可以精确地筛选任务，例如基于它们的状态或任务本身指定的元数据。

此外，`TASK` 查询是通过DQL操作文件的唯一方法。通常情况下，Dataview 不会修改文件的内容；但是，如果你在Dataview 块内检查一个任务，它也会在原始文件中标记为已检查。在Dataview 设置中的“任务设置”下，你可以选择自动设置一个`completion`元数据字段，当在Dataview 中检查任务时。但请注意，这只有在你在Dataview 块内检查任务时才有效。

!!! summary "`TASK` 查询类型"
`TASK` 查询渲染所有在你的知识库中的任务的交互式列表。`TASK` 查询在任务级别执行，而不是页面级别，允许对特定任务进行筛选。这是Dataview 中唯一一个修改你原始文件的命令，如果你与之交互的话。

````
```dataview
TASK
```
````

**输出**

- [ ] 购买新鞋 #购物
- [ ] 给保罗发邮件讨论训练计划
- [ ] 完成数学作业
   - [x] 完成论文1 \[截止日期:: 2022-08-13]
   - [ ] 再次阅读第3章 \[截止日期:: 2022-09-01]
   - [x] 编写一个备忘录 \[截止日期:: 2022-08-02]
   - [ ] 编写第1-4章的总结 \[截止日期:: 2022-09-12]
- [x] 提交物理作业
- [ ] 给妈妈买新枕头 #购物
- [x] 购买一些好用的铅笔 #购物

你可以使用[数据命令](data-commands.md)和所有其他查询类型一样。数据命令在任务级别执行，使得[任务上的隐式字段](../annotation/metadata-tasks.md)直接可用。

````
```dataview
TASK
WHERE !completed AND contains(tags, "#购物")
```
````

**输出**

- [ ] 购买新鞋 #购物
- [ ] 给妈妈买新枕头 #购物

任务的一个常见用途是**按它们的来源文件对任务进行分组**：

````
```dataview
TASK
WHERE !completed
GROUP BY file.link
```
````

**输出**

[2022-07-30](#) (1)

- [ ] 完成数学作业
   - [ ] 再次阅读第3章 \[截止日期:: 2022-09-01]
   - [ ] 编写第1-4章的总结 \[截止日期:: 2022-09-12]

[2022-09-21](#) (2)

- [ ] 购买新鞋 #购物
- [ ] 给保罗发邮件讨论训练计划

[2022-09-27](#) (1)

- [ ] 给妈妈买新枕头 #购物

!!! hint "计算包含子任务的任务"
注意到`2022-07-30`标题旁边的(1)了吗？子任务属于它们的父任务，并且不会单独计数。此外，它们在过滤时的行为也有所不同。

### 子任务

如果一个任务**被一个制表符缩进**，并且位于一个未缩进的任务下方，那么它就被认为是一个**子任务**。

- [ ] 清理房子
   - [ ] 厨房
   - [x] 客厅
   - [ ] 卧室 \[紧急:: true]

!!! info "项目符号点项的子项"
尽管在项目符号点项下的缩进任务在严格意义上也是子任务，但Dataview在大多数情况下会像处理正常任务一样处理它们。

子任务**属于它们的父任务**。这意味着如果你查询任务，你会得到作为其父任务的一部分的子任务。

````
```dataview
TASK
```
````

**输出**

- [ ] 清理房子
   - [ ] 厨房
   - [x] 客厅
   - [ ] 卧室 \[紧急:: true]
- [ ] 给汽车保险打电话
- [x] 查找交易编号

这意味着只要父任务匹配查询，子任务就会成为你的结果集的一部分——即使子任务本身不匹配。

````
```dataview
TASK
WHERE !completed
```
````

**输出**

- [ ] 清理房子
   - [ ] 厨房
   - [x] 客厅
   - [ ] 卧室 \[紧急:: true]
- [ ] 给汽车保险打电话

在这里，`客厅`**不匹配**查询，但仍然被包括在内，因为其父任务`清理房子`确实匹配。

请注意，如果你的谓词匹配子任务但父任务不匹配，你将得到单独的子任务：

````
```dataview
TASK
WHERE urgent
```
````

**输出**

- [ ] 卧室 \[紧急:: true]

## 日历

`CALENDAR` 查询会输出一个基于月度的日历，其中每个结果都以一个点的形式显示在其对应的日期上。`CALENDAR` 是唯一需要额外信息的查询类型。这个额外信息需要是一个 [日期](../annotation/types-of-metadata.md#date)（或未设置）在所有查询页面的元数据上。

!!! 摘要 "`CALENDAR` 查询类型"
`CALENDAR` 查询类型会渲染一个日历视图，在该视图中，每个结果都通过给定元数据字段日期上的一个点来表示。

````
```dataview
CALENDAR 文件的创建时间
```
````

**输出**

![](../assets/calendar_query_type.png)

虽然可以在 `CALENDAR` 中与 `SORT` 和 `GROUP BY` 结合使用，但这**不起作用**。此外，如果给定的元数据字段包含的不是有效的 [日期](../annotation/types-of-metadata.md#date)（字段可以为空），则日历查询将不会渲染。为了确保只考虑具有有效元数据值的页面，你可以过滤以获取有效的元数据值：

````
```dataview
CALENDAR 截止日期
WHERE typeof(截止日期) = "date"
```
````

请注意，上述翻译已根据中文习惯和文化差异进行了调整，以确保文本的流畅性和准确性。同时，输出结果也被调整为符合 Markdown 格式，以便在支持 Markdown 的平台上正确显示。
