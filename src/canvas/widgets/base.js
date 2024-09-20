import React from "react"
import { NotImplementedError } from "../../utils/errors"

import Tools from "../constants/tools"
import { Layouts, PosType} from "../constants/layouts"
import Cursor from "../constants/cursor"
import { toSnakeCase } from "../utils/utils"
import EditableDiv from "../../components/editableDiv"
import DraggableWrapper from "../../components/draggable/draggable"
import DroppableWrapper from "../../components/draggable/droppable"

import { ActiveWidgetContext } from "../activeWidgetContext"
import { DragWidgetProvider } from "./draggableWidgetContext"
import WidgetDraggable from "./widgetDragDrop"
import WidgetContainer from "../constants/containers"



const ATTRS_KEYS = ['value', 'label', 'tool', 'onChange', 'toolProps'] // these are attrs keywords, don't use these keywords as keys while defining the attrs property


/**
 * Base class to be extended
 */
class Widget extends React.Component {

    static widgetType = "widget"

    // static contextType = ActiveWidgetContext

    constructor(props) {
        super(props)

        const { id, widgetName, canvasRef } = props
        // console.log("Id: ", id)
        // this id has to be unique inside the canvas, it will be set automatically and should never be changed
        this.__id = id
        this.canvas = canvasRef?.current || null // canvasContainerRef, because some events work properly only if attached to the container

        // this._selected = false
        this._disableResize = false
        this._disableSelection = false

        this.minSize = { width: 50, height: 50 } // disable resizing below this number
        this.maxSize = { width: 500, height: 500 } // disable resizing above this number

        this.cursor = Cursor.POINTER

        this.icon = "" // antd icon name representing this widget

        this.elementRef = React.createRef()

        this.functions = {
            "load": { "args1": "number", "args2": "string" }
        }


        this.layout = Layouts.FLEX
        this.boundingRect = {
            x: 0,
            y: 0,
            height: 100,
            width: 100
        }

        this.state = {
            zIndex: 0,
            selected: false,
            widgetName: widgetName || 'widget', // this will later be converted to variable name
            enableRename: false, // will open the widgets editable div for renaming
            dragEnabled: true,

            widgetContainer: WidgetContainer.CANVAS, // what is the parent of the widget

            showDroppableStyle: { // shows the droppable indicator
                allow: false, 
                show: false,
            },

            pos: { x: 0, y: 0 },
            size: { width: 100, height: 100 },
            positionType: PosType.ABSOLUTE,

            widgetStyling: {
                // use for widget's inner styling
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "row",
                gap: 10,
                flexWrap: "wrap"
            },

            attrs: {
                styling: {
                    backgroundColor: {
                        label: "Background Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#fff",
                        onChange: (value) => {
                            this.setWidgetStyling("backgroundColor", value)
                            this.setAttrValue("styling.backgroundColor", value)
                        }
                    },
                    foregroundColor: {
                        label: "Foreground Color",
                        tool: Tools.COLOR_PICKER,
                        value: "#000",
                    },
                    label: "Styling"
                },
                layout: {
                    label: "Layout",
                    tool: Tools.LAYOUT_MANAGER, // the tool to display, can be either HTML ELement or a constant string
                    value: {
                        layout: "flex",
                        direction: "row",
                        grid: {
                            rows: 1,
                            cols: 1
                        },
                        gap: 10,
                    },
                    toolProps: {
                        options: [
                            { value: "flex", label: "Flex" },
                            { value: "grid", label: "Grid" },
                            { value: "place", label: "Place" },
                        ],
                    },
                    onChange: (value) => {
                        // this.setAttrValue("layout", value)
                        this.setLayout(value)
                    }
                },
                events: {
                    event1: {
                        tool: Tools.EVENT_HANDLER,
                        value: ""
                    }
                }
            },
        }

        this.mousePress = this.mousePress.bind(this)
        this.getElement = this.getElement.bind(this)

        this.getId = this.getId.bind(this)

        this.getPos = this.getPos.bind(this)
        this.getSize = this.getSize.bind(this)
        this.getWidgetName = this.getWidgetName.bind(this)
        this.getWidgetType = this.getWidgetType.bind(this)
        this.getBoundingRect = this.getBoundingRect.bind(this)

        this.getToolbarAttrs = this.getToolbarAttrs.bind(this)

        // this.openRenaming = this.openRenaming.bind(this)

        this.isSelected = this.isSelected.bind(this)

        this.setPos = this.setPos.bind(this)
        this.setAttrValue = this.setAttrValue.bind(this)
        this.setWidgetName = this.setWidgetName.bind(this)
        this.setWidgetStyling = this.setWidgetStyling.bind(this)
        this.setPosType = this.setPosType.bind(this)

    }

