
// given a string, converts to a python naming variable (snake case)
export function toSnakeCase(str) {
    return str.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').toLowerCase()
}