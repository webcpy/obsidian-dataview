# 表达式

Dataview 查询语言中的 **表达式** 是指任何能够产生值的操作：

- 所有 [字段](../annotation/add-metadata.md)
- 所有 [字面量](./literals.md)
- 以及计算值，例如 `字段 - 9` 或者 [函数调用](./functions.md)。

总的来说，只要不是 [查询类型](../queries/query-types.md) 或者 [数据命令](../queries/data-commands.md)，其余都属于表达式。

以下是一个高层次的总结，下面是 DQL 中被认为是 **表达式** 的例子：

```
# 字面量
1                    (数字)
true/false           (布尔值)
"text"               (文本)
date(2021-04-18)     (日期)
dur(1 day)           (持续时间)
[[Link]]             (链接)
[1, 2, 3]            (列表)
{ a: 1, b: 2 }       (对象)

# Lambda表达式
(x1, x2) => ...      (Lambda表达式)

# 引用
field                (直接引用字段)
simple-field         (引用包含空格或标点的字段，例如 "Simple Field!")
a.b                  (如果 a 是一个对象，检索名为 'b' 的字段)
a[expr]              (如果 a 是一个对象或数组，检索由表达式 'expr' 指定名称的字段)
f(a, b, ...)         (调用名为 `f` 的函数，并传入参数 a, b, ...)

# 算术运算
a + b                (加法)
a - b                (减法)
a * b                (乘法)
a / b                (除法)
a % b                (取模 / 除法的余数)

# 比较运算
a > b                (检查 a 是否大于 b)
a < b                (检查 a 是否小于 b)
a = b                (检查 a 是否等于 b)
a != b               (检查 a 是否不等于 b)
a <= b               (检查 a 是否小于或等于 b)
a >= b               (检查 a 是否大于或等于 b)

# 字符串操作
a + b                (字符串拼接)
a * num              (将字符串重复 <num> 次)

# 特殊操作
[[Link]].value       (从页面 `Link` 中获取 `value` 字段)
```

接下来，将提供每个部分的更详细的解释。

## 表达式类型

### 字段作为表达式

最简单的表达式是直接引用字段。如果你有一个字段叫做 "duedate"，那么你可以直接通过名称来引用它 - `duedate`。

````
```dataview
TABLE duedate, class, field-with-space
```
````

