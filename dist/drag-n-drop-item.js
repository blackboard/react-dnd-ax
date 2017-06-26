'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('./utils');

require('./drag-n-drop-item.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DragNDropItem = function DragNDropItem(WrappedComponent) {
  var Wrapper = function (_React$Component) {
    _inherits(Wrapper, _React$Component);

    function Wrapper() {
      _classCallCheck(this, Wrapper);

      return _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).apply(this, arguments));
    }

    _createClass(Wrapper, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var _props = this.props,
            index = _props.index,
            actions = _props.actions,
            preview = _props.preview;


        if (this.dragPointElem) {
          this.dragPointElem.addEventListener('touchstart', function (e) {
            e.preventDefault();
            actions.onDragStart(e, index);
          });
          this.dragPointElem.addEventListener('touchend', actions.onTouchDrop);
          this.dragPointElem.addEventListener('drag', function (e) {
            actions.onDrag(e, _this2.dragPreviewRef);
          });
          this.dragPointElem.addEventListener('dragstart', function (e) {
            // hide the default drag preview image
            e.dataTransfer.setDragImage(document.getElementById('dnd-drag-placeholder'), 0, 0);
            actions.onDragStart(e, index);
          });
          this.dragPointElem.addEventListener('dragend', actions.onDragEnd);
          this.dragPointElem.addEventListener('touchDrop', actions.onTouchDrop);
          this.dragPointElem.addEventListener('touchmove', function (e) {
            actions.onTouchMove(e, _this2.dragPreviewRef);
          });
          this.dragPointElem.addEventListener('click', function (e) {
            e.stopPropagation();
            actions.onClickDrag(e, index, preview);
          });
          this.moduleRef.addEventListener('keydown', actions.onKeyChangeOrder);
        }
      }

      // only render necessary components

    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        var _props2 = this.props,
            state = _props2.state,
            index = _props2.index;

        // need to render all when toggling drag status

        if (nextProps.state.isDragging !== state.isDragging) {
          return true;
        }

        if (nextProps.state.isKeyboardMoving !== state.isKeyboardMoving) {
          return true;
        }

        if (state.isDragging) {
          // only render component around hot zone
          if (nextProps.state.sourceIndex === index || state.sourceIndex === index || index >= nextProps.state.overIndex - 2 && index <= nextProps.state.overIndex + 2) {
            return true;
          }

          // when hovering on dragging element
          if (nextProps.state.overIndex === -1 && nextProps.state.overIndex !== state.overIndex) {
            if (index >= state.sourceIndex - 2 && index <= state.sourceIndex + 1) {
              return true;
            }
          }
        }

        // only render source and destination item
        if (state.isKeyboardMoving) {
          if (index + 1 === state.keyInsertIndex || index + 1 === nextProps.state.keyInsertIndex || index === 0) {
            // improve: should not always render index === 0
            return true;
          }
        }

        return false;
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        if (this.firstKeyInsertPlaceHolderRef && this.firstKeyInsertPlaceHolderRef.className.includes('show')) {
          this.firstKeyInsertPlaceHolderRef.focus();
        } else if (this.downKeyInsertPlaceHolderRef.className.includes('show')) {
          this.downKeyInsertPlaceHolderRef.focus();
        } else if (this.moduleRef.className.includes('is-keyboard-moving') && this.moduleRef.className.includes('should-on-focus')) {
          this.moduleRef.focus();
        }
        if (this.dragPreviewRef.className.includes('show')) {
          this.dragPreviewRef.style.width = getComputedStyle(this.moduleRef).getPropertyValue('width');
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        var _props3 = this.props,
            state = _props3.state,
            index = _props3.index,
            module = _props3.module,
            actions = _props3.actions,
            preview = _props3.preview;

        var moduleSectionClass = (0, _classnames2.default)({
          'module-section': true,
          'is-dragging': state.isDragging && state.sourceIndex === index,
          'is-keyboard-moving': state.isKeyboardMoving && index === state.sourceIndex,
          'should-on-focus': state.isKeyboardMoving && (index === state.keyInsertIndex || index + 1 === state.keyInsertIndex)
        });
        var dropUpHalfClass = (0, _classnames2.default)({
          'drop-up-half': true,
          show: state.isDragging && index !== state.sourceIndex && index !== state.sourceIndex + 1
        });
        var dropDownHalfClass = (0, _classnames2.default)({
          'drop-down-half': true,
          show: state.isDragging && index !== state.sourceIndex && index !== state.sourceIndex - 1
        });
        var firstKeyInsertPlaceHolderClass = (0, _classnames2.default)({
          'key-insert-placeholder': true,
          show: state.isKeyboardMoving && state.keyInsertIndex === 0 && state.sourceIndex !== 0
        });
        var firstInsertPlaceHolderClass = (0, _classnames2.default)({
          'insert-placeholder first-insert-placeholder': true,
          show: state.isDragging && state.overIndex === 0
        });
        var insertPlaceholderClass = (0, _classnames2.default)({
          'insert-placeholder': true,
          show: state.isDragging && index === state.overIndex - 1
        });
        var dragPreviewItemClass = (0, _classnames2.default)({
          'drag-preview-item': true,
          show: state.isDragging && index === state.sourceIndex
        });
        var downKeyInsertPlaceHolderRef = (0, _classnames2.default)({
          'key-insert-placeholder': true,
          show: state.isKeyboardMoving && index + 1 === state.keyInsertIndex && index !== state.sourceIndex
        });
        if (module.props && module.props.name === 'placeholder') {
          return module;
        }

        return _react2.default.createElement(
          'div',
          { className: moduleSectionClass, ref: function ref(_ref4) {
              _this3.moduleRef = _ref4;
            }, tabIndex: '-1' },
          index === 0 ? _react2.default.createElement('div', { className: firstInsertPlaceHolderClass }) : '',
          index === 0 ? _react2.default.createElement(
            'div',
            {
              tabIndex: '-1',
              className: firstKeyInsertPlaceHolderClass,
              onKeyDown: actions.onKeyChangeOrder,
              ref: function ref(_ref) {
                _this3.firstKeyInsertPlaceHolderRef = _ref;
              }
            },
            state.curPreview
          ) : '',
          _react2.default.createElement(
            'div',
            { className: 'item-container' },
            _react2.default.createElement(WrappedComponent, _extends({}, (0, _utils.omit)(this.props, 'state', 'key', 'actions', 'onReorderItem'), {
              onKeyChangeOrder: actions.onKeyChangeOrder,
              dragPointRef: function dragPointRef(el) {
                _this3.dragPointElem = el;
              }
            }))
          ),
          _react2.default.createElement('div', {
            className: dropUpHalfClass,
            'data-position': index,
            onDrop: function onDrop(e) {
              actions.onDrop(e, index);
            },
            onDragOver: function onDragOver(e) {
              actions.onDragOver(e, index);
            },
            onDragLeave: actions.onDragLeave
          }),
          _react2.default.createElement('div', {
            className: dropDownHalfClass,
            'data-position': index + 1,
            onDrop: function onDrop(e) {
              actions.onDrop(e, index + 1);
            },
            onDragOver: function onDragOver(e) {
              actions.onDragOver(e, index + 1);
            },
            onDragLeave: actions.onDragLeave
          }),
          _react2.default.createElement('div', { className: insertPlaceholderClass }),
          _react2.default.createElement(
            'div',
            {
              className: dragPreviewItemClass,
              ref: function ref(_ref2) {
                _this3.dragPreviewRef = _ref2;
              }
            },
            preview
          ),
          _react2.default.createElement(
            'div',
            {
              tabIndex: '-1',
              className: downKeyInsertPlaceHolderRef,
              onKeyDown: actions.onKeyChangeOrder,
              ref: function ref(_ref3) {
                _this3.downKeyInsertPlaceHolderRef = _ref3;
              }
            },
            state.curPreview
          )
        );
      }
    }]);

    return Wrapper;
  }(_react2.default.Component);

  Wrapper.propTypes = {
    index: _propTypes2.default.number.isRequired,
    actions: _propTypes2.default.object.isRequired,
    state: _propTypes2.default.object.isRequired,
    module: _propTypes2.default.object.isRequired,
    preview: _propTypes2.default.element.isRequired
  };

  Wrapper.displayName = 'WithSubscription(' + (0, _utils.getDisplayName)(WrappedComponent) + ')';

  return Wrapper;
};

exports.default = DragNDropItem;