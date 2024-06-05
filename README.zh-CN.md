## FLATTEN 命令

`FLATTEN` 命令可以将每一行中的数组展开，使得数组中的每个条目都有一行结果。

```
FLATTEN field
FLATTEN (computed_field) AS name
```

例如，将每篇文献笔记中的 `authors` 字段展开，使每位作者都有一行结果：

=== "查询"
    ```sql
    TABLE authors FROM #LiteratureNote
    FLATTEN authors
    ```
=== "输出"
    |文件|作者|
    |-|-|
    |stegEnvironmentalPsychologyIntroduction2018 SN|Steg, L.|
    |stegEnvironmentalPsychologyIntroduction2018 SN|Van den Berg, A. E.|
    |stegEnvironmentalPsychologyIntroduction2018 SN|De Groot, J. I. M.|
    |Soap Dragons SN|Robert Lamb|
    |Soap Dragons SN|Joe McCormick|
    |smithPainAssaultSelf2007 SN|Jonathan A. Smith|
    |smithPainAssaultSelf2007 SN|Mike Osborn|

这种方法非常适用于处理深度嵌套的列表，使其更易于使用。
例如，`file.lists` 或 `file.tasks`。
注意虽然查询更简单，但最终结果略有不同（分组 vs 非分组）。
您可以使用 `GROUP BY file.link` 来实现相同的结果，但需要使用如前所述的 `rows.T.text`。

### 使用实例

假设我们有一个包含多个作者的文献笔记，并且我们希望每个作者都有一个单独的条目。通过 `FLATTEN` 命令，我们可以将 `authors` 字段展开：

#### 查询示例

```sql
TABLE authors
FROM #LiteratureNote
FLATTEN authors
```

#### 输出示例

|文件|作者|
|---|---|
|stegEnvironmentalPsychologyIntroduction2018 SN|Steg, L.|
|stegEnvironmentalPsychologyIntroduction2018 SN|Van den Berg, A. E.|
|stegEnvironmentalPsychologyIntroduction2018 SN|De Groot, J. I. M.|
|Soap Dragons SN|Robert Lamb|
|Soap Dragons SN|Joe McCormick|
|smithPainAssaultSelf2007 SN|Jonathan A. Smith|
|smithPainAssaultSelf2007 SN|Mike Osborn|

### 深度嵌套列表

如果我们有一个深度嵌套的列表，例如 `file.lists` 或 `file.tasks`，我们也可以使用 `FLATTEN` 命令来简化这些列表的查询和使用。

#### 示例

假设我们有一个笔记文件，其中包含多个任务，每个任务又包含多个子任务。我们希望将所有子任务展平并显示出来：

```sql
TABLE tasks.text AS "任务"
FROM "Project"
FLATTEN file.tasks AS tasks
WHERE tasks.status = "open"
```

这个查询将找到文件夹 `Project` 中所有包含未完成任务的文件，并将每个任务及其子任务分别列出。

### 使用 `GROUP BY`

如果您需要将结果分组，并且每个组中的每个条目都需要列出，您可以结合使用 `GROUP BY` 和 `FLATTEN`：

#### 查询示例

```sql
TABLE file.link AS "文件", rows.T.text AS "任务"
FROM "Project"
FLATTEN file.tasks AS T
WHERE T.status = "open"
GROUP BY file.link
```

#### 输出示例

|文件|任务|
|---|---|
|[Project 1](Project1)|任务 1|
|[Project 1](Project1)|任务 2|
|[Project 2](Project2)|任务 3|
|[Project 2](Project2)|任务 4|

通过这种方式，您可以实现复杂数据的简化和整合，便于更好地理解和操作数据。

### 总结

`FLATTEN` 命令是处理和显示嵌套数组数据的强大工具。通过将数组字段展开为独立的行，您可以更容易地操作和查询数据，从而提高数据的可读性和操作性。结合其他数据命令，如 `GROUP BY` 和 `WHERE`，可以实现更复杂和灵活的数据查询和展示。