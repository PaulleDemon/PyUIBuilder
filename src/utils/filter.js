/**
 * given a list of objects filters out objects starting with specific value for a given key
 * @param {any[]} list 
 * @param {string} key 
 * @param {string} valueStart 
 * @param {boolean} ignoreCase - default true
 */
export function filterObjectListStartingWith(list, key, valueStart, ignoreCase = true) {
    if (ignoreCase)
        valueStart = valueStart.toLocaleLowerCase()

    return list.filter(obj => {
        const value = obj[key]

        if (ignoreCase)
            return value.toLowerCase().startsWith(valueStart)

        else
            return value.startsWith(valueStart)
    })
}