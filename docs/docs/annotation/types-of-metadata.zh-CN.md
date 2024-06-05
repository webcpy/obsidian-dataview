# 字段类型

数据视图中的所有字段都有一个**类型**，这决定了数据视图如何渲染、排序和操作该字段。
有关如何创建字段的更多信息，请参阅["添加元数据"](add-metadata.md)，以及您在[页面元数据](./metadata-pages.md)和[任务与列表元数据](./metadata-tasks.md)上自动可用的信息。

## 类型为何重要？

数据视图提供了[函数](../reference/functions.md)，您可以使用这些函数来修改元数据，并允许您编写各种复杂的查询。特定的函数需要特定的数据类型才能正确工作。这意味着您字段的数据类型决定了您可以对这些字段使用哪些函数以及函数的行为。此外，根据类型，数据视图渲染的输出可能会有所不同。

大多数时候，您不需要太担心字段的类型，但如果您想在数据上执行计算和其他神奇的操作，您应该意识到它们。

!!! 例子 "基于类型的不同渲染"
如果您有以下文件：
\~\~\~yaml
date1:: 2021-02-26T15:15
date2:: 2021-04-17 18:00

````
```dataview
TABLE date1, date2
WHERE file = this.file
```
~~~

您将看到以下输出（取决于您对数据视图的日期+时间格式设置）：

| 文件 (1) | date1 | date2 |
| -------- | ----- | ----- |
| Untitled 2 | 3:15 PM - 2月 26, 2021 | 2021-04-17 18:00 |

