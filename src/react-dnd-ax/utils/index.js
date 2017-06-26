export const moveItem = (itemArray, sourceItem, targetPosition) => {
  return [
    ...itemArray.slice(0, targetPosition),
    sourceItem,
    ...itemArray.slice(targetPosition),
  ].filter((module, idx) => {
    return !(module.id === sourceItem.id && idx !== targetPosition)
  })
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
