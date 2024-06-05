# 示例

这里展示了一些简单的数据视图查询语言的使用示例。

---

显示游戏文件夹中所有游戏，按评分排序，并附带一些元数据：

\=== "查询"
`sql

    TABLE
      time-played AS "Time Played",
      length AS "Length",
      rating AS "Rating"
    FROM "games"
    SORT rating DESC
    `

\=== "输出"
|文件|Time Played|Length|Rating|
|-|-|-|-|
|[Outer Wilds](#)|November 19th - 21st, 2020|15h|9.5|
|[Minecraft](#)|All the time.|2000h|9.5|
|[Pillars of Eternity 2](#)|August - October 2019|100h|9|

---

列出所有MOBA或CRPG类游戏。

\=== "查询"
`sql

    LIST FROM #games/mobas OR #games/crpg
    `

\=== "输出"
* [League of Legends](#)
* [Pillars of Eternity 2](#)

---

列出所有未完成项目中的任务：

\=== "查询"
`sql

    TASK FROM "dataview"
    `

\=== "输出"
[dataview/Project A](#)

```
- [ ] 我是一个任务。
- [ ] 我是另一个任务。

[dataview/Project A](#)

- [ ] 我可能是一个任务，但谁知道呢。
     - [X] 确定这是否是一个任务。
- [X] 我是一个已完成的任务。
```

---

列出 `books` 文件夹中所有文件，并按最后一次修改文件的时间排序：

\=== "查询"
`sql

    TABLE file.mtime AS "Last Modified"
    FROM "books"
    SORT file.mtime DESC
    `

\=== "输出"
|文件|Last Modified|
|-|-|
|[Atomic Habits](#)|11:06 PM - August 07, 2021|
|[Can't Hurt Me](#)|10:58 PM - August 07, 2021|
|[Deep Work](#)|10:52 PM - August 07, 2021|

---

列出所有标题中包含日期（格式为 `yyyy-mm-dd` ）的文件，并按日期排序。

\=== "查询"
`sql

    LIST file.day WHERE file.day
    SORT file.day DESC
    `

\=== "输出"
\- [2021-08-07](#): August 07, 2021
\- [2020-08-10](#): August 10, 2020
