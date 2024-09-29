import { Layouts, PosType } from "../../../canvas/constants/layouts"
import Tools from "../../../canvas/constants/tools"
import Widget from "../../../canvas/widgets/base"
import { convertObjectToKeyValueString, removeKeyFromObject } from "../../../utils/common"
import { Tkinter_TO_WEB_CURSOR_MAPPING } from "../constants/cursor"
import { Tkinter_To_GFonts } from "../constants/fontFamily"
import { JUSTIFY, RELIEF } from "../constants/styling"



export class TkinterBase extends Widget {

    static requiredImports = ['import tkinter as tk']

    constructor(props) {
        super(props)

        this.getLayoutCode = this.getLayoutCode.bind(this)
    }

    getLayoutCode(){
        const {layout: parentLayout, direction, gap} = this.getParentLayout()

        const absolutePositioning = this.getAttrValue("positioning")  

        let layoutManager = `pack()`

        if (parentLayout === Layouts.PLACE || absolutePositioning){

            const config = {
                x: this.state.pos.x,
                y: this.state.pos.y,
            }

            if (!this.state.fitContent.width){
                config["width"] = this.state.size.width
            }
            if (!this.state.fitContent.height){
                config["height"] = this.state.size.height
            }

            const configStr = convertObjectToKeyValueString(config)

            layoutManager = `place(${configStr})`

        }if (parentLayout === Layouts.FLEX){

            const config = {
                side: direction === "row" ? "tk.LEFT" : "tk.TOP",
            }

            const fillX = this.getAttrValue("flexManager.fillX")
            const fillY = this.getAttrValue("flexManager.fillY")
            const expand = this.getAttrValue("flexManager.expand")

            if (fillX){
                config['fill'] = `"x"`
            }

            if (fillY){
                config['fill'] = `"y"`
            }

            if (fillX && fillY){
                config['fill'] = `"both"`
            }

            if (expand){
                config['expand'] = "True"
            }

            layoutManager = `pack(${convertObjectToKeyValueString(config)})`

        }else if (parentLayout === Layouts.GRID){
            const row = this.getAttrValue("gridManager.row")
            const col = this.getAttrValue("gridManager.col")
            layoutManager = `grid(row=${row}, col=${col})`
        }

        return layoutManager
    }

