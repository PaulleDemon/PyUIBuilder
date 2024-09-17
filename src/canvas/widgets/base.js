import React from "react"
import { NotImplementedError } from "../../utils/errors"

import Tools from "../constants/tools"
import Layouts from "../constants/layouts"
import Cursor from "../constants/cursor"
import { toSnakeCase } from "../utils/utils"
import EditableDiv from "../../components/editableDiv"
import DraggableWrapper from "../../components/draggable/draggable"
import DroppableWrapper from "../../components/draggable/droppable"

import { ActiveWidgetContext } from "../activeWidgetContext"
import { DragWidgetProvider } from "./draggableWidgetContext"
import WidgetDraggable from "./widgetDragDrop"


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

        this._parent = "" // id of the parent widget, default empty string
        this._children = [] // id's of all the child widgets

        this.minSize = { width: 50, height: 50 } // disable resizing below this number
        this.maxSize = { width: 500, height: 500 } // disable resizing above this number

        this.cursor = Cursor.POINTER

        this.icon = "" // antd icon name representing this widget

        this.elementRef = React.createRef()

        this.functions = {
            "load": { "args1": "number", "args2": "string" }
        }


        this.layout = Layouts.PACK
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
            resizing: false,
            resizeCorner: "",

            pos: { x: 0, y: 0 },
            size: { width: 100, height: 100 },
            position: "absolute",

            widgetStyling: {
                // use for widget's inner styling
            },

            attrs: {
                styling: {
                    backgroundColor: {
                        label: "Background Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "",
                        onChange: (value) => {
                            this.setWidgetStyling("backgroundColor", value)
                            this.setAttrValue("styling.backgroundColor", value)
                        }
                    },
                    foregroundColor: {
                        label: "Foreground Color",
                        tool: Tools.COLOR_PICKER,
                        value: "",
                    },
                    label: "Styling"
                },
                layout: {
                    label: "Layout",
                    tool: Tools.SELECT_DROPDOWN, // the tool to display, can be either HTML ELement or a constant string
                    value: "flex",
                    options: [
                        { value: "flex", label: "Flex" },
                        { value: "grid", label: "Grid" },
                        { value: "place", label: "Place" },
                    ],
                    onChange: (value) => this.setWidgetStyling("backgroundColor", value)
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


        this.startResizing = this.startResizing.bind(this)
        this.handleResize = this.handleResize.bind(this)
        this.stopResizing = this.stopResizing.bind(this)

    }

    componentDidMount() {
        this.elementRef.current?.addEventListener("click", this.mousePress)

        this.canvas.addEventListener("mousemove", this.handleResize)
        this.canvas.addEventListener("mouseup", this.stopResizing)
    }

    componentWillUnmount() {
        this.elementRef.current?.removeEventListener("click", this.mousePress)

        this.canvas.addEventListener("mousemove", this.handleResize)
        this.canvas.addEventListener("mouseup", this.stopResizing)
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

    /**
     * removes the element/widget
     */
    remove() {
        this.canvas.removeWidget(this.__id)
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

    setPos(x, y) {

        if (this.state.resizing) {
            // don't change position when resizing the widget
            return
        }

        this.setState({
            pos: { x, y }
        })

        // this.updateState({
        //     pos: { x, y }
        // })
    }

    setParent(parentId) {
        this._parent = parentId
    }

    addChild(childId) {
        this._children.push(childId)
    }

    removeChild(childId) {
        this._children = this._children.filter(function (item) {
            return item !== childId
        })
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

    startResizing(corner, event) {
        event.stopPropagation()
        this.setState({ resizing: true, resizeCorner: corner })
    }

    setZIndex(zIndex) {
        this.setState({
            zIndex: zIndex
        })
    }

    setWidgetName(name) {

        // this.setState((prev) => ({
        //     widgetName: name.length > 0 ? name : prev.widgetName
        // }))

        this.updateState({
            widgetName: name.length > 0 ? name : this.state.widgetName
        })
    }

    /**
     * 
     * @param {string} key - The string in react Style format
     * @param {string} value - Value of the style
     * @param {function():void} [callback] - optional callback, thats called after setting the internal state
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

    handleResize(event) {
        if (!this.state.resizing) return

        const { resizeCorner, size, pos } = this.state
        const deltaX = event.movementX
        const deltaY = event.movementY

        let newSize = { ...size }
        let newPos = { ...pos }

        const { width: minWidth, height: minHeight } = this.minSize
        const { width: maxWidth, height: maxHeight } = this.maxSize
        // console.log("resizing: ", deltaX, deltaY, event)

        switch (resizeCorner) {
            case "nw":
                newSize.width = Math.max(minWidth, Math.min(maxWidth, newSize.width - deltaX))
                newSize.height = Math.max(minHeight, Math.min(maxHeight, newSize.height - deltaY))
                newPos.x += (newSize.width !== size.width) ? deltaX : 0
                newPos.y += (newSize.height !== size.height) ? deltaY : 0
                break
            case "ne":
                newSize.width = Math.max(minWidth, Math.min(maxWidth, newSize.width + deltaX))
                newSize.height = Math.max(minHeight, Math.min(maxHeight, newSize.height - deltaY))
                newPos.y += (newSize.height !== size.height) ? deltaY : 0
                break
            case "sw":
                newSize.width = Math.max(minWidth, Math.min(maxWidth, newSize.width - deltaX))
                newSize.height = Math.max(minHeight, Math.min(maxHeight, newSize.height + deltaY))
                newPos.x += (newSize.width !== size.width) ? deltaX : 0
                break
            case "se":
                newSize.width = Math.max(minWidth, Math.min(maxWidth, newSize.width + deltaX))
                newSize.height = Math.max(minHeight, Math.min(maxHeight, newSize.height + deltaY))
                break
            default:
                break
        }

        // this.setState({ size: newSize, pos: newPos })
        this.updateState({
            size: newSize,
            pos: newPos
        })
    }

    stopResizing() {
        if (this.state.resizing) {
            this.setState({ resizing: false })
        }
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

    handleDragStart = (event) => {
        console.log("dragging event: ", event)
    }

    renderContent() {
        // throw new NotImplementedError("render method has to be implemented")
        return (
            <div className="tw-w-full tw-h-full tw-rounded-md tw-bg-red-500" style={this.state.widgetStyling}>

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
            position: "absolute", //  don't change this if it has to be movable on the canvas
            top: `${this.state.pos.y}px`,
            left: `${this.state.pos.x}px`,
            width: `${this.state.size.width}px`,
            height: `${this.state.size.height}px`,
        }

        let selectionStyle = {
            x: "-5px",
            y: "-5px",
            width: this.boundingRect.width + 5,
            height: this.boundingRect.height + 5
        }

        // console.log("selected: ", this.state.selected)
        return (
            <WidgetDraggable widgetRef={this.elementRef}>
                <div data-widget-id={this.__id} 
                        ref={this.elementRef} 
                        className="tw-absolute tw-shadow-xl tw-w-fit tw-h-fit"
                        style={outerStyle}
                        data-draggable-type={this.getWidgetType()} // helps with droppable 
                        data-container={"canvas"} // indicates how the canvas should handle dragging, one is sidebar other is canvas
                    >

                    {this.renderContent()}
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
                                onMouseDown={(e) => this.startResizing("nw", e)}
                            />
                            <div
                                className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--top-1 tw-bg-blue-500"
                                style={{ cursor: Cursor.SW_RESIZE }}
                                onMouseDown={(e) => this.startResizing("ne", e)}
                            />
                            <div
                                className="tw-w-2 tw-h-2 tw-absolute tw--left-1 tw--bottom-1 tw-bg-blue-500"
                                style={{ cursor: Cursor.SW_RESIZE }}
                                onMouseDown={(e) => this.startResizing("sw", e)}
                            />
                            <div
                                className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--bottom-1 tw-bg-blue-500"
                                style={{ cursor: Cursor.SE_RESIZE }}
                                onMouseDown={(e) => this.startResizing("se", e)}
                            />

                        </div>



                    </div>
                </div>
            </WidgetDraggable>
        )

    }

}


export default Widget