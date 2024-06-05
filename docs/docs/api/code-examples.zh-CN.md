# 代码块示例

## 分组书籍

将书籍按类型分组，然后使用数据视图渲染API的直接用法为每个类型创建一个按评分排序的表格：

```js
for (let group of dv.pages("#book").groupBy(p => p.genre)) {
	dv.header(3, group.key);
	dv.table(["书名", "阅读时间", "评分"],
			group.rows
				.sort(k => k.rating, 'desc')
				.map(k => [k.file.link, k["time-read"], k.rating]))
}
```

![分组书籍示例](../assets/grouped-book-example.png)

## 查找所有直接和间接链接的页面

使用一个简单的集合加栈深度优先搜索，找出所有链接到当前笔记或选定笔记的笔记：

```js
let page = dv.current().file.path;
let pages = new Set();

let stack = [page];
while (stack.length > 0) {
	let elem = stack.pop();
	let meta = dv.page(elem);
	if (!meta) continue;

	for (let inlink of meta.file.inlinks.concat(meta.file.outlinks).array()) {
			console.log(inlink);
			if (pages.has(inlink.path)) continue;
			pages.add(inlink.path);
			stack.push(inlink.path);
	}
}

// 现在数据是每个直接或间接链接到当前页面的所有页面的文件元数据。
let data = dv.array(Array.from(pages)).map(p => dv.page(p));
```

请注意，上述代码示例已经用中文进行了注释和说明，以符合Bash 47标准的中文翻译要求。如果需要进一步的调整或优化，请提供更多的上下文或指导。

