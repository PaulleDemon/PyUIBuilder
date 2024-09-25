import { Layouts, PosType } from "../../../canvas/constants/layouts"
import Tools from "../../../canvas/constants/tools";
import Widget from "../../../canvas/widgets/base";



class TkinterBase extends Widget {
    
    
    setParentLayout(layout){
        // show attributes related to the layout manager
        let updates = {
            parentLayout: layout,
        }
        
        this.removeAttr("gridManager")
        if (layout === Layouts.FLEX || layout === Layouts.GRID) {

            updates = {
                ...updates,
                positionType: PosType.NONE
            }

            if (layout === Layouts.GRID) {
                // Set attributes related to grid layout manager
                updates = {
                    ...updates,
                    attrs: {
                        ...this.state.attrs,
                        gridManager: {
                            label: "Grid manager",
                            display: "horizontal",
                            row: {
                                label: "Row",
                                tool: Tools.NUMBER_INPUT, 
                                toolProps: { placeholder: "width", max: 1000, min: 1 },
                                value: 1,
                                onChange: (value) => {
                                    
                                    const previousRow = this.getWidgetOuterStyle("gridRow") || "1/1"
                                    
                                    let [_row=1, rowSpan=1] = previousRow.replace(/\s+/g, '').split("/").map(Number)
                                    
                                    if (value > rowSpan){
                                        // rowSpan should always be greater than or eq to row
                                        rowSpan = value
                                        this.setAttrValue("gridManager.rowSpan", rowSpan)
                                    }
                                    
                                    this.setAttrValue("gridManager.row", value)
                                    this.setWidgetOuterStyle("gridRow", `${value+' / '+rowSpan}`)
                                }
                            },
                            rowSpan: {
                                label: "Row span",
                                tool: Tools.NUMBER_INPUT,
                                toolProps: { placeholder: "height", max: 1000, min: 1 },
                                value: 1,
                                onChange: (value) => {
                                    
                                    const previousRow = this.getWidgetOuterStyle("gridRow") || "1/1"
                                    
                                    const [row=1, _rowSpan=1] = previousRow.replace(/\s+/g, '').split("/").map(Number)
                                    
                                    if (value < row){
                                        value = row + 1
                                    }
                                    
                                    this.setAttrValue("gridManager.rowSpan", value)
                                    this.setWidgetOuterStyle("gridRow", `${row + ' / ' +value}`)
                                }
                            },
                            column: {
                                label: "Column",
                                tool: Tools.NUMBER_INPUT,
                                toolProps: { placeholder: "height", max: 1000, min: 1 },
                                value: 1,
                                onChange: (value) => {
                                    
                                    const previousRow = this.getWidgetOuterStyle("gridColumn") || "1/1"

                                    let [_col=1, colSpan=1] = previousRow.replace(/\s+/g, '').split("/").map(Number)

                                    if (value > colSpan){
                                        // The colSpan has always be equal or greater than col
                                        colSpan = value
                                        this.setAttrValue("gridManager.columnSpan", colSpan)
                                    }

                                    this.setAttrValue("gridManager.column", value)
                                    this.setWidgetOuterStyle("gridColumn", `${value +' / ' + colSpan}`)
                                }
                            },
                            columnSpan: {
                                label: "Column span",
                                tool: Tools.NUMBER_INPUT,
                                toolProps: { placeholder: "height", max: 1000, min: 1 },
                                value: 1,
                                onChange: (value) => {
                            
                                    const previousCol = this.getWidgetOuterStyle("gridColumn") || "1/1"

                                    const [col=1, _colSpan=1] = previousCol.replace(/\s+/g, '').split("/").map(Number)

                                    if (value < col){
                                        value = col + 1
                                    }
                                    
                                    this.setAttrValue("gridManager.columnSpan", value)
                                    this.setWidgetOuterStyle("gridColumn", `${col + ' / ' + value}`)
                                }
                            },
                        }
                    }
                }

            }

        } else if (layout === Layouts.PLACE) {
            updates = {
                ...updates,
                positionType: PosType.ABSOLUTE
            }
        }

        this.updateState(updates)

        return updates
    }

    /**
     * loads the data 
     * @param {object} data 
     */
    load(data, callback=null){

        if (Object.keys(data).length === 0) return // no data to load

        data = {...data} // create a shallow copy

        const {attrs, parentLayout, ...restData} = data


        let layoutUpdates = {
            parentLayout: parentLayout
        }

        if (parentLayout === Layouts.FLEX || parentLayout === Layouts.GRID){

            layoutUpdates = {
                ...layoutUpdates,
                positionType: PosType.NONE
            }

        }else if (parentLayout === Layouts.PLACE){
            layoutUpdates = {
                ...layoutUpdates,
                positionType: PosType.ABSOLUTE
            }
        }

        const newData = {
            ...restData,
            ...layoutUpdates
        }

        this.setState(newData,  () => {
            let layoutAttrs = this.setParentLayout(parentLayout).attrs || {}

            // UPdates attrs
            let newAttrs = { ...this.state.attrs, ...layoutAttrs }

            // Iterate over each path in the updates object
            Object.entries(attrs).forEach(([path, value]) => {
                const keys = path.split('.')
                const lastKey = keys.pop()

                // Traverse the nested object within attrs
                let nestedObject = newAttrs

                keys.forEach(key => {
                    nestedObject[key] = { ...nestedObject[key] } // Ensure immutability for each nested level
                    nestedObject = nestedObject[key]
                })

                // Set the value at the last key
                if (nestedObject[lastKey])
                    nestedObject[lastKey].value = value
            })

            
            if (newAttrs?.styling?.backgroundColor){
                // TODO: find a better way to apply innerStyles
                this.setWidgetInnerStyle("backgroundColor", newAttrs.styling.backgroundColor.value)
            }

            this.updateState({ attrs: newAttrs }, callback)

        })  


    }


}


export default TkinterBase