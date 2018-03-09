export const moveItem = (itemArray, targetIndex, sourceIndex) => {

  const newArray = [
    ...itemArray.slice(0, sourceIndex),
    ...itemArray.slice(sourceIndex + 1),
  ]

  return [
    ...newArray.slice(0, targetIndex),
    itemArray[sourceIndex],
    ...newArray.slice(targetIndex),
  ]
}

export const omit = (obj, ...keysToOmit) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key];
    return acc;
  }, {});
}

export const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export const isEdge = () => {
  // copied from: https://stackoverflow.com/questions/33152523/how-do-i-detect-ie-and-edge-browser
  return document.documentMode || /Edge/.test(navigator.userAgent);
}
