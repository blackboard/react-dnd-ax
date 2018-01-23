export const moveItem = (itemArray, targetPosition, sourceIndex) => {

  const newArray = [
    ...itemArray.slice(0, sourceIndex),
    ...itemArray.slice(sourceIndex + 1),
  ]

  if (targetPosition > sourceIndex) {
    return [
      ...newArray.slice(0, targetPosition - 1),
      itemArray[sourceIndex],
      ...newArray.slice(targetPosition - 1 ),
    ]
  }

  return [
    ...newArray.slice(0, targetPosition),
    itemArray[sourceIndex],
    ...newArray.slice(targetPosition),
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
