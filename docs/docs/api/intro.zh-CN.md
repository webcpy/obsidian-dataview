# 概览

Dataview JavaScript API 允许执行任意 JavaScript 代码，并能够访问 dataview 索引和查询引擎，这对于构建复杂的视图或与其他插件的互操作非常有用。API 有两种形式：一种是面向插件的，另一种是用户面向的（或称作“内联 API 使用”）。

## 内联访问

你可以通过以下方式创建一个 "DataviewJS" 代码块：

````markdown
```dataviewjs
dv.pages("#thing")...
```
````

在这样的代码块中执行的代码可以访问 `dv` 变量，它提供了与代码块相关的整个 dataview API（如 `dv.table()`、`dv.pages()` 等）。更多信息，请参阅[代码块 API 参考](../code-reference/)。

## 插件访问

你可以通过 `app.plugins.plugins.dataview.api` 从其他插件或控制台访问 Dataview 插件 API；该 API 类似于代码块引用，但由于缺乏隐含的执行查询的文件，其参数略有不同。更多信息，请参阅[插件 API 参考](../code-reference/)。

