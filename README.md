[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/blackboard/react-dnd-ax/blob/master/LICENSE)


# React DnD AX

## Motivation

There are many great React Drag and Drop components available on Github. Such as the first search result you will get on google: [React Dnd](https://github.com/react-dnd/react-dnd). However, to fulfill the requirements of developing a website that requires full accessibility, web and mobile supports, we still need to write our own components. Therefore, we are sharing this HOC, which provides full accessibility support, can work on mobile and desktop applications, and easy to be integrated with your existing react components.

## DEMO

https://artecher.github.io/react-dnd-ax-demo/

As storybook doesn't support mobile view, please visit this site on desktop or create your own project with sources code in this repo locally. We are planning to replace storybook in the future.

## Features

* Shipped as High Order Components (HOC) － Which means no pain to be integrated with your existing components
* freedom on customization － Styles of the list can be fully customized
* Perfect support for Mobile and Desktop
* Accessibility support－  **User is able to work with it purely on keyboard**
* Easy and simply examples to help you adopt

## Installation

```bash
npm install react-dnd-ax --save
```
Use a module bundler that supports either ES2016 or CommonJS (webpack, Rollup):
```javascript
//  Compile ES6 with Babel
import { DragNDropContainer, DragNDropItem } from 'react-dnd-ax'

// Without ES6 compiler
var Sortable = require('react-dnd-ax')
var SortableContainer = Sortable.DragNDropContainer
var SortableItem = Sortable.DragNDropItem
```

If you don't like Module Bundler, you can simply load UMD and style file

```html
<link href="react-dnd-ax/dist/umd/bundle.css" />
<script src="react-dnd-ax/dist/umd/react-dnd-ax.js"></script>
```
If you want to use compressed JS file (compressed by UglifyJs，no sourceMap):;
```html
<script src="react-dnd-ax/dist/umd/react-dnd-ax.min.js"></script>
```

## Usage

### IMPORTANT！Need to import react-dnd-ax.css into your html page

### run examples locally

```bash
npm install
npm run storybook
```
then go to http://localhost:9001 in your browser to see examples

#### Optionally, run examples in Docker

```bash
docker-compose up
```

#### Stop docker examples and clean up

```bash
^C
docker-compose down
```

### Basic Example
```jsx
import React from 'react'
import {Icon} from 'react-fa'

import {DragNDropContainer, DragNDropItem} from '../../react-dnd-ax'
import {basicItems} from '../data'

import '../styles/common.scss'
import './basic-example.scss'

class BasicExample extends React.Component {
  state = {
    items: basicItems,
  }

  onReorderLinks = (newItems) => {
    this.setState({
      items: [...newItems]
    })
  }

  render() {
    const BasicItem = DragNDropItem(({item, itemRef, dragPointRef}) => {
      return (
        <div
          className="item-row"
          ref={itemRef} // mandatory: put this attribute to the container element of the movable item
        >
            <span className="text">{item.text}</span>
            <button
              ref={dragPointRef} // mandatory: put this attribute to the drag handler
              className="drag-point"
              draggable // mandatory HTML attribute for drag handler
              tabIndex="0" // mandatory HTML attribute, make it possible to focus on the drag handler
              title="Drag this link to reorder the item" // AX title
            >
              <Icon name="arrows"/>
            </button>
        </div>
      )
    })

    const BasicList = DragNDropContainer((props) => {
      return (
        <div id="modules-section">
          {
            props.items.map((item, index) => {
              return <BasicItem
                item={item}
                index={index} // mandatory: give index to the DragNDropItem HOC
                key={item.id}
                preview={<div>{item.text}</div>} // customize your preview
                {...props} // mandatory: need to pass down the props
              />
            })
          }
        </div>
      )
    })

    return (
      <div id="basic-container" className="container">
        <BasicList
          items={this.state.items}
          boundingElementId="container"
          onReorderItem={this.onReorderLinks}
          scrollContainerId="basic-container"
        />
      </div>
    )
  }
}

export default BasicExample

```
### Complex Example (integration with existing components)
```jsx
import React from 'react'

import { DragNDropContainer, DragNDropItem } from '../../react-dnd-ax'
import { countries } from '../data'
import Country from './Country'

import '../styles/common.scss'
import './ComplexExample.scss'

class ComplexExample extends React.Component {
  state = {
    countries: countries,
  }

  onReorderCountries = (newOrderCountries) => {
    this.setState({
      countries: [...newOrderCountries]
    })
  }

  render() {
    const ModuleItem = DragNDropItem(Country) // Country is your existing component

    const CountryList = DragNDropContainer((props) => {
      return (
        <div>
          {
            props.items.map((country, index) => {
              return <ModuleItem
                country={country}
                index={index} // mandatory: give index to the DragNDropItem HOC
                key={country.name}
                preview={<span>{country.name}</span>} // customize your preview
                {...props} // mandatory: need to pass down the props
              />
            })
          }
        </div>
      )
    })

    return (
      <div id="complex-container" className="container">
        <CountryList
          items={this.state.countries}
          onReorderItem={this.onReorderCountries}
          scrollContainerId="complex-container"
        />
      </div>
    )
  }
}

export default ComplexExample

```

## PropTypes

**DragNDropItem**


 Prop | Type | Description
 --- | --- | ---
 index | number | the index value of a single item
 preview | React Element | the preview html element when dragging the movable item


**DragNDropContainer**


 Prop | Type | Description
 --- | --- | ---
 items | Array | the array consists of movable items
 onReorderItem(reorderedItems, sourceDragItem) | Function | the callback function triggered by dropping a movable item
 scrollContainerId | String | the container id of the drag and drop component (usage refer to examples）
 boundingElementId | String | Id of anchor element for positioning drag and drop preview item if an ancestor element's styling prevents fixed position (optional)



# 中文文档

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
npm install react-dnd-ax --save
```
使用一个支持 ES2015模块 或者 CommonJs 的工具（webpack, Rollup）来引用：

```javascript
//  使用 Babel 来编译 ES6
import { DragNDropContainer, DragNDropItem } from 'react-dnd-ax'

// 不使用 ES6 编译器
var Sortable = require('react-dnd-ax')
var SortableContainer = Sortable.DragNDropContainer
var SortableItem = Sortable.DragNDropItem
```

如果你不使用 Module Bundler， 可以直接加载 UMD 格式的文件，同时需要加载样式文件。

```html
<link href="react-dnd-ax/dist/umd/bundle.css" />
<script src="react-dnd-ax/dist/umd/react-dnd-ax.js"></script>
```
如果你想使用压缩过的 JS 文件,(使用 UglifyJs 压缩，没有 sourceMap),那么可以引用：
```html
<script src="react-dnd-ax/dist/umd/react-dnd-ax.min.js"></script>
```

## 使用

### 切记！将安装包里面的 react-dnd-ax.css 引入项目的html页面

### 本地运行例子

```bash
npm install
npm run storybook
```
then go to http://localhost:9001 in your browser to see examples

#### 如果你安装了Docker，你也可以在Docker中运行例子

```bash
docker-compose up
```

#### 停止Docker，并做清理

```bash
^C
docker-compose down
```


### 简单示例
```jsx
import React from 'react'
import {Icon} from 'react-fa'

import {DragNDropContainer, DragNDropItem} from '../../react-dnd-ax'
import {basicItems} from '../data'

import '../styles/common.scss'
import './basic-example.scss'

class BasicExample extends React.Component {
  state = {
    items: basicItems,
  }

  onReorderLinks = (newItems) => {
    this.setState({
      items: [...newItems]
    })
  }

  render() {
    const BasicItem = DragNDropItem(({item, itemRef, dragPointRef}) => {
      return (
        <div
          className="item-row"
          ref={itemRef} // mandatory: put this attribute to the container element of the movable item
        >
            <span className="text">{item.text}</span>
            <button
              ref={dragPointRef} // mandatory: put this attribute to the drag handler
              className="drag-point"
              draggable // mandatory HTML attribute for drag handler
              tabIndex="0" // mandatory HTML attribute, make it possible to focus on the drag handler
              title="Drag this link to reorder the item" // AX title
            >
              <Icon name="arrows"/>
            </button>
        </div>
      )
    })

    const BasicList = DragNDropContainer((props) => {
      return (
        <div id="modules-section">
          {
            props.items.map((item, index) => {
              return <BasicItem
                item={item}
                index={index} // mandatory: give index to the DragNDropItem HOC
                key={item.id}
                preview={<div>{item.text}</div>} // customize your preview
                {...props} // mandatory: need to pass down the props
              />
            })
          }
        </div>
      )
    })

    return (
      <div id="basic-container" className="container">
        <BasicList
          items={this.state.items}
          boundingElementId="container"
          onReorderItem={this.onReorderLinks}
          scrollContainerId="basic-container"
        />
      </div>
    )
  }
}

export default BasicExample

```
### 复杂示例 （和已有component集成）
```jsx
import React from 'react'

import { DragNDropContainer, DragNDropItem } from '../../react-dnd-ax'
import { countries } from '../data'
import Country from './Country'

import '../styles/common.scss'
import './ComplexExample.scss'

class ComplexExample extends React.Component {
  state = {
    countries: countries,
  }

  onReorderCountries = (newOrderCountries) => {
    this.setState({
      countries: [...newOrderCountries]
    })
  }

  render() {
    const ModuleItem = DragNDropItem(Country) // Country is your existing component

    const CountryList = DragNDropContainer((props) => {
      return (
        <div>
          {
            props.items.map((country, index) => {
              return <ModuleItem
                country={country}
                index={index} // mandatory: give index to the DragNDropItem HOC
                key={country.name}
                preview={<span>{country.name}</span>} // customize your preview
                {...props} // mandatory: need to pass down the props
              />
            })
          }
        </div>
      )
    })

    return (
      <div id="complex-container" className="container">
        <CountryList
          items={this.state.countries}
          onReorderItem={this.onReorderCountries}
          scrollContainerId="complex-container"
        />
      </div>
    )
  }
}

export default ComplexExample

```

## PropTypes

**DragNDropItem**


 属性 | 类型 | 描述
 --- | --- | ---
 index | number | 当前可移动条目的索引值
 preview | React Element | 移动条目是的预览html元素


**DragNDropContainer**


 属性 | 类型 | 描述
 --- | --- | ---
 items | Array | 由可移动的条目组成的数组
 onReorderItem(reorderedItems, sourceDragItem) | Function | 当条目被移动时被触发的回掉函数
 scrollContainerId | String | drag and drop component的container的id （具体用法见示例）
