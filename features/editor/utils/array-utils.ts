export function addItemToArrayAfter(item: any, array: Array<any>, after: number|null = null) {
  const newArray = Array.from(array)

  if (after) {
    newArray.splice(newArray.indexOf(after) + 1, 0, item)
  } else {
    newArray.push(item)
  }

  return newArray
}

export function removeItemFromArray(item: any, array: Array<any>) {
  const newArray = Array.from(array)
  const index = newArray.indexOf(item)

  newArray.splice(index, 1)

  return newArray
}

export function reorderItemWithinArray(startIndex: number, endIndex: number, array: Array<any>) {
  const newArray = Array.from(array)
  const [removed] = newArray.splice(startIndex, 1)
  newArray.splice(endIndex, 0, removed)

  return newArray
}

export function addItemToArrayAtIndex(item: any, array: Array<any>, index: number) {
  const newArray = Array.from(array)
  newArray.splice(index, 0, item)

  return newArray
}
