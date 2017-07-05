import React from 'react'
import {Icon} from 'react-fa'

// import {DragNDropContainer, DragNDropItem} from 'test-npm-upload/dist'
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
    const BasicItem = DragNDropItem(({item, itemRef, dragPointRef}) => { // improve: should not add itemRef and
      // dragPointRef here
      return (
        <div
          className="item-row"
          ref={itemRef}
        >
            <span className="text">{item.text}</span>
            <button
              ref={dragPointRef}
              className="drag-point"
              draggable
              tabIndex="0"
              title="Drag this link to reorder the item"
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
                index={index}
                key={item.id}
                preview={
                  <div>
                    {item.text}
                  </div>
                }
                {...props}
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
          onReorderItem={this.onReorderLinks}
          scrollContainerId="basic-container"
        />
      </div>
    )
  }
}

export default BasicExample
