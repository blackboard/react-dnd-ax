import React from 'react'
import PropTypes from 'prop-types'

import KeyCode from './consts'
import { moveItem } from './utils'
import { getDisplayName } from './utils'

const SCROLL_RANGE = 150
const SCROLL_ACC_PX = 5

/* eslint-disable no-restricted-globals */

const DragNDropContainer = (WrappedComponent) => {
  class Wrapper extends React.Component {
    state = {
      isDragging: false,
      sourceIndex: -1,
      overIndex: -1,
      isKeyboardMoving: false,
      curPreview: '',
      keyInsertIndex: -1,
    }

    constructor(props) {
      super(props)

      this.actions = {
        onDrag: this.onDrag,
        onDragStart: this.onDragStart,
        onDragEnd: this.onDragEnd,
        leaveKeyboardMoving: this.leaveKeyboardMoving,
        onDrop: this.onDrop,
        onDragOver: this.onDragOver,
        onDragLeave: this.onDragLeave,
        onTouchMove: this.onTouchMove,
        onTouchDrop: this.onTouchDrop,
        onClickDrag: this.onClickDrag,
        onKeyChangeOrder: this.onKeyChangeOrder,
      }

      if (!document.getElementById('dnd-drag-placeholder')) {
        const transparentElem = document.createElement('div')
        transparentElem.id = 'dnd-drag-placeholder'
        document.body.appendChild(transparentElem)
      }
    }

    componentDidMount() {
      window.addEventListener('click', this.leaveKeyboardMoving)
      this.baseStateContainer = document.getElementById('main-content-inner')
      setTimeout(() => { // after angular digest for peek panel finished, 'side-panel-content' is available
        this.peekStateContainer = document.getElementsByClassName('side-panel-content')[0]
      }, 0)
    }

    componentWillUnmount() {
      window.removeEventListener('click', this.leaveKeyboardMoving)

      const transparentElem = document.getElementById('dnd-drag-placeholder')
      if (transparentElem) {
        document.body.removeChild(transparentElem)
      }
    }

    // we don't have to render the component for every onDragOver callback
    shouldComponentUpdate(nextProps, nextState) {
      if (nextState.isDragging !== this.state.isDragging) { // deal with dragOver delay
        return true
      }
      if (nextState.overIndex === this.state.overIndex && this.state.isDragging) {
        return false
      }
      return true
    }

    leaveKeyboardMoving = () => {
      if (this.state.isKeyboardMoving) {
        this.setState({
          isKeyboardMoving: false,
          sourceIndex: -1,
          keyInsertIndex: -1,
        })
      }
    }

    onDrag = (e, dragPreviewRef) => {
      e.preventDefault()
      // position move is out of control of react render, so we use id instead of ref
      dragPreviewRef.style.top = `${e.clientY}px` // eslint-disable-line no-param-reassign

      const {ultraStateType} = this.props

      // increase scroll area
      if (e.clientY < SCROLL_RANGE) {
        if (ultraStateType === 'base' && this.baseStateContainer) {
          this.baseStateContainer.scrollTop -= SCROLL_ACC_PX
          return
        } else if (ultraStateType === 'peek' && this.peekStateContainer) {
          this.peekStateContainer.scrollTop -= SCROLL_ACC_PX
          return
        }
        scrollBy(0, 0 - SCROLL_ACC_PX)
      } else if (innerHeight - e.clientY < SCROLL_RANGE) {
        if (ultraStateType === 'base' && this.baseStateContainer) {
          this.baseStateContainer.scrollTop += SCROLL_ACC_PX
          return
        } else if (ultraStateType === 'peek' && this.peekStateContainer) {
          this.peekStateContainer.scrollTop += SCROLL_ACC_PX
          return
        }
        scrollBy(0, SCROLL_ACC_PX)
      }
    }

    onDragStart = (e, index) => {
      this.setState({
        isDragging: true,
        sourceIndex: index,
        overIndex: -1,
      })
    }

    onDragEnd = (e) => {
      if (this.containerRef) {
        e.preventDefault()
        this.setState({
          isDragging: false,
          sourceIndex: -1,
          overIndex: -1,
        })
      }
    }

    onDrop = (e, targetIndex) => {
      const {items} = this.props
      e.preventDefault()
      const newOrderModules = moveItem(items, items[this.state.sourceIndex], targetIndex)
      this.props.onReorderItem(newOrderModules)
    }

    onDragOver = (e, index) => {
      e.preventDefault()
      this.setState({
        overIndex: index,
      })
    }

    onDragLeave = (e) => {
      e.preventDefault()
      this.setState({
        overIndex: -1,
      })
    }

    onTouchMove = (e, dragPreviewRef) => {
      const touchPoint = e.touches[0]
      const dropZone = document.elementFromPoint(touchPoint.clientX, touchPoint.clientY)
      const position = dropZone.dataset.position

      if (position) {
        this.setState({
          overIndex: parseInt(position, 10),
        })
      } else {
        this.onDragLeave(e)
      }

      // position move is out of control of react render, so we use id instead of ref
      dragPreviewRef.style.top = `${touchPoint.clientY}px` // eslint-disable-line no-param-reassign

      // increase scroll area
      const {ultraStateType} = this.props

      // increase scroll area
      if (touchPoint.clientY < SCROLL_RANGE) {
        if (ultraStateType === 'base' && this.baseStateContainer) {
          this.baseStateContainer.scrollTop -= SCROLL_ACC_PX
          return
        } else if (ultraStateType === 'peek' && this.peekStateContainer) {
          this.peekStateContainer.scrollTop -= SCROLL_ACC_PX
          return
        }
        scrollBy(0, 0 - SCROLL_ACC_PX)
      } else if (innerHeight - touchPoint.clientY < SCROLL_RANGE) {
        if (ultraStateType === 'base' && this.baseStateContainer) {
          this.baseStateContainer.scrollTop += SCROLL_ACC_PX
          return
        } else if (ultraStateType === 'peek' && this.peekStateContainer) {
          this.peekStateContainer.scrollTop += SCROLL_ACC_PX
          return
        }
        scrollBy(0, SCROLL_ACC_PX)
      }
    }

    onTouchDrop = (e) => {
      const touchPoint = e.changedTouches[0]
      const dropZone = document.elementFromPoint(touchPoint.clientX, touchPoint.clientY)
      const position = dropZone.dataset.position
      if (position) {
        this.onDrop(e, parseInt(position, 10), 0)
        this.onDragEnd(e)
      } else {
        this.onDragEnd(e)
      }
    }

    onClickDrag = (e, index, preview) => {
      e.stopPropagation() // as binded a event on window to reset isKeyboardMoving state, need to stop propagation here to avoid mis-triggering it
      this.setState({
        isKeyboardMoving: true,
        sourceIndex: index,
        keyInsertIndex: index + 1,
        curPreview: preview,
      })
    }

    onKeyChangeOrder = (e) => {
      const {items} = this.props
      if (this.state.isKeyboardMoving) {
        e.preventDefault()
        e.stopPropagation()
        switch (e.keyCode) {
          case KeyCode.ESC: {
            this.leaveKeyboardMoving()
            break
          }
          case KeyCode.ENTER: {
            const newOrderModules = moveItem(items, items[this.state.sourceIndex], this.state.keyInsertIndex)
            this.props.onReorderItem(newOrderModules)
            break
          }
          case KeyCode.ARROW_UP: {
            // skip displaying of item which is above the source cause its insert place holder should never be displayed
            if (this.state.keyInsertIndex - 1 === this.state.sourceIndex) {
              if (this.state.keyInsertIndex - 2 >= 0) {
                this.setState({keyInsertIndex: this.state.keyInsertIndex - 2})
              }
            } else if (this.state.keyInsertIndex - 1 >= 0) {
              this.setState({keyInsertIndex: this.state.keyInsertIndex - 1})
            }
            break
          }
          case KeyCode.ARROW_DOWN: {
            // skip displaying of item which is above the source cause its insert place holder should never be displayed
            if (this.state.keyInsertIndex + 1 === this.state.sourceIndex) {
              if (this.state.keyInsertIndex + 2 <= items.length) {
                this.setState({keyInsertIndex: this.state.keyInsertIndex + 2})
              }
            } else if (this.state.keyInsertIndex + 1 <= items.length) {
              this.setState({keyInsertIndex: this.state.keyInsertIndex + 1})
            }
            break
          }
          default:
            break
        }
      }
    }

    render() {
      return (
        <div id="react-dnd-ax" ref={(ref) => {
          this.containerRef = ref
        }}>
          <WrappedComponent
            {...this.props}
            state={this.state}
            actions={this.actions}
          />
        </div>
      )
    }

  }

  Wrapper.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onReorderItem: PropTypes.func.isRequired,
    ultraStateType: PropTypes.string,
  }

  Wrapper.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;

  return Wrapper
}

export default DragNDropContainer
