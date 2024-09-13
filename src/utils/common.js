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