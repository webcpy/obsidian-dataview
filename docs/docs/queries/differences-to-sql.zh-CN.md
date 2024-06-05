# 数据视图查询语言（DQL）和SQL

如果你熟悉SQL并且有编写SQL查询的经验，你可能会用类似的方法来写DQL查询。然而，DQL与SQL有显著的不同。

DQL查询是从上到下逐行执行的。它更像是一个计算机程序，而不是一个典型的SQL查询。

当一行被评估时，它会产生一个结果集，并将整个集合传递给下一行的DQL，后者将处理它从上一行收到的集合。这就是为什么在DQL中，例如，可以有多个WHERE子句。但在DQL中，它不是“子句”而是“数据命令”。DQL查询的每一行（除了第一行和第二行）都是“数据命令”。

## DQL查询的结构

DQL查询不是以SELECT开头，而是以决定查询类型的单词开头，这决定了你的最终结果将如何在屏幕上显示（一个表格，一个列表，一个任务列表，或一个日历）。然后是字段列表，这实际上与你在SELECT语句后面放的列列表非常相似。

接下来的行以FROM开头，后面不跟表名，而是跟一个复杂的表达式，类似于SQL WHERE子句。在这里，你可以过滤很多东西，比如文件中的标签、文件名、路径名等。在后台，这个命令已经产生了一个结果集，这将是我们进一步通过后续行的“数据命令”处理的初始集合。

你可以有任意多的后续行。每一行都以一个[数据命令](../../queries/data-commands)开始，并将它从上一行收到的结果集重新塑形。例如：

- WHERE数据命令将只保留那些符合给定条件的结果集中的行。这意味着，除非结果集中的所有数据都符合条件，否则这个命令将传递一个比从上一行收到的集合小的结果集给下一行。与SQL不同，你可以根据需要使用任意多的WHERE命令。
- FLATTEN数据命令在常见的SQL中找不到，但在DQL中，你可以使用它来减少结果集的深度。
- DQL与SQL类似，也有GROUP BY命令，但在DQL中，这个命令也可以多次使用，这是在常见的SQL中不可能的。你甚至可以在一个接一个的命令中执行多个SORT或GROUP BY。
