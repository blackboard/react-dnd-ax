import React from 'react'

import { shallow, mount } from 'enzyme'
import { Icon } from 'react-fa'

import DragNDropItem from '../drag-n-drop-item'

describe('Dnd items', () => {

  const WrappedCompoent = ({item, itemRef, dragPointRef}) => {
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
  }

  const Item = DragNDropItem(WrappedCompoent)

  let wrapper,
    actions

  beforeEach(() => {
    const item = {
      id: 1,
      text: 'row 1'
    }

    actions = {
      onDrag: jest.fn(),
      onDragStart: jest.fn(),
      onDragEnd: jest.fn(),
      leaveKeyboardMoving: jest.fn(),
      onDrop: jest.fn(),
      onDragOver: jest.fn(),
      onDragLeave: jest.fn(),
      onTouchMove: jest.fn(),
      onTouchDrop: jest.fn(),
      onClickDrag: jest.fn(),
      onKeyChangeOrder: jest.fn(),
    }

    wrapper = mount(<Item
      item={item.text}
      index={1}
      key={item.id}
      preview={<div>{item.text}</div>}
      actions={actions}
      state={{}}
    />)
  })

  it('should render correct template', () => {
    // expect(wrapper).toMatchSnapshot()
  })

  it('should call the onClickDrag function when clicking the drag point button', () => {
    wrapper.find('.drag-point').node.click()
    // wrapper.find('.drag-point').node.dispatchEvent(new DragEvent('dragstart'))
    expect(actions.onClickDrag).toHaveBeenCalled()
    // expect(actions.onDragStart).toHaveBeenCalled()
  })
})
