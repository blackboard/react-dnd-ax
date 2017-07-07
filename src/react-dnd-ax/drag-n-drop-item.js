import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'
import { omit, getDisplayName } from './utils'

import './react-dnd-ax.css'

const DragNDropItem = (WrappedComponent) => {
  class Wrapper extends React.Component {
    componentDidMount() {
      const {index, actions, preview} = this.props

      if (this.dragPointElem) {
        this.dragPointElem.addEventListener('touchstart', (e) => {
          e.preventDefault()
          actions.onDragStart(e, index)
        })
        this.dragPointElem.addEventListener('touchend', actions.onTouchDrop)
        this.dragPointElem.addEventListener('drag', (e) => {
          actions.onDrag(e, this.dragPreviewRef)
        })
        this.dragPointElem.addEventListener('dragstart', (e) => {
          // hide the default drag preview image
          // IE and Edge do not have this method
          e.dataTransfer.setDragImage ? // eslint-disable-line no-unused-expressions
            e.dataTransfer.setDragImage(document.getElementById('dnd-drag-placeholder'), 0, 0)
            :
            ''
          e.dataTransfer.setData('text', '') // make dnd work in FF, IE and Edge
          actions.onDragStart(e, index)
        })
        this.dragPointElem.addEventListener('dragend', actions.onDragEnd)
        this.dragPointElem.addEventListener('touchDrop', actions.onTouchDrop)
        this.dragPointElem.addEventListener('touchmove', (e) => {
          actions.onTouchMove(e, this.dragPreviewRef)
        })
        this.dragPointElem.addEventListener('click', (e) => {
          e.stopPropagation()
          actions.onClickDrag(e, index, preview)
        })
        this.itemRef.addEventListener('keydown', actions.onKeyChangeOrder)
      }
    }

    // only render necessary components
    shouldComponentUpdate(nextProps) {
      const {state, index} = this.props

      // need to render all when toggling drag status
      if (nextProps.state.isDragging !== state.isDragging) {
        return true
      }

      if (nextProps.state.isKeyboardMoving !== state.isKeyboardMoving) {
        return true
      }

      if (state.isDragging) {
        // only render component around hot zone
        if (nextProps.state.sourceIndex === index ||
            state.sourceIndex === index ||
            nextProps.state.lastOverIndex === index || // as drag over does not happen sequentially, we need to render the last over element
            (index >= (nextProps.state.overIndex - 2) && index <= (nextProps.state.overIndex + 2))) {
          return true
        }

        // when hovering on dragging element
        if (nextProps.state.overIndex === -1 && nextProps.state.overIndex !== state.overIndex) {
          if (index >= state.sourceIndex - 2 && index <= state.sourceIndex + 1) {
            return true
          }
        }
      }

      // only render source and destination item
      if (state.isKeyboardMoving) {
        if ((index + 1) === state.keyInsertIndex || (index + 1) === nextProps.state.keyInsertIndex || index === 0) { // improve: should not always render index === 0
          return true
        }
      }

      return false
    }

    componentDidUpdate() {
      if (this.firstKeyInsertPlaceHolderRef && this.firstKeyInsertPlaceHolderRef.className.includes('show')) {
        this.firstKeyInsertPlaceHolderRef.focus()
      } else if (this.downKeyInsertPlaceHolderRef.className.includes('show')) {
        this.downKeyInsertPlaceHolderRef.focus()
      } else if (this.itemRef.className.includes('is-keyboard-moving') && this.itemRef.className.includes('should-on-focus')) {
        this.itemRef.focus()
      }
      if (this.dragPreviewRef.className.includes('show')) {
        this.dragPreviewRef.style.width = getComputedStyle(this.itemRef).getPropertyValue('width')
      }
    }

    render() {
      const {state, index, actions, preview} = this.props
      const itemSectionClass = ClassNames({
        'module-section': true,
        'is-dragging': state.isDragging && state.sourceIndex === index,
        'is-keyboard-moving': state.isKeyboardMoving && index === state.sourceIndex,
        'should-on-focus': state.isKeyboardMoving && (index === state.keyInsertIndex || (index + 1) === state.keyInsertIndex),
      })
      const dropUpHalfClass = ClassNames({
        'drop-up-half': true,
        show: state.isDragging && index !== state.sourceIndex && index !== (state.sourceIndex + 1),
      })
      const dropDownHalfClass = ClassNames({
        'drop-down-half': true,
        show: state.isDragging && index !== state.sourceIndex && index !== (state.sourceIndex - 1),
      })
      const firstKeyInsertPlaceHolderClass = ClassNames({
        'key-insert-placeholder': true,
        show: state.isKeyboardMoving && state.keyInsertIndex === 0 && state.sourceIndex !== 0,
      })
      const firstInsertPlaceHolderClass = ClassNames({
        'insert-placeholder first-insert-placeholder': true,
        show: state.isDragging && state.overIndex === 0,
      })
      const insertPlaceholderClass = ClassNames({
        'insert-placeholder': true,
        show: state.isDragging && index === state.overIndex - 1,
      })
      const dragPreviewItemClass = ClassNames({
        'drag-preview-item': true,
        show: state.isDragging && index === state.sourceIndex,
      })
      const downKeyInsertPlaceHolderRef = ClassNames({
        'key-insert-placeholder': true,
        show: state.isKeyboardMoving &&
        (index + 1) === state.keyInsertIndex &&
        index !== state.sourceIndex,
      })

      return (
        <div className={itemSectionClass} ref={(ref) => {
          this.itemRef = ref
        }} tabIndex="-1">
          {index === 0 ? <div className={firstInsertPlaceHolderClass}/> : ''}
          {index === 0 ?
            <div
              tabIndex="-1"
              className={firstKeyInsertPlaceHolderClass}
              onKeyDown={actions.onKeyChangeOrder}
              ref={(ref) => {
                this.firstKeyInsertPlaceHolderRef = ref
              }}
            >
              {state.curPreview}
            </div>
            :
            ''
          }
          <div className="item-container">
            <WrappedComponent
              {...omit(
                this.props,
                'state',
                'key',
                'actions',
                'onReorderItem'
              )}
              onKeyChangeOrder={actions.onKeyChangeOrder}
              dragPointRef={(el) => {
                this.dragPointElem = el
              }}
            />
          </div>
          <div
            className={dropUpHalfClass}
            data-position={index}
            onDrop={(e) => {
              actions.onDrop(e, index)
            }}
            onDragOver={(e) => {
              actions.onDragOver(e, index)
            }}
            onDragLeave={(e) => {
              actions.onDragLeave(e, index)
            }}
          />
          <div
            className={dropDownHalfClass}
            data-position={index + 1}
            onDrop={(e) => {
              actions.onDrop(e, index + 1)
            }}
            onDragOver={(e) => {
              actions.onDragOver(e, index + 1)
            }}
            onDragLeave={(e) => {
              actions.onDragLeave(e, index)
            }}
          />
          <div className={insertPlaceholderClass}/>
          <div
            className={dragPreviewItemClass}
            ref={(ref) => {
              this.dragPreviewRef = ref
            }}
          >
            {preview}
          </div>
          <div
            tabIndex="-1"
            className={downKeyInsertPlaceHolderRef}
            onKeyDown={actions.onKeyChangeOrder}
            ref={(ref) => {
              this.downKeyInsertPlaceHolderRef = ref
            }}
          >
            {state.curPreview}
          </div>
        </div>
      )
    }
  }

  Wrapper.propTypes = {
    index: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    preview: PropTypes.element.isRequired,
  }

  Wrapper.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;

  return Wrapper
}

export default DragNDropItem
