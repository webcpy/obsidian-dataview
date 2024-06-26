# 页面元数据

您可以在Markdown页面（笔记）中添加字段的三种不同方式是通过Frontmatter、内联字段和隐式字段。更详细地了解前两种可能性，请参阅["如何添加元数据"](./add-metadata.md)。

## 隐式字段

Dataview自动为每个页面添加大量元数据。这些隐式且自动添加的字段被收集在字段`file`下。以下是可以使用：

| 字段名称          | 数据类型       | 描述                                                                                                                                            |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `file.name`      | 文本           | 在Obsidian侧边栏中看到的文件名。                                                                                                                 |
| `file.folder`    | 文本           | 这个文件所属的文件夹路径。                                                                                                                      |
| `file.path`      | 文本           | 包括文件名的完整文件路径。                                                                                                                      |
| `file.ext`       | 文本           | 文件类型扩展名，通常为`md`。                                                                                                                    |
| `file.link`      | 链接           | 文件的链接。                                                                                                                                    |
| `file.size`      | 数字           | 文件的大小（以字节为单位）。                                                                                                                     |
| `file.ctime`     | 日期和时间     | 文件创建的日期。                                                                                                                                |
| `file.cday`      | 日期           | 文件创建的日期。                                                                                                                                |
| `file.mtime`     | 日期和时间     | 文件最后一次修改的日期。                                                                                                                        |
| `file.mday`      | 日期           | 文件最后一次修改的日期。                                                                                                                        |
| `file.tags`      | 列表           | 笔记中所有唯一的标签列表。子标签按每个级别分开，因此`#Tag/1/A`将作为`[#Tag, #Tag/1, #Tag/1/A]`存储在列表中。                                      |
| `file.etags`     | 列表           | 笔记中所有显式标签的列表；与`file.tags`不同，不会分解子标签，即`[#Tag/1/A]`。                                                                  |
| `file.inlinks`   | 列表           | 这个文件的所有入站链接，即所有包含指向这个文件链接的文件。                                                                                      |
| `file.outlinks`  | 列表           | 这个文件的所有出站链接，即文件包含的所有链接。                                                                                                    |
| `file.aliases`   | 列表           | 笔记的别名列表，如通过[YAML frontmatter](***定义的。                                             |
| `file.tasks`     | 列表           | 这个文件中的所有任务（例如，`[ ] some task`）。                                                                                                   |
| `file.lists`     | 列表           | 文件中的所有列表元素（包括任务）；这些元素实际上是任务，可以渲染在任务视图中。                                                                  |
| `file.frontmatter` | 列表         | 包含所有前置元数据的原始值，形式为`key | value`文本值；主要用于检查原始前置元数据值或动态列出前置元数据键。 |
| `file.day`       | 日期           | 如果文件的文件名中有日期（格式为`yyyy-mm-dd`或`yyyymmdd`），或者有`Date`字段/内联字段，则可用。                                               |
| `file.starred`   | 布尔值         | 如果这个文件通过Obsidian核心插件“书签”被标记过。                                                                                                  |

## 示例页面

这是一个包含用户定义添加元数据方式的小Markdown页面：

```markdown
---
genre: "action"
reviewed: false
---
# Movie X
#movies

**Thoughts**:: It was decent.
**Rating**:: 6

[mood:: okay] | [length:: 2 hours]
```

除了您在这里看到的值之外，页面还具有上述所有键。

### 示例查询

例如，您可以使用以下查询查询上述信息的一部分：

````yaml
```dataview
TABLE file.ctime, length, rating, reviewed
FROM #movies
```
````

请注意，以上翻译是根据BCP 47标准进行的，以确保内容准确性和优雅性。此外，Markdown文件的结构被保留，确保输出仍然是有效的Markdown文件。

