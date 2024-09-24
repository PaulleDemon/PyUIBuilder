import React from "react"
import { NotImplementedError } from "../../utils/errors"

import Tools from "../constants/tools"
import { Layouts, PosType } from "../constants/layouts"
import Cursor from "../constants/cursor"
import { toSnakeCase } from "../utils/utils"
import EditableDiv from "../../components/editableDiv"

import { ActiveWidgetContext } from "../activeWidgetContext"
import { DragWidgetProvider } from "./draggableWidgetContext"
import WidgetDraggable from "./widgetDragDrop"
import WidgetContainer from "../constants/containers"
import { DragContext } from "../../components/draggable/draggableContext"



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

        this.minSize = { width: 10, height: 10 } // disable resizing below this number
        this.maxSize = { width: 2000, height: 2000 } // disable resizing above this number

        this.cursor = Cursor.POINTER

        this.icon = "" // antd icon name representing this widget

        this.elementRef = React.createRef() // this is the outer ref for draggable area
        this.swappableAreaRef = React.createRef() // helps identify if the users intent is to swap or drop inside the widget
        this.innerAreaRef = React.createRef() // this is the inner area where swap is prevented and only drop is accepted

        this.functions = {
            "load": { "args1": "number", "args2": "string" }
        }

        // This indicates if the draggable can be dropped on this widget, set this to null to disable drops
        this.droppableTags = {} 
        
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

            isDragging: false, //  tells if the widget is currently being dragged
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

        this.getElement = this.getElement.bind(this)

        this.getId = this.getId.bind(this)

        this.getPos = this.getPos.bind(this)
        this.getSize = this.getSize.bind(this)
        this.getWidgetName = this.getWidgetName.bind(this)
        this.getWidgetType = this.getWidgetType.bind(this)
        this.getBoundingRect = this.getBoundingRect.bind(this)

        this.getAttrValue = this.getAttrValue.bind(this)

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

        // FIXME: initial layout is not set properly
        
        if (this.state.attrs.layout){
            this.setLayout(this.state.attrs.layout.value)
            console.log("prior layout: ", this.state.attrs.layout.value)
        }
        
        if (this.state.attrs.styling.backgroundColor)
            this.setWidgetStyling('backgroundColor', this.state.attrs.styling?.backgroundColor.value || "#fff")

        this.load(this.props.initialData || {}) // load the initial data


    }

    componentWillUnmount() {
    }

    updateState = (newState, callback) => {

        // FIXME: maximum recursion error when updating size, color etc
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

    getToolbarAttrs() {

        return ({
            id: this.__id,
            widgetName: {
                label: "Widget Name",
                tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                toolProps: { placeholder: "Widget name", maxLength: 40 },
                value: this.state.widgetName,
                onChange: (value) => this.setWidgetName(value)
            },
            size: {
                label: "Size",
                display: "horizontal",
                width: {
                    label: "Width",
                    tool: Tools.NUMBER_INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: { placeholder: "width", max: this.maxSize.width, min: this.minSize.width },
                    value: this.state.size.width || 100,
                    onChange: (value) => this.setWidgetSize(value, null)
                },
                height: {
                    label: "Height",
                    tool: Tools.NUMBER_INPUT,
                    toolProps: { placeholder: "height", max: this.maxSize.height, min: this.minSize.height },
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

    getId() {
        return this.__id
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

    setPosType(positionType) {

        if (!Object.values(PosType).includes(positionType)) {
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

        const keys = path.split('.')
        const lastKey = keys.pop()

        // Traverse the state and update the nested value immutably
        let newAttrs = { ...this.state.attrs }
        let nestedObject = newAttrs

        keys.forEach(key => {
            nestedObject[key] = { ...nestedObject[key] } // Ensure immutability
            nestedObject = nestedObject[key]
        })

        nestedObject[lastKey].value = value

        this.updateState({ attrs: newAttrs })
    }

    /**
     * Given the key as a path, retrieves the value for the widget attribute
     * @param {string} path - path to the key, eg: styling.backgroundColor
     * @returns {any} - the value at the given path
     */
    getAttrValue(path) {
        const keys = path.split('.')

        // Traverse the state and get the nested value
        let nestedObject = this.state.attrs

        for (const key of keys) {
            if (nestedObject[key] !== undefined) {
                nestedObject = nestedObject[key]
            } else {
                return undefined  // Return undefined if the key doesn't exist
            }
        }

        return nestedObject?.value  // Return the value (assuming it has a 'value' field)
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

    setLayout(value) {
        // FIXME: when the parent layout is place, the child widgets should have position absolute
        const { layout, direction, grid = { rows: 1, cols: 1 }, gap = 10 } = value

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

    setResize(pos, size) {
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

    enableDrag = () => {
        this.setState({
            dragEnabled: true
        })
    }

    disableDrag = () => {
        this.setState({
            dragEnabled: false
        })
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

        data = {...data} // create a shallow copy

        const {attrs, ...restData} = data

        // for (let [key, value] of Object.entries(attrs | {}))
        //     this.setAttrValue(key, value)

        // delete data.attrs

        this.setState(restData,  () => {
            // UPdates attrs
            let newAttrs = { ...this.state.attrs }

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
                nestedObject[lastKey].value = value
            })

            this.updateState({ attrs: newAttrs })

        })  

    }


    handleDragStart = (e, callback) => {
        e.stopPropagation()

        callback(this.elementRef?.current || null)

        // Create custom drag image with full opacity, this will ensure the image isn't taken from part of the canvas
        const dragImage = this.elementRef?.current.cloneNode(true)
        dragImage.style.opacity = '1' // Ensure full opacity
        dragImage.style.position = 'absolute'
        dragImage.style.top = '-9999px' // Move it out of view

        document.body.appendChild(dragImage)
        const rect = this.elementRef?.current.getBoundingClientRect()
        // snap to mouse pos
        // const offsetX = e.clientX - rect.left
        // const offsetY = e.clientY - rect.top

        // snap to middle
        const offsetX = rect.width / 2
        const offsetY = rect.height / 2

        // Set the custom drag image with correct offset to avoid snapping to the top-left corner
        e.dataTransfer.setDragImage(dragImage, offsetX, offsetY)


        // Remove the custom drag image after some time to avoid leaving it in the DOM
        setTimeout(() => {
            document.body.removeChild(dragImage)
        }, 0)

        // NOTE: this line will prevent problem's such as self-drop or dropping inside its own children
        setTimeout(this.disablePointerEvents, 1)

        this.setState({ isDragging: true })

    }

    handleDragEnter = (e, draggedElement, setOverElement) => {

        if (!draggedElement || !draggedElement.getAttribute("data-drag-start-within")){
            // if the drag is starting from outside (eg: file drop) or if drag doesn't exist
            return
        }

        const dragEleType = draggedElement.getAttribute("data-draggable-type")

        // console.log("Drag entering...", dragEleType, draggedElement, this.droppableTags)
        // FIXME:  the outer widget shouldn't be swallowed by inner widget
        if (draggedElement === this.elementRef.current) {
            // prevent drop on itself, since the widget is invisible when dragging, if dropped on itself, it may consume itself
            return
        }

        setOverElement(e.currentTarget) // provide context to the provider

        let showDrop = {
            allow: true,
            show: true
        }

        const allowDrop = (this.droppableTags && this.droppableTags !== null && (Object.keys(this.droppableTags).length === 0 ||
            (this.droppableTags.include?.length > 0 && this.droppableTags.include?.includes(dragEleType)) ||
            (this.droppableTags.exclude?.length > 0 && !this.droppableTags.exclude?.includes(dragEleType))
        ))

        if (allowDrop) {
            showDrop = {
                allow: true,
                show: true
            }

        } else {
            showDrop = {
                allow: false,
                show: true
            }
        }

        this.setState({
            showDroppableStyle: showDrop
        })

    }

    handleDragOver = (e, draggedElement) => {

        if (!draggedElement || !draggedElement.getAttribute("data-drag-start-within")){
            // if the drag is starting from outside (eg: file drop) or if drag doesn't exist
            return
        }

        if (draggedElement === this.elementRef.current) {
            // prevent drop on itself, since the widget is invisible when dragging, if dropped on itself, it may consume itself
            return
        }

        // console.log("Drag over: ", e.dataTransfer.getData("text/plain"), e.dataTransfer)
        const dragEleType = draggedElement.getAttribute("data-draggable-type")

        const allowDrop = (this.droppableTags && this.droppableTags !== null && (Object.keys(this.droppableTags).length === 0 ||
            (this.droppableTags.include?.length > 0 && this.droppableTags.include?.includes(dragEleType)) ||
            (this.droppableTags.exclude?.length > 0 && !this.droppableTags.exclude?.includes(dragEleType))
        ))

        if (allowDrop) {
            e.preventDefault() // NOTE: this is necessary to allow drop to take place
        }

    }

    handleDropEvent = (e, draggedElement, widgetClass = null) => {

        if (!draggedElement || !draggedElement.getAttribute("data-drag-start-within")){
            // if the drag is starting from outside (eg: file drop) or if drag doesn't exist
            return
        }

        e.preventDefault()
        e.stopPropagation()
    
        // FIXME: sometimes the elements showDroppableStyle is not gone, when dropping on the same widget
        this.setState({
            showDroppableStyle: {
                allow: false,
                show: false
            }
        }, () => {
            console.log("droppable cleared: ", this.elementRef.current, this.state.showDroppableStyle)
        })


        if (draggedElement === this.elementRef.current){
            // prevent drop on itself, since the widget is invisible when dragging, if dropped on itself, it may consume itself
            return 
        }

        let currentElement = e.currentTarget
        while (currentElement) {
            if (currentElement === draggedElement) {
                // if the parent is dropped accidentally into the child don't allow drop
                // console.log("Dropped into a descendant element, ignoring drop")
                return // Exit early to prevent the drop
            }
            currentElement = currentElement.parentElement // Traverse up to check ancestors
        }

        const container = draggedElement.getAttribute("data-container")

        const thisContainer = this.elementRef.current.getAttribute("data-container")
        // console.log("Dropped as swappable: ", e.target, this.swappableAreaRef.current.contains(e.target))
        // If swaparea is true, then it swaps instead of adding it as a child, also make sure that the parent widget(this widget) is on the widget and not on the canvas
        const swapArea = (this.swappableAreaRef.current.contains(e.target) && !this.innerAreaRef.current.contains(e.target) && thisContainer === WidgetContainer.WIDGET)

        const dragEleType = draggedElement.getAttribute("data-draggable-type")

        const allowDrop = (this.droppableTags && this.droppableTags !== null && (Object.keys(this.droppableTags).length === 0 ||
            (this.droppableTags.include?.length > 0 && this.droppableTags.include?.includes(dragEleType)) ||
            (this.droppableTags.exclude?.length > 0 && !this.droppableTags.exclude?.includes(dragEleType))
        ))

        if (!allowDrop && !swapArea) {
            // only if both swap and drop is not allowed return, if swap is allowed continue
            return  
        }
        // TODO: check if the drop is allowed
        if ([WidgetContainer.CANVAS, WidgetContainer.WIDGET].includes(container)) {
            // console.log("Dropped on meee: ", swapArea, this.swappableAreaRef.current.contains(e.target), thisContainer)

            this.props.onAddChildWidget({
                parentWidgetId: this.__id,
                dragElementID: draggedElement.getAttribute("data-widget-id"),
                swap: swapArea || false
            })

        } else if (container === WidgetContainer.SIDEBAR) {

            // console.log("Dropped on Sidebar: ", this.__id)
            this.props.onCreateWidgetRequest(widgetClass, ({ id, widgetRef }) => {
                this.props.onAddChildWidget({ parentWidgetId: this.__id, dragElementID: id }) //  if dragged from the sidebar create the widget first
            })

        }

    }


    handleDragLeave = (e, draggedElement) => {

        // console.log("Left: ", e.currentTarget, e.relatedTarget, draggedElement)

        if (!e.currentTarget.contains(draggedElement)) {
            this.setState({
                showDroppableStyle: {
                    allow: false,
                    show: false
                }
            })

        }
    }

    handleDragEnd = (callback) => {
        callback()
        this.setState({ isDragging: false })
        this.enablePointerEvents()
    }

    disablePointerEvents = () => {

        if (this.elementRef.current)
            this.elementRef.current.style.pointerEvents = "none"
    }

    enablePointerEvents = () => {
        if (this.elementRef.current)
            this.elementRef.current.style.pointerEvents = "auto"
    }

    /**
     * Note: you must implement this method in subclass, if you want children make sure to pass
     * {this.props.children}, to modify the style add this.state.widgetStyling
    */
    renderContent() {
        // throw new NotImplementedError("render method has to be implemented")
        return (
            <div className="tw-w-full tw-h-full tw-p-2 tw-content-start tw-rounded-md tw-overflow-hidden" style={this.state.widgetStyling}>
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
            opacity: this.state.isDragging ? 0.3 : 1,
        }
        // FIXME: if the parent container has tw-overflow-none, then the resizable indicator are also hidden
        return (

            <DragContext.Consumer>
                {
                    ({ draggedElement, widgetClass, onDragStart, onDragEnd, setOverElement }) => (

                        <div data-widget-id={this.__id}
                            ref={this.elementRef}
                            className="tw-shadow-xl tw-w-fit tw-h-fit"
                            style={outerStyle}
                            data-draggable-type={this.getWidgetType()} // helps with droppable 
                            data-container={this.state.widgetContainer} // indicates how the canvas should handle dragging, one is sidebar other is canvas

                            data-drag-start-within // this attribute indicates that the drag is occurring from within the project and not a outside file drop

                            draggable={this.state.dragEnabled}

                            onDragOver={(e) => this.handleDragOver(e, draggedElement)}
                            onDrop={(e) => this.handleDropEvent(e, draggedElement, widgetClass)}

                            onDragEnter={(e) => this.handleDragEnter(e, draggedElement, setOverElement)}
                            onDragLeave={(e) => this.handleDragLeave(e, draggedElement)}

                            onDragStart={(e) => this.handleDragStart(e, onDragStart)}
                            onDragEnd={(e) => this.handleDragEnd(onDragEnd)}
                        >
                            {/* FIXME: Swappable when the parent layout is flex/grid and gap is more, this trick won't work, add bg color to check */}
                            {/* FIXME: Swappable, when the parent layout is gap is 0, it doesn't work well */}
                            <div className="tw-relative tw-w-full tw-h-full tw-top-0 tw-left-0"
                            >
                                <div className={`tw-absolute tw-top-[-5px] tw-left-[-5px] 
                                                    tw-border-1 tw-opacity-0 tw-border-solid tw-border-black
                                                    tw-w-full tw-h-full
                                                    tw-scale-[1.1] tw-opacity-1 tw-z-[-1] `}
                                    style={{
                                        width: "calc(100% + 10px)",
                                        height: "calc(100% + 10px)",
                                    }}
                                    ref={this.swappableAreaRef}

                                >
                                    {/* helps with swappable: if the mouse is in this area while hovering/dropping, then swap */}
                                </div>
                                <div className="tw-relative tw-w-full tw-h-full" ref={this.innerAreaRef}>
                                    {this.renderContent()}
                                </div>
                                {
                                    // show drop style on drag hover
                                    this.state.showDroppableStyle.show &&
                                    <div className={`${this.state.showDroppableStyle.allow ? "tw-border-blue-600" : "tw-border-red-600"} 
                                                            tw-absolute tw-top-[-5px] tw-left-[-5px] tw-w-full tw-h-full tw-z-[2]
                                                            tw-border-2 tw-border-dashed  tw-rounded-lg tw-pointer-events-none

                                                            `}
                                        style={{
                                            width: "calc(100% + 10px)",
                                            height: "calc(100% + 10px)",
                                        }}
                                    >
                                    </div>
                                }

                                <div className={`tw-absolute tw-bg-transparent tw-top-[-10px] tw-left-[-10px] tw-opacity-100 
                                                tw-w-full tw-h-full tw-z-[-1]
                                                ${this.state.selected ? 'tw-border-2 tw-border-solid tw-border-blue-500' : 'tw-hidden'}`}
                                    style={{
                                        width: "calc(100% + 20px)",
                                        height: "calc(100% + 20px)",
                                    }}
                                >

                                    <div className={`"tw-relative tw-w-full  tw-h-full"`}> {/* ${this.state.isDragging ? "tw-pointer-events-none" : "tw-pointer-events-auto"} */}
                                        <EditableDiv value={this.state.widgetName} onChange={this.setWidgetName}
                                            maxLength={40}
                                            openEdit={this.state.enableRename}
                                            className="tw-text-sm tw-w-fit tw-max-w-[160px] tw-text-clip tw-min-w-[150px] 
                                                                    tw-overflow-hidden tw-absolute tw--top-6 tw-h-6"
                                        />

                                        <div
                                            className="tw-w-2 tw-h-2 tw-absolute  tw--left-1 tw--top-1 tw-bg-blue-500"
                                            style={{ cursor: Cursor.NW_RESIZE }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                                this.props.onWidgetResizing("nw")
                                                this.setState({ dragEnabled: false })
                                            }}
                                            onMouseUp={() => this.setState({ dragEnabled: true })}
                                        />
                                        <div
                                            className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--top-1 tw-bg-blue-500"
                                            style={{ cursor: Cursor.SW_RESIZE }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                                this.props.onWidgetResizing("ne")
                                                this.setState({ dragEnabled: false })
                                            }}
                                            onMouseUp={() => this.setState({ dragEnabled: true })}
                                        />
                                        <div
                                            className="tw-w-2 tw-h-2 tw-absolute tw--left-1 tw--bottom-1 tw-bg-blue-500"
                                            style={{ cursor: Cursor.SW_RESIZE }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                                this.props.onWidgetResizing("sw")
                                                this.setState({ dragEnabled: false })
                                            }}
                                            onMouseUp={() => this.setState({ dragEnabled: true })}
                                        />
                                        <div
                                            className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--bottom-1 tw-bg-blue-500"
                                            style={{ cursor: Cursor.SE_RESIZE }}
                                            onMouseDown={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                                this.props.onWidgetResizing("se")
                                                this.setState({ dragEnabled: false })
                                            }}
                                            onMouseUp={() => this.setState({ dragEnabled: true })}
                                        />

                                    </div>

                                </div>


                            </div>
                        </div>
                    )
                }

            </DragContext.Consumer>
        )

    }

}


export default Widget