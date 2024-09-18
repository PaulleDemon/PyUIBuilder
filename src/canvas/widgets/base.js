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

            showDroppableStyle: { // shows the droppable indicator
                allow: false, 
                show: false,
            },

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
                    tool: Tools.LAYOUT_MANAGER, // the tool to display, can be either HTML ELement or a constant string
                    value: {
                        layout: "flex",
                        direction: "vertical",
                        grid: {
                            rows: 1,
                            cols: 1
                        }
                    },
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

    }

    componentDidMount() {
        this.elementRef.current?.addEventListener("click", this.mousePress)
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

    setParent(parentId) {
        this._parent = parentId
    }

    addChild(childWidget) {

        childWidget.setParent(this.__id)
        this._children.push(childWidget)
    }

    removeChild(childId) {
        this._children = this._children.filter(function (item) {
            return item !== childId
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

    renderContent() {
        // throw new NotImplementedError("render method has to be implemented")
        return (
            <div className="tw-w-full tw-h-full tw-rounded-md tw-bg-red-500" style={this.state.widgetStyling}>
                {/* {this.props.children} */}
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

        // console.log("Drag enabled: ", this.state.dragEnabled)
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
                        data-container={"canvas"} // indicates how the canvas should handle dragging, one is sidebar other is canvas
                    >

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
                                    this.props.onWidgetResizing("nw")
                                    this.setState({dragEnabled: false})
                                }}
                                onMouseLeave={() => this.setState({dragEnabled: true})}
                            />
                            <div
                                className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--top-1 tw-bg-blue-500"
                                style={{ cursor: Cursor.SW_RESIZE }}
                                onMouseDown={(e) => {
                                    this.props.onWidgetResizing("ne")
                                    this.setState({dragEnabled: false})
                                }}
                                onMouseLeave={() => this.setState({dragEnabled: true})}
                            />
                            <div
                                className="tw-w-2 tw-h-2 tw-absolute tw--left-1 tw--bottom-1 tw-bg-blue-500"
                                style={{ cursor: Cursor.SW_RESIZE }}
                                onMouseDown={(e) => {
                                    this.props.onWidgetResizing("sw")
                                    this.setState({dragEnabled: false})
                                }}
                                onMouseLeave={() => this.setState({dragEnabled: true})}
                            />
                            <div
                                className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--bottom-1 tw-bg-blue-500"
                                style={{ cursor: Cursor.SE_RESIZE }}
                                onMouseDown={(e) => {
                                    this.props.onWidgetResizing("se")
                                    this.setState({dragEnabled: false})
                                }}
                                onMouseLeave={() => this.setState({dragEnabled: true})}
                            />

                        </div>



                    </div>
                </div>
            </WidgetDraggable>
        )

    }

}


export default Widget