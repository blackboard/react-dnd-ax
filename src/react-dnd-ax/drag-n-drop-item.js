import React from 'react'
import PropTypes from 'prop-types'
import ClassNames from 'classnames'
import debounce from 'lodash.debounce';
import { omit, getDisplayName } from './utils'

import './react-dnd-ax.css'

const RESIZE_DELAY = 300

const DragNDropItem = (WrappedComponent) => {
  class Wrapper extends React.Component {
    previewWidth = null;

    resetPreviewWidth = debounce(() => {
        this.previewWidth = null;
    }, RESIZE_DELAY)

    havePropsChanged = (nextProps) => {
      const propagatableProps = {...omit(
        nextProps,
        'state',
        'key',
        'actions',
        'onReorderItem',
        'index'
      )}

      for (let key of Object.keys(propagatableProps)) {
        if (propagatableProps[key] !== this.props[key]){
          return true
        }
      }

      return false
    }

    componentDidMount() {
      const {actions} = this.props

      window.addEventListener("resize", this.resetPreviewWidth)

      if (this.dragPointElem) {
        this.dragPointElem.addEventListener('touchstart', this.onTouchStart)
        this.dragPointElem.addEventListener('touchend', actions.onTouchDrop)
        this.dragPointElem.addEventListener('drag', this.onDrag)
        this.dragPointElem.addEventListener('dragstart', this.onSetImageDragStart)
        this.dragPointElem.addEventListener('dragend', actions.onDragEnd)
        this.dragPointElem.addEventListener('touchmove', this.onTouchMove)
        this.dragPointElem.addEventListener('click', this.onClick)
        this.dragPointElem.addEventListener('keyup', this.onEnter)
        this.itemRef.addEventListener('keydown', actions.onKeyChangeOrder)
      }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resetPreviewWidth)
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
        return (nextProps.state.sourceIndex === index ||
            state.sourceIndex === index ||
            nextProps.state.lastOverIndex === index ||  // as drag over does not happen sequentially, we need to render the last over element
            nextProps.state.overIndex === -1 ||         // when hovering on dragging element
            nextProps.state.overIndex !== state.overIndex
          )
      }

      // only render source and destination item
      if (state.isKeyboardMoving) {
        if ((index + 1) === state.keyInsertIndex || (index + 1) === nextProps.state.keyInsertIndex || index === 0) { // improve: should not always render index === 0
          return true
        }
      }

      return this.havePropsChanged(nextProps)
    }

    componentDidUpdate() {
      if (this.dragPointElem) {
        // we need to update index and preview value as we don't recreate dnd-item every time
        this.dragPointElem.removeEventListener('touchstart', this.onTouchStart)
        this.dragPointElem.addEventListener('touchstart', this.onTouchStart)
        this.dragPointElem.removeEventListener('dragstart', this.onSetImageDragStart)
        this.dragPointElem.addEventListener('dragstart', this.onSetImageDragStart)
        this.dragPointElem.removeEventListener('click', this.onClick)
        this.dragPointElem.addEventListener('click', this.onClick)
        this.dragPointElem.removeEventListener('keyup', this.onEnter)
        this.dragPointElem.addEventListener('keyup', this.onEnter)
        this.dragPointElem.removeEventListener('drag', this.onDrag)
        this.dragPointElem.addEventListener('drag', this.onDrag)
        this.dragPointElem.removeEventListener('touchmove', this.onTouchMove)
        this.dragPointElem.addEventListener('touchmove', this.onTouchMove)
      }

      if (this.firstKeyInsertPlaceHolderRef && this.firstKeyInsertPlaceHolderRef.className.includes('show')) {
        this.firstKeyInsertPlaceHolderRef.focus()
      } else if (this.downKeyInsertPlaceHolderRef.className.includes('show')) {
        this.downKeyInsertPlaceHolderRef.focus()
      } else if (this.itemRef.className.includes('is-keyboard-moving') && this.itemRef.className.includes('should-on-focus')) {
        this.itemRef.focus()
      }

      if (this.previewWidth == null) {
          this.previewWidth = getComputedStyle(this.itemRef).getPropertyValue('width')
      }

      if (this.dragPreviewRef && this.dragPreviewRef.style && this.dragPreviewRef.className && this.dragPreviewRef.className.includes('show')) {
        this.dragPreviewRef.style.width = this.previewWidth
      }
    }

    onSetImageDragStart = (e) => {
      const { index, actions } = this.props
      // hide the default drag preview image
      // IE and Edge do not have this method
      e.dataTransfer.setDragImage ? // eslint-disable-line no-unused-expressions
        e.dataTransfer.setDragImage(document.getElementsByClassName('dnd-drag-placeholder')[0], 0, 0)
        :
        ''
      e.dataTransfer.setData('text', '') // make dnd work in FF, IE and Edge
      actions.onDragStart(e, index)
    }

    onTouchStart = (e) => {
        e.preventDefault()

        const { index, actions } = this.props
        actions.onDragStart(e, index)
    }

    onClick = (e) => {
      e.stopPropagation()

      const { index, actions, preview } = this.props
      actions.onClickDrag(e, index, preview)
    }

    onEnter = (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        this.onClick(e);
      }
    }

    onDropNextIndex = (e) => {
      const { index, actions } = this.props
      actions.onDrop(e, index + 1)
    }
    onDragOverNextIndex = (e) => {
      const { index, actions } = this.props
      actions.onDragOver(e, index + 1)
    }
    onDragLeave = (e) => {
      const { actions } = this.props
      actions.onDragLeave(e)
    }
    onDragOver = (e) => {
      const { index, actions } = this.props
      actions.onDragOver(e, index)
    }
    onDrop = (e) => {
      const { index, actions } = this.props
      actions.onDrop(e, index)
    }
    onDrag = (e) => {
      const { actions } = this.props
      actions.onDrag(e, this.dragPreviewRef)
    }
    onTouchMove = (e) => {
      const { actions } = this.props
      actions.onTouchMove(e, this.dragPreviewRef)
    }

    render() {
      const {state, index, actions, preview} = this.props
      const itemSectionClass = ClassNames({
        'module-section': true,
        'is-dragging': state.isDragging && state.sourceIndex === index,
        'is-keyboard-moving': state.isKeyboardMoving && index === state.sourceIndex,
        'should-on-focus': state.isKeyboardMoving && (index === state.keyInsertIndex),
      })
      const dropUpHalfClass = ClassNames({
        'drop-up-half': true,
        show: state.isDragging && index !== state.sourceIndex,
      })
      const dropDownHalfClass = ClassNames({
        'drop-down-half': true,
        show: state.isDragging && index !== state.sourceIndex,
      })
      const firstKeyInsertPlaceHolderClass = ClassNames({
        'key-insert-placeholder': true,
        show: state.isKeyboardMoving && state.keyInsertIndex === 0 && state.sourceIndex !== 0,
      })
      const firstInsertPlaceHolderClass = ClassNames({
        'insert-placeholder': true,
        'first-insert-placeholder': true,
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
        (state.sourceIndex > state.keyInsertIndex ? index === state.keyInsertIndex - 1 : index === state.keyInsertIndex) &&
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
              dragPointRef={(el) => {
                this.dragPointElem = el
              }}
            />
          </div>
          <div className={insertPlaceholderClass}/>
          <div
            className={dropDownHalfClass}
            data-position={index + 1}
            onDrop={this.onDropNextIndex}
            onDragOver={this.onDragOverNextIndex}
            onDragLeave={this.onDragLeave}
          />
          <div
            className={dropUpHalfClass}
            data-position={index}
            onDrop={this.onDrop}
            onDragOver={this.onDragOver}
            onDragLeave={this.onDragLeave}
          />
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

  Wrapper.displayName = `DragNDropItem(${getDisplayName(WrappedComponent)})`;

  return Wrapper
}

export default DragNDropItem
