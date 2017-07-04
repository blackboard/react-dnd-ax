# React Dnd Sortable

## 动机

Github 上有非常多优秀的 React DnD 的 组件，尤其是你在 google 上会遇到的第一个搜索结果：[React Dnd](https://github.com/react-dnd/react-dnd), 但是在业务中，我相信很多开发者也遇到和我们相同的问题：那就是只需要一个可以拖动重新排序的列表，经过一段时间的调查，我们发现要满足支持多端,高度的自定义,同时还有完美的可访问性支持的组件还不存在，所以就写了这个高阶组件希望分享给有同样需求的开发者。

## 特性

* 高阶组件 (HOC) － 可以和你现有的组件完美融和
* 高度自定义 － 列表的样式和结构完全可控
* 完美支持桌面和移动端
* 完美支持 Accessibility（可访问性）－  **可以用键盘完成一切操作**
* 简单易用，容易上手

## 安装

```bash
npm install xxx-dnd --save
```
使用一个支持 ES2015模块 或者 CommonJs 的工具（webpack, Rollup）来引用：

```javascript
//  使用 Babel 来编译 ES6
import { DragNDropContainer, DragNDropItem } from 'react-xxx-hoc'

// 不使用 ES6 编译器
var Sortable = require('react-xxx-hoc')
var SortableContainer = Sortable.DragNDropContainer
var SortableItem = Sortable.DragNDropItem
```

如果你不使用 Module Bundler， 可以直接加载 UMD 格式的文件，同时需要加载样式文件。

```html
<link href="react-xxx-hoc/dist/umd/bundle.css" />
<script src="react-xxx-hoc/dist/umd/react-xxx-hoc.js"></script>
```
如果你想使用压缩过的 JS 文件,(使用 UglifyJs 压缩，没有 sourceMap),那么可以引用：
```html
<script src="react-xxx-hoc/dist/umd/react-xxx-hoc.min.js"></script>
```

```javascript

```
## 使用

### Basic Example

### Advanced Example


## PropTypes

**DragNDropItem**


 属性 | 类型 | 描述
 --- | --- | ---
 index | number | ---
 item | object | ---
 preview | React Element | ---


**DragNDropContainer**


 属性 | 类型 | 描述
 --- | --- | ---
 items | Array | ---
 onReorderItem | Function | ---
 onDragStart | Function | ---
 onDragMove | Function | ---

## 运行本地实例

```bash
npm install
npm run storybook
```
然后打开 http://localhost:9001 可以查看所有例子

##  npm 命令

```bash
npm run build
```

会生成三种格式的 js 文件（es6 Module, commonjs, UMD）在不同的三个文件夹下，满足不同的需求。

...