`date1` 被识别为**日期**类型，而 `date2` 对数据视图来说是普通**文本**，这就是为什么 `date1` 会被以不同的方式为您解析。有关[日期](#date)的更多信息，请参阅下面的内容。

````


## 可用字段类型

Dataview 了解多种字段类型，以覆盖常见的使用场景。

### 文本

默认的万能类型。如果字段不符合更具体的类型，则它被视为普通文本。

```markdown
示例:: 这是一些正常的文本。
```

!!! hint "多行文本"
只有通过 YAML 前置内容和管道操作符，才能实现多行文本作为值：
`yaml      ---
     poem: |
       因为我不能停下来等待死亡，
       他亲切地为我停了下来；
       马车里只有我们自己
       和不朽。
     author: "[[Emily Dickinson]]"
     title: "因为我不能停下来等待死亡"      ---
    `
对于内联字段，换行符意味着值的结束。

### 数字

像 '6' 和 '3.6' 这样的数字。

```markdown
示例:: 6
示例:: 2.4
示例:: -80
```

在 YAML 前置内容中，你可以写出不带引号的数字：

```yaml
---
rating: 8
description: "一部不错的小恐怖电影"
---
```

### 布尔值

布尔值只知道两个值：true 或 false，即编程概念中的真和假。

```markdown
示例:: true
示例:: false
```

### 日期

符合 ISO8601 格式的文本将自动转换为日期对象。[ISO8601](*** 采用格式 `YYYY-MM[-DDTHH:mm:ss.nnn+ZZ]`。月份之后的部分是可选的。

```markdown
示例:: 2021-04 
示例:: 2021-04-18
示例:: 2021-04-18T04:19:35.000
示例:: 2021-04-18T04:19:35.000+06:30
```

在查询这些日期时，你可以访问属性，以获取日期的某个部分：

- field.year
- field.month
- field.weekyear
- field.week
- field.weekday
- field.day
- field.hour
- field.minute
- field.second
- field.millisecond

例如，如果你想知道日期是哪个月份，你可以通过 `datefield.month` 访问它：

````markdown
birthday:: 2001-06-11

```dataview
LIST birthday
WHERE birthday.month = date(now).month
```
````

这将返回本月的所有生日。想知道 `date(now)` 吗？更多关于它的信息请参阅 [字面量](./../../reference/literals/#dates)。

!!! info "日期对象的显示"
Dataview 以易于阅读的格式渲染日期对象，即 `3:15 PM - 2021年2月26日`。你可以在 Dataview 的设置中“常规”部分的“日期格式”和“日期 + 时间格式”下调整显示格式。如果你想在特定查询中仅调整格式，请使用 [dateformat 函数](../../reference/functions/#dateformatdatedatetime-string)。

### 时长

时长是以 `<时间> <单位>` 形式的文本，例如 `6小时` 或 `4分钟`。接受常见的英语缩写，如
`6hrs` 或 `2m`。你可以在一个字段中指定多个单位，即 `6小时，4分钟`，可选地带有逗号分隔：`6小时, 4分钟`

```markdown
示例:: 7小时
示例:: 16天
示例:: 4分钟
示例:: 6小时7分钟
示例:: 9年, 8个月, 4天, 16小时, 2分钟
示例:: 9年8分钟
```

在 [字面量](./../../reference/literals/#durations) 中查找完整的值列表，这些值被识别为时长。

!!! hint "与日期和时长的计算"
日期和时长类型是相互兼容的。这意味着你可以将时长添加到日期中，以产生新的日期：
\~\~\~markdown
departure:: 2022-10-07T15:15
旅行时长:: 1天, 3小时

```
**到达时间**：`= this.departure + this.旅行时长`
~~~

你还可以在日期计算中得到时长：
~~~markdown
release-date:: 2023-02-14T12:00
  
`= this.release-date - date(now)` 直到发布！！
~~~

想知道 `date(now)` 吗？更多关于它的信息请参阅 [字面量](./../../reference/literals/#dates)。

### 链接

Obsidian链接类似于 `[[Page]]` 或 `[[Page|Page Display]]`。

```markdown
示例:: [[A Page]]
示例:: [[Some Other Page|Render Text]]
```

!!! info "YAML前置元数据中的链接"
如果您在前置元数据中引用链接，则需要将其放在引号内，如下所示：`key: "[[Link]]"`。这是Obsidian支持的默认行为。未加引号的链接会导致无法解析的无效YAML前置元数据。
```yaml
---
parent: "[[parentPage]]"
---
```
请注意，这只是一个对dataview的链接，而不是对Obsidian的链接 —— 意味着它不会显示在传出链接中，不会在图形视图中显示，也不会在例如重命名时更新。

### 列表

列表是多值字段。在YAML中，这些被定义为普通的YAML列表：

```yaml
---
key3: [one, two, three]
key4:
 - four
 - five
 - six
---
```

在内联字段中，它们是用逗号分隔的列表值：

```markdown
示例1:: 1, 2, 3
示例2:: "yes", "or", "no"
```

请注意，在内联字段中，您需要将**文本值**用引号括起来，以便被识别为列表（参见`示例2`）。`yes, or, no` 被识别为普通文本。

!!! info "同一文件中重复的元数据键会导致列表"
如果您在同一个笔记中使用同一个元数据键两次或更多次，dataview会收集所有值并为您提供一个列表。例如
```markdown
杂货:: 面粉
[...]
杂货:: 肥皂
```
```dataview
LIST 杂货
WHERE file = this.file
```
将会给您一个由 `面粉` 和 `肥皂` 组成的**列表**。

!!! hint "数组是列表"
在本手册的某些地方，您可能会看到“数组”这个词。数组是Javascript中的列表术语 —— 列表和数组是相同的。一个需要数组作为参数的函数需要一个列表作为参数。

### 对象

对象是一个或多个字段的映射，它们在同一个父字段下。这些只能在YAML前置元数据中定义，使用YAML对象语法：

```yaml
---
obj:
   key1: "Val"
   key2: 3
   key3: 
     - "List1"
     - "List2"
     - "List3"
---
```

在查询中，您可以使用 `obj.key1` 等方式访问这些子值：

```markdown
```dataview
TABLE obj.key1, obj.key2, obj.key3
WHERE file = this.file
```
```

