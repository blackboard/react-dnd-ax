import React from 'react'
import PropTypes from 'prop-types'

import KeyCode from './consts'
import { moveItem } from './utils'
import { getDisplayName } from './utils'

const SCROLL_RANGE = 150
const SCROLL_ACC_PX = 10

/* eslint-disable no-restricted-globals */

const DragNDropContainer = (WrappedComponent) => {
  class Wrapper extends React.Component {
    state = {
      isDragging: false,
      sourceIndex: -1,
      lastOverIndex: -1, // as drag over does not happen sequentially, we need to store last over index and render it when new element is being dragged over
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

      this.clientY = 0
    }

    componentDidMount() {
      // to retrieve clientY in FF
      // https://stackoverflow.com/questions/887316/how-do-i-get-clientx-and-clienty-to-work-inside-my-drag-event-handler-on-firef
      window.addEventListener('dragover', this.setClientY)

      window.addEventListener('click', this.leaveKeyboardMoving)

      setTimeout(() => {
        this.scrollContainer = document.getElementById(this.props.scrollContainerId)
      }, 0)
    }

    componentWillUnmount() {
      window.removeEventListener('dragover', this.setClientY)
      window.removeEventListener('click', this.leaveKeyboardMoving)
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

    setClientY = (e) => {
      this.clientY = e.clientY
    }

    leaveKeyboardMoving = () => {
      if (this.state.isKeyboardMoving) {
        this.setState({
          isDragging: false,
          isKeyboardMoving: false,
          sourceIndex: -1,
          keyInsertIndex: -1,
        })
      }
    }

    onDrag = (e, dragPreviewRef) => {
      // position move is out of control of react render, so we use id instead of ref
      // dragPreviewRef.style.top = `${this.clientY}px` // eslint-disable-line no-param-reassign
       dragPreviewRef.style.top =
         `${this.clientY - document.querySelector('.assessment-canvas-react').getBoundingClientRect().top}px` // eslint-disable-line

      // increase scroll area
      if (this.clientY < SCROLL_RANGE) {
        if (this.scrollContainer) {
          this.scrollContainer.scrollTop -= SCROLL_ACC_PX
        } else {
          scrollBy(0, 0 - SCROLL_ACC_PX)
        }
      } else if (innerHeight - this.clientY < SCROLL_RANGE) {
        if (this.scrollContainer) {
          this.scrollContainer.scrollTop += SCROLL_ACC_PX
        } else {
          scrollBy(0, SCROLL_ACC_PX)
        }
      }
    }

    onDragStart = (e, index) => {
      /**
       * Updating state causes the dnd item to re-render thus manipulating the DOM. In some cases
       * this causes dragend event to fire immediately. To prevent this wrap in a timeout.
       *
       * See https://stackoverflow.com/questions/19639969/html5-dragend-event-firing-immediately
       */
      setTimeout(() => {
          this.setState({
              isDragging: true,
              isKeyboardMoving: false,
              sourceIndex: index,
              overIndex: -1,
          })
      });
    }

    onDragEnd = (e) => {
      if (this.containerRef) {
        e.preventDefault()
        this.setState({
          isDragging: false,
          isKeyboardMoving: false,
          sourceIndex: -1,
          overIndex: -1,
        })
      }
    }

    onDrop = (e, targetIndex) => {
      const {items} = this.props
      e.preventDefault()
      const newOrderItems = moveItem(items, targetIndex, this.state.sourceIndex)
      const sourceDragItem = items[this.state.sourceIndex]
      this.props.onReorderItem(newOrderItems, sourceDragItem)
    }

    onDragOver = (e, index) => {
      e.preventDefault()
      this.setState({
        lastOverIndex: index,
        overIndex: index,
      })
    }

    onDragLeave = (e, index) => {
      e.preventDefault()
      this.setState({
        lastOverIndex: index,
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
      if (touchPoint.clientY < SCROLL_RANGE) {
        if (this.scrollContainer) {
          this.scrollContainer.scrollTop -= SCROLL_ACC_PX
        } else {
          scrollBy(0, 0 - SCROLL_ACC_PX)
        }
      } else if (innerHeight - touchPoint.clientY < SCROLL_RANGE) {
        if (this.scrollContainer) {
          this.scrollContainer.scrollTop += SCROLL_ACC_PX
        } else {
          scrollBy(0, SCROLL_ACC_PX)
        }
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
        isDragging: false,
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
            const newOrderItems = moveItem(items, this.state.keyInsertIndex, this.state.sourceIndex)
            const sourceDragItem = items[this.state.sourceIndex]
            this.props.onReorderItem(newOrderItems, sourceDragItem)
            this.setState({
              isKeyboardMoving: false,
              sourceIndex: -1,
              keyInsertIndex: -1,
              curPreview: '',
            })
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
        <div ref={(ref) => {
          this.containerRef = ref
        }}>
          <div className="dnd-drag-placeholder" />
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
    scrollContainerId: PropTypes.string,
  }

  Wrapper.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;

  return Wrapper
}

export default DragNDropContainer