    componentDidMount() {
        this.elementRef.current?.addEventListener("click", this.mousePress)

        // FIXME: initial layout is not set properly
        console.log("prior layout: ", this.state.attrs.layout.value)
        this.setLayout(this.state.attrs.layout.value)
        this.setWidgetStyling('backgroundColor', this.state.attrs.styling?.backgroundColor.value || "#fff")
    
        this.load(this.props.initialData || {}) // load the initial data


    }

    componentWillUnmount() {
        this.elementRef.current?.removeEventListener("click", this.mousePress)
    }

    componentDidUpdate(prevProps, prevState) {
        // if (prevState !== this.state) {
        //     // State has changed
        //     console.log('State has been updated')
        // } else {
        //     // State has not changed
        //     console.log('State has not changed')
        // }
    }

    updateState = (newState, callback) => {

        // FIXME: maximum recursion error when updating size
        this.setState(newState, () => {

            const { onWidgetUpdate } = this.props
            if (onWidgetUpdate) {
                onWidgetUpdate(this.__id)
            }

            // const { activeWidgetId, updateToolAttrs } = this.context

            // if (activeWidgetId === this.__id)
            //     updateToolAttrs(this.getToolbarAttrs())

            if (callback) callback()

        })
    }

    _getWidgetMethods = () => {
        return {
            rename: this.setWidgetName,
            resize: this.setWidgetSize,
            setWidgetAttrs: this.setAttrValue,
        }
    }

    getToolbarAttrs(){

        return ({
                id: this.__id,
                widgetName: {
                    label: "Widget Name",
                    tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: {placeholder: "Widget name", maxLength: 40}, 
                    value: this.state.widgetName,
                    onChange: (value) => this.setWidgetName(value)
                },
                size: {
                    label: "Size",
                    display: "horizontal",
                    width: {
                        label: "Width",
                        tool: Tools.NUMBER_INPUT, // the tool to display, can be either HTML ELement or a constant string
                        toolProps: {placeholder: "width", max: this.maxSize.width, min: this.minSize.width}, 
                        value: this.state.size.width || 100,
                        onChange: (value) => this.setWidgetSize(value, null)
                    },
                    height: {
                        label: "Height",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: {placeholder: "height", max: this.maxSize.height, min: this.minSize.height}, 
                        value: this.state.size.height || 100,
                        onChange: (value) => this.setWidgetSize(null, value)
                    },
                },
                
                ...this.state.attrs,

        })
    }

    // TODO: add context menu items such as delete, add etc
    contextMenu() {

    }

    getVariableName() {
        return toSnakeCase(this.state.widgetName)
    }

    getWidgetName() {
        return this.state.widgetName
    }

    getWidgetType() {
        return this.constructor.widgetType
    }

    getAttributes() {
        return this.state.attrs
    }

    getId(){
        return this.__id
    }

    mousePress(event) {
        // event.preventDefault()
        if (!this._disableSelection) {
        }
    }

    select() {
        this.setState({
            selected: true
        })

    }

    deSelect() {
        this.setState({
            selected: false
        })
    }

    isSelected() {
        return this.state.selected
    }

    setPosType(positionType){

        if (!Object.values(PosType).includes(positionType)){
            throw Error(`The Position type can only be among: ${Object.values(PosType).join(", ")}`)
        }

        this.setState({
            positionType: positionType
        })

    }

    setPos(x, y) {

        this.setState({
            pos: { x, y }
        })

        // this.updateState({
        //     pos: { x, y }
        // })
    }


    getPos() {
        return this.state.pos
    }

    getProps() {
        return this.attrs
    }

    getBoundingRect() {
        return this.elementRef.current?.getBoundingClientRect()
    }

    getSize() {
        return this.state.size
    }

    getWidgetFunctions() {
        return this.functions
    }

    getId() {
        return this.__id
    }

    getElement() {
        return this.elementRef.current
    }

    getLayoutStyleForWidget = () => {

        switch (this.state.attrs.layout) {
            case 'grid':
                return { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }
            case 'flex':
                return { display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }
            case 'absolute':
                return { position: 'absolute', left: "0", top: "0" } // Custom positioning
            default:
                return {}
        }
    }

    /**
     * Given the key as a path, sets the value for the widget attribute
     * @param {string} path - path to the key, eg: styling.backgroundColor
     * @param {any} value 
     */
    setAttrValue(path, value) {
        this.setState((prevState) => {
            // Split the path to access the nested property (e.g., "styling.backgroundColor")
            const keys = path.split('.')
            const lastKey = keys.pop()

            // Traverse the state and update the nested value immutably
            let newAttrs = { ...prevState.attrs }
            let nestedObject = newAttrs

            keys.forEach(key => {
                nestedObject[key] = { ...nestedObject[key] } // Ensure immutability
                nestedObject = nestedObject[key]
            })
            nestedObject[lastKey].value = value

            return { attrs: newAttrs }
        })
    }

