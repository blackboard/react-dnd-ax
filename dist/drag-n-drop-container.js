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

var _consts = require('./consts');

var _consts2 = _interopRequireDefault(_consts);

var _utils = require('./utils');

require('./drag-n-drop-container.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SCROLL_RANGE = 150;
var SCROLL_ACC_PX = 5;

/* eslint-disable no-restricted-globals */

var DragNDropContainer = function DragNDropContainer(WrappedComponent) {
  var Wrapper = function (_React$Component) {
    _inherits(Wrapper, _React$Component);

    function Wrapper(props) {
      _classCallCheck(this, Wrapper);

      var _this = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, props));

      _this.state = {
        isDragging: false,
        sourceIndex: -1,
        overIndex: -1,
        isKeyboardMoving: false,
        curPreview: '',
        keyInsertIndex: -1
      };

      _this.leaveKeyboardMoving = function () {
        if (_this.state.isKeyboardMoving) {
          _this.setState({
            isKeyboardMoving: false,
            sourceIndex: -1,
            keyInsertIndex: -1
          });
        }
      };

      _this.onDrag = function (e, dragPreviewRef) {
        e.preventDefault();
        // position move is out of control of react render, so we use id instead of ref
        dragPreviewRef.style.top = e.clientY + 'px'; // eslint-disable-line no-param-reassign

        var ultraStateType = _this.props.ultraStateType;

        // increase scroll area

        if (e.clientY < SCROLL_RANGE) {
          if (ultraStateType === 'base' && _this.baseStateContainer) {
            _this.baseStateContainer.scrollTop -= SCROLL_ACC_PX;
            return;
          } else if (ultraStateType === 'peek' && _this.peekStateContainer) {
            _this.peekStateContainer.scrollTop -= SCROLL_ACC_PX;
            return;
          }
          scrollBy(0, 0 - SCROLL_ACC_PX);
        } else if (innerHeight - e.clientY < SCROLL_RANGE) {
          if (ultraStateType === 'base' && _this.baseStateContainer) {
            _this.baseStateContainer.scrollTop += SCROLL_ACC_PX;
            return;
          } else if (ultraStateType === 'peek' && _this.peekStateContainer) {
            _this.peekStateContainer.scrollTop += SCROLL_ACC_PX;
            return;
          }
          scrollBy(0, SCROLL_ACC_PX);
        }
      };

      _this.onDragStart = function (e, index) {
        _this.setState({
          isDragging: true,
          sourceIndex: index,
          overIndex: -1
        });
      };

      _this.onDragEnd = function (e) {
        if (_this.containerRef) {
          e.preventDefault();
          _this.setState({
            isDragging: false,
            sourceIndex: -1,
            overIndex: -1
          });
        }
      };

      _this.onDrop = function (e, targetIndex) {
        var items = _this.props.items;

        e.preventDefault();
        var newOrderModules = (0, _utils.moveItem)(items, items[_this.state.sourceIndex], targetIndex);
        _this.props.onReorderItem(newOrderModules);
      };

      _this.onDragOver = function (e, index) {
        e.preventDefault();
        _this.setState({
          overIndex: index
        });
      };

      _this.onDragLeave = function (e) {
        e.preventDefault();
        _this.setState({
          overIndex: -1
        });
      };

      _this.onTouchMove = function (e, dragPreviewRef) {
        var touchPoint = e.touches[0];
        var dropZone = document.elementFromPoint(touchPoint.clientX, touchPoint.clientY);
        var position = dropZone.dataset.position;

        if (position) {
          _this.setState({
            overIndex: parseInt(position, 10)
          });
        } else {
          _this.onDragLeave(e);
        }

        // position move is out of control of react render, so we use id instead of ref
        dragPreviewRef.style.top = touchPoint.clientY + 'px'; // eslint-disable-line no-param-reassign

        // increase scroll area
        var ultraStateType = _this.props.ultraStateType;

        // increase scroll area

        if (touchPoint.clientY < SCROLL_RANGE) {
          if (ultraStateType === 'base' && _this.baseStateContainer) {
            _this.baseStateContainer.scrollTop -= SCROLL_ACC_PX;
            return;
          } else if (ultraStateType === 'peek' && _this.peekStateContainer) {
            _this.peekStateContainer.scrollTop -= SCROLL_ACC_PX;
            return;
          }
          scrollBy(0, 0 - SCROLL_ACC_PX);
        } else if (innerHeight - touchPoint.clientY < SCROLL_RANGE) {
          if (ultraStateType === 'base' && _this.baseStateContainer) {
            _this.baseStateContainer.scrollTop += SCROLL_ACC_PX;
            return;
          } else if (ultraStateType === 'peek' && _this.peekStateContainer) {
            _this.peekStateContainer.scrollTop += SCROLL_ACC_PX;
            return;
          }
          scrollBy(0, SCROLL_ACC_PX);
        }
      };

      _this.onTouchDrop = function (e) {
        var touchPoint = e.changedTouches[0];
        var dropZone = document.elementFromPoint(touchPoint.clientX, touchPoint.clientY);
        var position = dropZone.dataset.position;
        if (position) {
          _this.onDrop(e, parseInt(position, 10), 0);
          _this.onDragEnd(e);
        } else {
          _this.onDragEnd(e);
        }
      };

      _this.onClickDrag = function (e, index, preview) {
        e.stopPropagation(); // as binded a event on window to reset isKeyboardMoving state, need to stop propagation here to avoid mis-triggering it
        _this.setState({
          isKeyboardMoving: true,
          sourceIndex: index,
          keyInsertIndex: index + 1,
          curPreview: preview
        });
      };

      _this.onKeyChangeOrder = function (e) {
        var items = _this.props.items;

        if (_this.state.isKeyboardMoving) {
          e.preventDefault();
          e.stopPropagation();
          switch (e.keyCode) {
            case _consts2.default.ESC:
              {
                _this.leaveKeyboardMoving();
                break;
              }
            case _consts2.default.ENTER:
              {
                var newOrderModules = (0, _utils.moveItem)(items, items[_this.state.sourceIndex], _this.state.keyInsertIndex);
                _this.props.onReorderItem(newOrderModules);
                break;
              }
            case _consts2.default.ARROW_UP:
              {
                // skip displaying of item which is above the source cause its insert place holder should never be displayed
                if (_this.state.keyInsertIndex - 1 === _this.state.sourceIndex) {
                  if (_this.state.keyInsertIndex - 2 >= 0) {
                    _this.setState({ keyInsertIndex: _this.state.keyInsertIndex - 2 });
                  }
                } else if (_this.state.keyInsertIndex - 1 >= 0) {
                  _this.setState({ keyInsertIndex: _this.state.keyInsertIndex - 1 });
                }
                break;
              }
            case _consts2.default.ARROW_DOWN:
              {
                // skip displaying of item which is above the source cause its insert place holder should never be displayed
                if (_this.state.keyInsertIndex + 1 === _this.state.sourceIndex) {
                  if (_this.state.keyInsertIndex + 2 <= items.length) {
                    _this.setState({ keyInsertIndex: _this.state.keyInsertIndex + 2 });
                  }
                } else if (_this.state.keyInsertIndex + 1 <= items.length) {
                  _this.setState({ keyInsertIndex: _this.state.keyInsertIndex + 1 });
                }
                break;
              }
            default:
              break;
          }
        }
      };

      _this.actions = {
        onDrag: _this.onDrag,
        onDragStart: _this.onDragStart,
        onDragEnd: _this.onDragEnd,
        leaveKeyboardMoving: _this.leaveKeyboardMoving,
        onDrop: _this.onDrop,
        onDragOver: _this.onDragOver,
        onDragLeave: _this.onDragLeave,
        onTouchMove: _this.onTouchMove,
        onTouchDrop: _this.onTouchDrop,
        onClickDrag: _this.onClickDrag,
        onKeyChangeOrder: _this.onKeyChangeOrder
      };

      if (!document.getElementById('dnd-drag-placeholder')) {
        var transparentElem = document.createElement('div');
        transparentElem.id = 'dnd-drag-placeholder';
        document.body.appendChild(transparentElem);
      }
      return _this;
    }

    _createClass(Wrapper, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        window.addEventListener('click', this.leaveKeyboardMoving);
        this.baseStateContainer = document.getElementById('main-content-inner');
        setTimeout(function () {
          // after angular digest for peek panel finished, 'side-panel-content' is available
          _this2.peekStateContainer = document.getElementsByClassName('side-panel-content')[0];
        }, 0);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        window.removeEventListener('click', this.leaveKeyboardMoving);

        var transparentElem = document.getElementById('dnd-drag-placeholder');
        if (transparentElem) {
          document.body.removeChild(transparentElem);
        }
      }

      // we don't have to render the component for every onDragOver callback

    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isDragging !== this.state.isDragging) {
          // deal with dragOver delay
          return true;
        }
        if (nextState.overIndex === this.state.overIndex && this.state.isDragging) {
          return false;
        }
        return true;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        return _react2.default.createElement(
          'div',
          { id: 'react-dnd-ax', ref: function ref(_ref) {
              _this3.containerRef = _ref;
            } },
          _react2.default.createElement(WrappedComponent, _extends({}, this.props, {
            state: this.state,
            actions: this.actions
          }))
        );
      }
    }]);

    return Wrapper;
  }(_react2.default.Component);

  Wrapper.propTypes = {
    items: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
    onReorderItem: _propTypes2.default.func.isRequired,
    ultraStateType: _propTypes2.default.string
  };

  Wrapper.displayName = 'WithSubscription(' + (0, _utils.getDisplayName)(WrappedComponent) + ')';

  return Wrapper;
};

exports.default = DragNDropContainer;