!!! info "带有空格和标点符号的字段名"
如果字段名包含空格、标点符号或其他非字母/数字字符，那么你可以使用 Dataview 的简化名称来引用它，即将其全部转换为小写并将空格替换为“-”。例如，`this is a field` 变成 `this-is-a-field`；`Hello!` 变成 `hello`，以此类推。更多内容请参阅[字段名](../annotation/add-metadata.md#field-names)。

### 字面量

常量值 - 如 `1` 或 `"hello"` 或 `date(som)` ("一个月的第一天")。Dataview 支持的每种数据类型都有字面量；更多内容请参阅[字面量](./literals.md)。

````
```dataview
LIST
WHERE file.name = "Scribble"
```
````

### 算术运算

你可以使用标准算术运算符来组合字段：加法 (`+`)、减法 (`-`)、乘法 (`*`) 和除法 (`/`)。例如 `field1 + field2` 是一个表达式，用于计算两个字段的和。

````
```dataview
TABLE start, end, (end - start) - dur(8 h) AS "Overtime" 
FROM #work
```

```dataview
TABLE hrs / 24 AS "days"
FROM "30 Projects"
```
````

### 比较运算

你可以使用各种比较运算符来比较大多数值：`<`、`>`、`<=`、`>=`、`=`、`!=`。这将产生一个布尔真值或假值，可以用于查询中的 `WHERE` 块。

````
```dataview
LIST
FROM "Games"
WHERE price > 10
```

```dataview
TASK
WHERE due <= date(today)
```

```dataview
LIST
FROM #homework
WHERE status != "done"
```
````

!!! hint "比较不同类型的数据"
将不同类型的[数据类型](../annotation/types-of-metadata.md)进行比较可能会导致意外的结果。以第二个例子为例：如果 `due` 未设置（无论是页面级别还是任务级别），它就是 `null`，而 `null <= date(today)` 返回 `true`，包括那些没有截止日期的任务。如果这不是预期的结果，请添加类型检查以确保你始终在比较相同类型的值：
\~\~\~
`dataview
     TASK
     WHERE typeof(due) = "date" AND due <= date(today)
     `
\~\~\~
通常，确保元数据可用性就足够了，通过 `WHERE due AND due <= date(today)` 就可以，但检查类型是获得可预见结果的更安全方法。

### 列表/对象索引

您可以通过索引操作符 `list[<index>]` 从 [列表/数组](../annotation/types-of-metadata.md#list) 中检索数据，其中 `<index>` 是任何计算表达式。
列表是0索引的，所以第一个元素的索引是0，第二个元素的索引是1，以此类推。
例如 `list("A", "B", "C")[0] = "A"`。

对于 [对象](../annotation/types-of-metadata.md#object)，也有类似的表示法。
您可以使用 `field["nestedfield"]` 来引用对象内的字段或类似嵌套的字段。
例如，在下面定义的YAML中，我们可以通过 `episode_metadata["previous"]` 来引用 `previous`。

```yaml
---
aliases:
   - "ABC"
current_episode: "S01E03"
episode_metadata:
   previous: "S01E02"
   next: "S01E04"
---
```

您也可以使用索引操作符从对象（它将文本映射到数据值）检索数据，其中索引现在是字符串/文本而不是数字。
您还可以使用简写 `object.<name>`，其中 `<name>` 是要检索的值的名称。
对于前面的前言示例，我们也可以使用 `episode_metadata.previous` 来获得相同的值。

索引表达式也适用于对象，这些对象具有查询语言不直接支持的字段。
一个很好的例子是 `where`，因为它是关键字。
如果您的前言/元数据包含一个名为 `where` 的字段，您可以通过 `row` 语法引用它：`row["where"]`。
有关更多信息，请参阅 [FAQ中的注释](../resources/faq.md#how-do-i-use-fields-with-the-same-name-as-keywords-like-from-where) 和 [相应的议题](***。

````
```dataview
TABLE id, episode_metadata.next, aliases[0]
```
````

### 函数调用

Dataview 支持多种用于操作数据的函数，这些函数的完整描述可以在 [函数文档](../functions) 中找到。
它们的一般语法是 `function(arg1, arg2, ...)` - 例如 `lower(file.name)` 或 `regexmatch("A.+", file.folder)`。

````
```dataview
LIST
WHERE contains(file.name, "WIP")
```

```dataview
LIST
WHERE string(file.day.year) = split(this.file.name, "-W")[0]
```
````

### Lambda 表达式

Lambda 表达式是一种高级字面量，允许您定义一个函数，该函数接受一定数量的输入并产生输出。
它们的一般形式如下：

```
(arg1, arg2, arg3, ...) => <使用 args 的表达式>
```

Lambda 表达式在几个高级运算符中使用，如 `reduce` 和 `map`，用于允许对数据进行复杂的转换。
一些示例：

```
(x) => x.field                   （返回 x 的字段，常用于 map）
(x, y) => x + y                  （将 x 和 y 相加）
(x) => 2 * x                     （将 x 乘以 2）
(value) => length(value) = 4     （如果值长度为 4，则返回 true）
```

````
```dataview
CALENDAR file.day
FLATTEN all(map(file.tasks, (x) => ***pleted)) AS "allCompleted"
WHERE !allCompleted
```
````

---

## 类型特定的交互与值

大多数数据视图类型与操作符有特殊的交互，或者可以使用索引操作符检索额外的字段。这对于[日期](../annotation/元数据类型.md#日期)和[持续时间](../annotation/元数据类型.md#持续时间)以及链接同样适用。更多关于日期和持续时间的信息，请参阅它们在[元数据类型](../annotation/元数据类型.md)中的相应部分。

### 链接

你可以通过索引链接来获取对应页面上的值。例如 `[[Assignment Math]].duedate` 将会获取页面 `Assignment Math` 上的 `duedate` 值。

!!! 注意 "表达式中的链接索引"
如果你的链接是在内联字段或前言中定义的字段，比如 `Class:: [[Math]]`，并且你想要获取字段 `timetable`，那么你应该通过 `Class.timetable` 来进行索引。
使用 `[[Class]].timetable` 将会查找名为 `Class` 的页面，而不是 `Math`！

