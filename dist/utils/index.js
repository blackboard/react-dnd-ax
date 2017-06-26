'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var moveItem = exports.moveItem = function moveItem(itemArray, sourceItem, targetPosition) {
  return [].concat(_toConsumableArray(itemArray.slice(0, targetPosition)), [sourceItem], _toConsumableArray(itemArray.slice(targetPosition))).filter(function (module, idx) {
    return !(module.id === sourceItem.id && idx !== targetPosition);
  });
};

var omit = exports.omit = function omit(obj) {
  for (var _len = arguments.length, keysToOmit = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keysToOmit[_key - 1] = arguments[_key];
  }

  return Object.keys(obj).reduce(function (acc, key) {
    if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key];
    return acc;
  }, {});
};

var getDisplayName = exports.getDisplayName = function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};