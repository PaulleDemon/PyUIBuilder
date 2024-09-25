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


/**
* Given the key as a path, removes the widget attribute at the given path
* @param {string} path - path to the key, eg: styling.backgroundColor
* @param {{}} _object - object with key and value
*/
export function removeKeyFromObject(path, _object) {
	const keys = path.split('.')
	const lastKey = keys.pop()

	// Traverse the state and find the nested object up to the second last key
	let newAttrs = { ..._object }
	let nestedObject = newAttrs

	for (const key of keys) {
		if (nestedObject[key] !== undefined) {
			nestedObject[key] = { ...nestedObject[key] }  // Ensure immutability
			nestedObject = nestedObject[key]
		} else {
			return  // Key doesn't exist, so nothing to remove
		}
	}

	// Remove the attribute
	delete nestedObject[lastKey]

	return newAttrs
}   


export function isNumeric(str) {
	if (typeof str != "string") return false // we only process strings!  
	return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		   !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }
  