    setParentLayout(layout){

        if (!layout){
            return {}
        } 

        const {layout: parentLayout, direction, gap} = layout

        // show attributes related to the layout manager
        let updates = {
            parentLayout: layout,
        }
        
        this.removeAttr("gridManager")
        this.removeAttr("flexManager")
        this.removeAttr("positioning")
        if (parentLayout === Layouts.FLEX || parentLayout === Layouts.GRID) {

            updates = {
                ...updates,
                positionType: PosType.NONE,
            }
            // Allow optional absolute positioning if the parent layout is flex or grid
            const updateAttrs = {
                ...this.state.attrs,
                positioning: {
                    label: "Absolute positioning",
                    tool: Tools.CHECK_BUTTON,
                    value: false,
                    onChange: (value) => {
                        this.setAttrValue("positioning", value)
                        
                        this.updateState({
                            positionType: value ? PosType.ABSOLUTE : PosType.NONE,
                        })
                        
                    }
                }
            }

            if (parentLayout === Layouts.FLEX){
                updates = {
                    ...updates,
                    attrs: {
                        ...updateAttrs,
                        flexManager: {
                            label: "Flex Manager",
                            display: "horizontal",
                            fillX: {
                                label: "Fill X",
                                tool: Tools.CHECK_BUTTON,
                                value: false,
                                onChange: (value) => {
                                    this.setAttrValue("flexManager.fillX", value)
                                    const widgetStyle = {
                                        ...this.state.widgetOuterStyling,
                                        flexGrow: value ? 1 : 0,
                                    }

                                    this.updateState({
                                        widgetOuterStyling: widgetStyle,
                                    })
                                    
                                }
                            },
                            fillY: {
                                label: "Fill Y",
                                tool: Tools.CHECK_BUTTON,
                                value: false,
                                onChange: (value) => {
                                    this.setAttrValue("flexManager.fillY", value)
                                    
                                    const widgetStyle = {
                                        ...this.state.widgetOuterStyling,
                                        flexGrow: value ? 1 : 0,
                                    }
                                    this.updateState({
                                        widgetOuterStyling: widgetStyle,
                                    })
                                }
                            },
                            expand: {
                                label: "Expand",
                                tool: Tools.CHECK_BUTTON,
                                value: false,
                                onChange: (value) => {
                                    this.setAttrValue("flexManager.expand", value)
                                    
                                    const widgetStyle = {
                                        ...this.state.widgetOuterStyling,
                                        flexGrow: value ? 1 : 0,
                                    }
                                    this.updateState({
                                        widgetOuterStyling: widgetStyle,
                                    })
                                }
                            },
                            
                        }
                    }
                }
            }

            else if (parentLayout === Layouts.GRID) {
                // Set attributes related to grid layout manager
                updates = {
                    ...updates,
                    attrs: {
                        ...updateAttrs,
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

        } else if (parentLayout === Layouts.PLACE) {
            updates = {
                ...updates,
                positionType: PosType.ABSOLUTE
            }
        }

        this.updateState(updates)

        return updates
    }

    getInnerRenderStyling(){
        let {width, height, minWidth, minHeight} = this.getRenderSize()

        const {layout: parentLayout, direction, gap} = this.getParentLayout() || {}

        if (parentLayout === Layouts.FLEX){
            const fillX = this.getAttrValue("flexManager.fillX")
            const fillY = this.getAttrValue("flexManager.fillY")

            // This is needed if fillX or fillY is true, as the parent is applied flex-grow

            if (fillX || fillY){
                width = "100%"
                height = "100%"
            }

        }

        const styling = {
            ...this.state.widgetInnerStyling,
            width, 
            height,
            minWidth, 
            minHeight
        }
        return styling
    }

    /**
     * loads the data 
     * @param {object} data 
     */
    load(data, callback=null){

        if (Object.keys(data).length === 0) return // no data to load

        data = {...data} // create a shallow copy

        const {attrs, parentLayout=null, ...restData} = data


        let layoutUpdates = {
            parentLayout: parentLayout
        }
        
        if (parentLayout){
            if (parentLayout.layout === Layouts.FLEX || parentLayout.layout === Layouts.GRID){

                layoutUpdates = {
                    ...layoutUpdates,
                    positionType: PosType.NONE
                }

            }else if (parentLayout.layout === Layouts.PLACE){
                layoutUpdates = {
                    ...layoutUpdates,
                    positionType: PosType.ABSOLUTE
                }
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


// base for widgets that have common base properties such as bg, fg, cursor etc
export class TkinterWidgetBase extends TkinterBase{

    constructor(props) {
        super(props)

        this.droppableTags = null // disables drops

        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.state = {
            ...this.state,
            attrs: {
                ...newAttrs,
                styling: {
                    ...newAttrs.styling,
                    foregroundColor: {
                        label: "Foreground Color",
                        tool: Tools.COLOR_PICKER, 
                        value: "#000",
                        onChange: (value) => {
                            this.setWidgetInnerStyle("color", value)
                            this.setAttrValue("styling.foregroundColor", value)
                        }
                    },
                    borderWidth: {
                        label: "Border thickness",
                        tool: Tools.NUMBER_INPUT, 
                        toolProps: {min: 0, max: 10},
                        value: 0,
                        onChange: (value) => {
                            this.setWidgetInnerStyle("border", `${value}px solid black`)
                            this.setAttrValue("styling.borderWidth", value)
                        }
                    },
                    relief: {
                        label: "Relief",
                        tool: Tools.SELECT_DROPDOWN,
                        options: RELIEF.map((val) => ({value: val, label: val})),
                        value: "",
                        onChange: (value) => {
                            // this.setWidgetInnerStyle("fontFamily", Tkinter_To_GFonts[value])
                            this.setAttrValue("styling.relief", value)
                        }
                    },
                    // justify: {
                    //     label: "Justify",
                    //     tool: Tools.SELECT_DROPDOWN,
                    //     options: JUSTIFY.map((val) => ({value: val, label: val})),
                    //     value: "",
                    //     onChange: (value) => {
                    //         this.setWidgetInnerStyle("text-align", value)
                    //         this.setAttrValue("styling.justify", value)
                    //     }
                    // }
                },
                padding: {
                    label: "padding",
                    padX: {
                        label: "Pad X",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: {min: 1, max: 140},
                        value: null,
                        onChange: (value) => {
                            // this.setWidgetInnerStyle("paddingLeft", `${value}px`)
                            // this.setWidgetInnerStyle("paddingRight", `${value}px`)

                            const widgetStyle = {
                                ...this.state.widgetInnerStyling,
                                paddingLeft: `${value}px`,
                                paddingRight: `${value}px`
                            }
                            this.setState({

                                widgetInnerStyling: widgetStyle
                            })


                            this.setAttrValue("padding.padX", value)
                        }
                    },
                    padY: {
                        label: "Pad Y",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: {min: 1, max: 140},
                        value: null,
                        onChange: (value) => {
                            const widgetStyle = {
                                ...this.state.widgetInnerStyling,
                                paddingTop: `${value}px`,
                                paddingBottom: `${value}px`
                            }
                            this.setState({

                                widgetInnerStyling: widgetStyle
                            })
                            this.setAttrValue("padding.padX", value)
                        }
                    },
                },
                font: {
                    label: "font",
                    fontFamily: {
                        label: "font family",
                        tool: Tools.SELECT_DROPDOWN,
                        options: Object.keys(Tkinter_To_GFonts).map((val) => ({value: val, label: val})),
                        value: "",
                        onChange: (value) => {
                            this.setWidgetInnerStyle("fontFamily", Tkinter_To_GFonts[value])
                            this.setAttrValue("font.fontFamily", value)
                        }
                    },
                    fontSize: {
                        label: "font size",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: {min: 3, max: 140},
                        value: null,
                        onChange: (value) => {
                            this.setWidgetInnerStyle("fontSize", `${value}px`)
                            this.setAttrValue("font.fontSize", value)
                        }
                    }
                },
                cursor: {
                    label: "Cursor",
                    tool: Tools.SELECT_DROPDOWN, 
                    toolProps: {placeholder: "select cursor"},
                    value: "",
                    options: Object.keys(Tkinter_TO_WEB_CURSOR_MAPPING).map((val) => ({value: val, label: val})),
                    onChange: (value) => {
                        this.setWidgetInnerStyle("cursor", Tkinter_TO_WEB_CURSOR_MAPPING[value])
                        this.setAttrValue("cursor", value)
                    }
                },
            }
        }

        this.getConfigCode = this.getConfigCode.bind(this)
    }

    getConfigCode(){

        const code = {
            bg: `"${this.getAttrValue("styling.backgroundColor")}"`,
            fg: `"${this.getAttrValue("styling.foregroundColor")}"`,
        }

        if (this.getAttrValue("styling.borderWidth"))
            code["bd"] = this.getAttrValue("styling.borderWidth")

        if (this.getAttrValue("styling.relief"))
            code["relief"] = `"${this.getAttrValue("styling.relief")}"`

        if (this.getAttrValue("font.fontFamily") || this.getAttrValue("font.fontSize")){
            code["font"] = `("${this.getAttrValue("font.fontFamily")}", ${this.getAttrValue("font.fontSize") || 12}, )`
        }

        if (this.getAttrValue("cursor"))
            code["cursor"] = `"${this.getAttrValue("cursor")}"`

        if (this.getAttrValue("padding.padX")){
            code["padx"] = this.getAttrValue("padding.padX")
        }

        if (this.getAttrValue("padding.padY")){
            code["pady"] = this.getAttrValue("padding.padY")
        }

        return code
    }

}