    /**
     * returns the path from the serialized attrs values, 
     * this is a helper function to remove any non-serializable data associated with attrs
     * eg: {"styling.backgroundColor": "#ffff", "layout": {layout: "flex", direction: "", grid: }}
     */
    serializeAttrsValues = () => {

        const serializeValues = (obj, currentPath = "") => {
            const result = {}
        
            for (let key in obj) {

                if (ATTRS_KEYS.includes(key)) continue // don't serialize these as separate keys

                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    // If the key contains a value property
                    if (obj[key].hasOwnProperty('value')) {
                        const path = currentPath ? `${currentPath}.${key}` : key;
        
                        // If the value is an object, retain the entire value object
                        if (typeof obj[key].value === 'object' && obj[key].value !== null) {
                            result[path] = obj[key].value
                        } else {
                            result[`${path}`] = obj[key].value
                        }
                    }
                    // Continue recursion for nested objects
                    Object.assign(result, serializeValues(obj[key], currentPath ? `${currentPath}.${key}` : key))
                }
            }
        
            return result
        }

        return serializeValues(this.state.attrs)
    }

    setZIndex(zIndex) {
        this.setState({
            zIndex: zIndex
        })
    }

    setWidgetName(name) {

        this.updateState({
            widgetName: name.length > 0 ? name : this.state.widgetName
        })
    }

    setLayout(value){

        const {layout, direction, grid={rows: 1, cols: 1}, gap=10} = value

        const widgetStyle = {
            ...this.state.widgetStyling,
            display: layout,
            flexDirection: direction,
            gap: `${gap}px`,
            flexWrap: "wrap"
            // TODO: add grid rows and cols
        }

        this.setAttrValue("layout", value)
        this.updateState({
            widgetStyling: widgetStyle
        })

    }

    /**
     * 
     * @param {string} key - The string in react Style format
     * @param {string} value - Value of the style
     */
    setWidgetStyling(key, value) {

        const widgetStyle = {
            ...this.state.widgetStyling,
            [key]: value
        }

        this.setState({
            widgetStyling: widgetStyle
        })

    }

    /**
     * 
     * @param {number|null} width 
     * @param {number|null} height 
     */
    setWidgetSize(width, height) {

        const newSize = {
            width: Math.max(this.minSize.width, Math.min(width || this.state.size.width, this.maxSize.width)),
            height: Math.max(this.minSize.height, Math.min(height || this.state.size.height, this.maxSize.height)),
        }
        this.updateState({
            size: newSize
        })
    }

    setResize(pos, size){
        // useful when resizing the widget relative to the canvas, sets all pos, and size
        this.updateState({
            size: size,
            pos: pos
        })
    }

    openRenaming() {
        this.setState({
            selected: true,
            enableRename: true
        })
    }

    closeRenaming() {
        this.setState({
            enableRename: false
        })
    }

    handleDrop = (event, dragElement) => {
        console.log("dragging event: ", event, dragElement)

        const container = dragElement.getAttribute("data-container")
        // TODO: check if the drop is allowed
        if (container === "canvas"){
        
            this.props.onAddChildWidget(this.__id, dragElement.getAttribute("data-widget-id"))
        
        }else if (container === "sidebar"){
            
            this.props.onAddChildWidget(this.__id, null, true) //  if dragged from the sidebar create the widget first

        }

    }

    /**
     * 
     * serialize data for saving
     */
    serialize = () => {
        // NOTE: when serializing make sure, you are only passing serializable objects not functions or other
        return ({
            zIndex: this.state.zIndex,
            widgetName: this.state.widgetName,
            pos: this.state.pos,
            size: this.state.size,
            widgetContainer: this.state.widgetContainer,
            widgetStyling: this.state.widgetStyling,
            positionType: this.state.positionType,
            attrs: this.serializeAttrsValues() // makes sure that functions are not serialized
        })

    }

    /**
     * loads the data 
     * @param {object} data 
     */
    load = (data) => {

        if (Object.keys(data).length === 0) return // no data to load

        for (let [key, value] of Object.entries(data.attrs|{}))
            this.setAttrValue(key, value)

        delete data.attrs

        /**
         * const obj = { a: 1, b: 2, c: 3 }
         * const { b, ...newObj } = obj
         * console.log(newObj) // { a: 1, c: 3 }
         */

        this.setState(data)

    }

    // FIXME: children outside the bounding box
    renderContent() {
        // throw new NotImplementedError("render method has to be implemented")
        return (
            <div className="tw-w-full tw-h-full tw-p-2 tw-content-start tw-rounded-md" style={this.state.widgetStyling}>
                {this.props.children}
            </div>
        )
    }


    /**
     * This is an internal methods don't override
     * @returns {HTMLElement}
     */
    render() {

        let outerStyle = {
            cursor: this.cursor,
            zIndex: this.state.zIndex,
            position: this.state.positionType, //  don't change this if it has to be movable on the canvas
            top: `${this.state.pos.y}px`,
            left: `${this.state.pos.x}px`,
            width: `${this.state.size.width}px`,
            height: `${this.state.size.height}px`,
        }

        // console.log("selected: ", this.state.selected)
        return (
            <WidgetDraggable widgetRef={this.elementRef} 
                                enableDrag={this.state.dragEnabled}
                                onDrop={this.handleDrop}
                                onDragEnter={({dragElement, showDrop}) => {
                                    this.setState({
                                        showDroppableStyle: showDrop
                                    })
                                    }
                                }
                                onDragLeave={ () => {
                                        this.setState({
                                            showDroppableStyle: {
                                                allow: false, 
                                                show: false
                                            }
                                        })
                                    }
                                }
                                >

                <div data-widget-id={this.__id} 
                        ref={this.elementRef} 
                        className="tw-absolute tw-shadow-xl tw-w-fit tw-h-fit"
                        style={outerStyle}
                        data-draggable-type={this.getWidgetType()} // helps with droppable 
                        data-container={this.state.widgetContainer} // indicates how the canvas should handle dragging, one is sidebar other is canvas
                    >

                    <div className="tw-relative tw-w-full tw-h-full tw-top-0 tw-left-0">
                        {this.renderContent()}

                        {
                            // show drop style on drag hover
                            this.state.showDroppableStyle.show &&
                                <div className={`${this.state.showDroppableStyle.allow ? "tw-border-blue-600" : "tw-border-red-600"} 
                                                    tw-absolute tw-top-[-5px] tw-left-[-5px] tw-w-full tw-h-full tw-z-[2]
                                                    tw-border-2 tw-border-dashed  tw-rounded-lg tw-pointer-events-none

                                                    `}
                                        style={
                                                {
                                                    width: "calc(100% + 10px)",
                                                    height: "calc(100% + 10px)",
                                                }
                                            }
                                        >
                                </div>
                        }
                    
                        <div className={`tw-absolute tw-bg-transparent tw-scale-[1.1] tw-opacity-100 
                                        tw-w-full tw-h-full tw-top-0 
                                        ${this.state.selected ? 'tw-border-2 tw-border-solid tw-border-blue-500' : 'tw-hidden'}`}>

                            <div className="tw-relative tw-w-full tw-h-full">
                                <EditableDiv value={this.state.widgetName} onChange={this.setWidgetName}
                                    maxLength={40}
                                    openEdit={this.state.enableRename}
                                    className="tw-text-sm tw-w-fit tw-max-w-[160px] tw-text-clip tw-min-w-[150px] 
                                                            tw-overflow-hidden tw-absolute tw--top-6 tw-h-6"
                                />

                                <div
                                    className="tw-w-2 tw-h-2 tw-absolute tw--left-1 tw--top-1 tw-bg-blue-500"
                                    style={{ cursor: Cursor.NW_RESIZE }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        this.props.onWidgetResizing("nw")
                                        this.setState({dragEnabled: false})
                                    }}
                                    onMouseUp={() => this.setState({dragEnabled: true})}
                                />
                                <div
                                    className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--top-1 tw-bg-blue-500"
                                    style={{ cursor: Cursor.SW_RESIZE }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        this.props.onWidgetResizing("ne")
                                        this.setState({dragEnabled: false})
                                    }}
                                    onMouseUp={() => this.setState({dragEnabled: true})}
                                />
                                <div
                                    className="tw-w-2 tw-h-2 tw-absolute tw--left-1 tw--bottom-1 tw-bg-blue-500"
                                    style={{ cursor: Cursor.SW_RESIZE }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        this.props.onWidgetResizing("sw")
                                        this.setState({dragEnabled: false})
                                    }}
                                    onMouseUp={() => this.setState({dragEnabled: true})}
                                />
                                <div
                                    className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--bottom-1 tw-bg-blue-500"
                                    style={{ cursor: Cursor.SE_RESIZE }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        this.props.onWidgetResizing("se")
                                        this.setState({dragEnabled: false})
                                    }}
                                    onMouseUp={() => this.setState({dragEnabled: true})}
                                />

                            </div>

                        </div>


                    </div>
                </div>
            </WidgetDraggable>
        )

    }

}


export default Widget