import React from 'react'
import {Icon} from 'react-fa'

import {DragNDropContainer, DragNDropItem} from '../react-dnd-ax'
import {basicItems} from './data'

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
            {item.text}
            <button
              ref={dragPointRef}
              className="module-table__button drag-point"
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
        <div className="module-table__body" id="modules-section">
          {
            props.items.map((item, index) => {
              return <BasicItem
                item={item}
                index={index}
                key={item.id}
                module={item}
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
      <div className="container">
        <BasicList
          items={this.state.items}
          onReorderItem={this.onReorderLinks}
        />
      </div>
    )
  }
}

export default BasicExample
