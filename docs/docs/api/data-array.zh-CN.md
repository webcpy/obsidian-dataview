# 数据数组

在Dataview中，结果列表的一般表示形式是`DataArray`，它是JavaScript数组的[代理](***版本，扩展了其功能。数据数组支持索引和迭代（通过`for`和`for ... of`循环），就像普通数组一样，但也包括许多数据操作运算符，如`sort`、`groupBy`、`distinct`、`where`等，以简化表格数据的操作。

## 创建

大多数Dataview API在返回多个结果时会返回数据数组，例如`dv.pages()`。您也可以使用`dv.array(<array>)`将普通的JavaScript数组显式转换为数据数组。如果您想将数据数组转换回普通数组，可以使用`DataArray#array()`。

## 索引和切片

数据数组支持像普通数组一样的常规索引（如`array[0]`），但重要的是，它们还支持查询语言风格的“切片”：如果使用字段名（如`array.field`）索引数据数组，它会自动将数组中的每个元素映射到`field`，如果`field`本身也是一个数组，则会将其展平。

例如，`dv.pages().file.name`将返回您在知识库中所有文件名的数据数组；`dv.pages("#books").genres`将返回您书籍中所有流派的扁平化列表。

## 原始接口

以下提供了数据数组实现的完整接口供参考：

```ts
/** 一个将数组元素映射到某个值的函数类型。 */
export type ArrayFunc<T, O> = (elem: T, index: number, arr: T[]) => O;

/** 一个比较两个类型是否相等的函数类型。 */
export type ArrayComparator<T> = (a: T, b: T) => number;

/**
 * 代理接口，允许操作基于数组的数据。数据数组上的所有函数都会生成一个新的数组
 * （即，数组是不可变的）。
 */
export interface DataArray<T> {
     /** 数组中元素的总数。 */
     length: number;

     /** 过滤数据数组，仅保留符合给定谓词的元素。 */
     where(predicate: ArrayFunc<T, boolean>): DataArray<T>;
     /** 为那些想要数组语义的人提供的 'where' 的别名。 */
     filter(predicate: ArrayFunc<T, boolean>): DataArray<T>;

     /** 将数据数组中的元素映射到另一个类型，通过应用一个函数到每个元素。 */
     map<U>(f: ArrayFunc<T, U>): DataArray<U>;
     /** 将数据数组中的元素映射到另一个类型，然后将结果平坦化，生成一个新的数组。 */
     flatMap<U>(f: ArrayFunc<T, U[]>): DataArray<U>;
     /** 可变地更改数组中的每个值，返回相同的数组，可以进一步链接操作。 */
     mutate(f: ArrayFunc<T, any>): DataArray<any>;

     /** 将数组中的元素数量限制为给定值。 */
     limit(count: number): DataArray<T>;
     /**
      * 对数组进行切片。如果 `start` 未定义，则假定为 0；如果 `end` 未定义，则假定为数组的末尾。
      */
     slice(start?: number, end?: number): DataArray<T>;
     /** 将此数据数组的值与另一个可迭代对象/数据数组/数组的值串联起来。 */
     concat(other: Iterable<T>): DataArray<T>;

     /** 返回给定元素的首个索引（可选地从指定索引开始搜索） */
     indexOf(element: T, fromIndex?: number): number;
     /** 返回首个满足给定谓词的元素。 */
     find(pred: ArrayFunc<T, boolean>): T | undefined;
     /** 返回首个满足给定谓词的元素的索引。如果没有找到，返回 -1。 */
     findIndex(pred: ArrayFunc<T, boolean>, fromIndex?: number): number;
     /** 如果数组包含给定元素，则返回 true，否则返回 false。 */
     includes(element: T): boolean;

     /**
      * 将数组中的每个元素转换为字符串，然后用给定的分隔符（默认为 ', '）连接起来。
      */
     join(sep?: string): string;

     /**
      * 返回一个根据给定键排序的数组；如果提供了可选的比较器，则将使用该比较器而不是默认的 dataview 比较器。
      */
     sort<U>(key: ArrayFunc<T, U>, direction?: "asc" | "desc", comparator?: ArrayComparator<U>): DataArray<T>;

     /**
      * 返回一个数组，其中的元素根据给定的键进行分组；结果数组中的对象形式为
      * { key: <键值>, rows: DataArray }。
      */
     groupBy<U>(key: ArrayFunc<T, U>, comparator?: ArrayComparator<U>): DataArray<{ key: U; rows: DataArray<T> }>;

     /**
      * 返回去重后的条目。如果提供了键，则返回具有不同键的行。
      */
     distinct<U>(key?: ArrayFunc<T, U>, comparator?: ArrayComparator<U>): DataArray<T>;

     /** 如果谓词对所有值都为真，则返回 true。 */
     every(f: ArrayFunc<T, boolean>): boolean;
     /** 如果谓词对至少一个值为真，则返回 true。 */
     some(f: ArrayFunc<T, boolean>): boolean;
     /** 如果谓词对所有值都不为真，则返回 true。 */
     none(f: ArrayFunc<T, boolean>): boolean;

     /** 返回数据数组中的首个元素。如果数组为空，则返回 undefined。 */
     first(): T;
     /** 返回数据数组中的最后一个元素。如果数组为空，则返回 undefined。 */
     last(): T;
}
```

请注意，上述代码是 TypeScript 的接口定义，已经根据 BCP 47 标准进行了翻译。代码中的注释和类型名称已被翻译成中文，以符合中文语境和编程习惯。同时，翻译保持了代码的准确性和专业性。在实际的项目中，可能还需要根据实际的文化和语言习惯进行微调。

```markdown
/** 将此数据数组中的每个元素映射到给定的键上，然后将其扁平化。*/
     to(key: string): DataArray<any>;
     /**
      * 递归地展开给定的键，将基于键的树形结构扁平化为一个平坦数组。这在处理具有“子任务”的层级数据时非常有用。
      */
     expand(key: string): DataArray<any>;

     /** 在数组的每个元素上运行一个lambda函数。 */
     forEach(f: ArrayFunc<T, void>): void;

     /** 将此转换为一个普通的JavaScript数组。 */
     array(): T[];

     /** 允许直接遍历数组。 */
     [Symbol.iterator](): Iterator<T>;

     /** 将索引映射到值。 */
     [index: number]: any;
     /** 字段的自动扁平化。相当于隐式调用 `array.to("field")` */
     [field: string]: any;
}
```

