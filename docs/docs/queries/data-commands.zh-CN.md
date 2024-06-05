# 数据命令

数据视图查询可以由不同的命令组成。这些命令按顺序执行，可以有重复的命令（例如，多个 `WHERE` 块或多个 `GROUP BY` 块）。

## FROM

`FROM` 语句决定了哪些页面最初会被收集，并传递给其他命令以进行进一步的过滤。你可以从任何[来源](../reference/sources)选择，目前意味着通过文件夹、通过标签或通过入站/出站链接。

- **标签**: 选择来自一个标签（及其所有子标签）的页面，使用 `FROM #tag`。
- **文件夹**: 选择来自一个文件夹（及其所有子文件夹）的页面，使用 `FROM "folder"`。
- **单个文件**: 选择来自一个单独文件的页面，使用 `FROM "path/to/file"`。
- **链接**: 你可以选择指向文件的链接，或者文件中的所有链接。
   - 要获取所有链接到 `[[note]]` 的页面，使用 `FROM [[note]]`。
   - 要获取文件 `[[note]]` 中的所有链接（即文件中的所有链接），使用 `FROM outgoing([[note]])`。

你可以组合这些过滤器以获得更复杂的来源，使用 `and` 和 `or`。

- 例如，`#tag and "folder"` 将返回 `folder` 中的所有页面以及具有 `#tag` 标签的页面。
- `[[Food]] or [[Exercise]]` 将提供任何链接到 `[[Food]]` 或 `[[Exercise]]` 的页面。

你也可以使用 `-` "否定"来源，以获得不匹配来源的任何内容：

- `-#tag` 将排除具有给定标签的文件。
- `#tag and -"folder"` 将仅包括标记有 `#tag` 的文件，但不在 `"folder"` 中。

## WHERE

按字段过滤页面。只有当子句评估为 `true` 时，才会产生页面。

```
WHERE <子句>
```

1. 获取过去24小时内修改的所有文件：

    ```sql
    LIST WHERE file.mtime >= date(today) - dur(1 day)
    ```

2. 查找所有未标记为完成且超过一个月的项目：

    ```sql
    LIST FROM #projects
    WHERE !completed AND file.ctime <= date(today) - dur(1 month)
    ```

## SORT

根据一个或多个字段对所有结果进行排序。

```
SORT date [ASCENDING/DESCENDING/ASC/DESC]
```

你还可以按多个字段进行排序。排序将首先根据第一个字段进行。如果出现平局，则使用第二个字段对平局的字段进行排序。如果仍然平局，第三个排序将解决它，依此类推。

```
SORT field1 [ASCENDING/DESCENDING/ASC/DESC], ..., fieldN [ASC/DESC]
```

## GROUP BY

按字段对所有结果进行分组。为每个唯一字段值生成一行，其中包含两个属性：一个对应于被分组的字段，另一个是 `rows` 数组字段，其中包含所有匹配的页面。

```
GROUP BY field
GROUP BY (计算字段) AS name
```

为了更容易地处理 `rows` 数组，Dataview 支持字段 "swizzling"。如果你想要 `rows` 数组中每个对象的 `test` 字段，那么 `rows.test` 将自动从 `rows` 中的每个对象获取 `test` 字段，产生一个新数组。
然后，你可以对产生的数组应用聚合运算符，如 `sum()` 或 `flat()`。

## 压平

将数组压平，每行只有一个结果，数组中的每个元素对应一行。

```
FLATTEN 字段
FLATTEN (计算字段) AS 名称
```

例如，将每个文献笔记的`authors`字段压平，以便每行显示一个作者：

\=== "查询"
`sql
    从 #LiteratureNote 中选取 authors
    压平 authors
     `
\=== "输出"
|文件|作者|
\|-|-|
|stegEnvironmentalPsychologyIntroduction2018 SN|Steg, L.|
|stegEnvironmentalPsychologyIntroduction2018 SN|Van den Berg, A. E.|
|stegEnvironmentalPsychologyIntroduction2018 SN|De Groot, J. I. M.|
|Soap Dragons SN|Robert Lamb|
|Soap Dragons SN|Joe McCormick|
|smithPainAssaultSelf2007 SN|Jonathan A. Smith|
|smithPainAssaultSelf2007 SN|Mike Osborn|

一个很好的使用场景是当你需要更方便地使用嵌套列表时。例如，`file.lists` 或 `file.tasks`。
请注意，尽管查询更为简单，但最终结果略有不同（分组与非分组）。
你可以使用 `GROUP BY file.link` 来得到相同的结果，但这需要使用之前描述的 `rows.T.text`。

```
表 T.text 为 "Task Text"
来自 "Scratchpad"
压平 file.tasks 为 T
WHERE T.text
```

```
表 filter(file.tasks.text, (t) => t) 为 "Task Text"
来自 "Scratchpad"
WHERE file.tasks.text
```

`FLATTEN` 使得处理嵌套列表更加容易，因为你可以使用更简单的 WHERE 条件，而不是使用像 `map()` 或 `filter()` 这样的函数。

## 限制

限制结果最多为 N 个值。

```
LIMIT 5
```

命令是按顺序处理的，因此以下操作将在限制结果之后对结果进行排序：

```
LIMIT 5
按日期升序排序
```

