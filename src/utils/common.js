// contains commonly used functions to manipulate objects, array etc.


export function removeDuplicateObjects(array, key) {
    const seen = new Set()
    
    return array.filter(item => {
      if (!seen.has(item[key])) {
        seen.add(item[key])
        return true
      }
      return false
    })
}


/**
 * capitalize the first letter
 * @param {string} str 
 * @returns 
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}