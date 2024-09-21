import React from "react"

import { DndContext } from '@dnd-kit/core'

import { CloseOutlined, DeleteOutlined, EditOutlined, FullscreenOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Tooltip, Dropdown } from "antd"

import Droppable from "../components/utils/droppableDnd"
import Widget from "./widgets/base"
import Cursor from "./constants/cursor"

import CanvasToolBar from "./toolbar"

import { UID } from "../utils/uid"
import { removeDuplicateObjects } from "../utils/common"

import { WidgetContext } from './context/widgetContext'
// import {ReactComponent as DotsBackground} from "../assets/background/dots.svg"

// import DotsBackground from "../assets/background/dots.svg"
import { ReactComponent as DotsBackground } from "../assets/background/dots.svg"

import DroppableWrapper from "../components/draggable/droppable"
import { ActiveWidgetContext, ActiveWidgetProvider, withActiveWidget } from "./activeWidgetContext"
import { DragWidgetProvider } from "./widgets/draggableWidgetContext"
import { PosType } from "./constants/layouts"
import WidgetContainer from "./constants/containers"

// const DotsBackground = require("../assets/background/dots.svg")


const CanvasModes = {
    DEFAULT: 0,
    PAN: 1,
    MOVE_WIDGET: 2 // when the mode is move widget
}


class Canvas extends React.Component {

    // static contextType = ActiveWidgetContext

    constructor(props) {
        super(props)

        const { canvasWidgets, onWidgetListUpdated } = props

        this.canvasRef = React.createRef()
        this.canvasContainerRef = React.createRef()


        this.currentMode = CanvasModes.DEFAULT

        this.minCanvasSize = { width: 500, height: 500 }

        this.mousePressed = false
        this.mousePos = {
            x: 0,
            y: 0
        }

        // this._contextMenuItems = []
        this.widgetRefs = {} // stores the actual refs to the widgets inside the canvas {id: ref, id2, ref2...}

        this.state = {
            widgetResizing: "", // set this to "nw", "sw" etc based on the side when widgets resizing handles are selected
            widgets: [], // stores the mapping to widgetRefs, stores id and WidgetType, later used for rendering [{id: , widgetType: WidgetClass, children: [], parent: "", initialData: {}}]
            zoom: 1,
            isPanning: false,
            currentTranslate: { x: 0, y: 0 },
            canvasSize: { width: 500, height: 500 },

            contextMenuItems: [],
            selectedWidget: null,

            toolbarOpen: true,
            toolbarAttrs: null
        }

        this._onWidgetListUpdated = onWidgetListUpdated // a function callback when the widget is added to the canvas

        this.resetTransforms = this.resetTransforms.bind(this)
        this.renderWidget = this.renderWidget.bind(this)

        this.mouseDownEvent = this.mouseDownEvent.bind(this)
        this.mouseMoveEvent = this.mouseMoveEvent.bind(this)
        this.mouseUpEvent = this.mouseUpEvent.bind(this)
        this.keyDownEvent = this.keyDownEvent.bind(this)
        this.wheelZoom = this.wheelZoom.bind(this)

        this.onActiveWidgetUpdate = this.onActiveWidgetUpdate.bind(this)

        this.getWidgets = this.getWidgets.bind(this)
        this.getActiveObjects = this.getActiveObjects.bind(this)
        this.getWidgetFromTarget = this.getWidgetFromTarget.bind(this)

        this.getCanvasObjectsBoundingBox = this.getCanvasObjectsBoundingBox.bind(this)
        this.fitCanvasToBoundingBox = this.fitCanvasToBoundingBox.bind(this)

        this.getCanvasContainerBoundingRect = this.getCanvasContainerBoundingRect.bind(this)
        this.getCanvasBoundingRect = this.getCanvasBoundingRect.bind(this)

        this.setSelectedWidget = this.setSelectedWidget.bind(this)
        this.deleteSelectedWidgets = this.deleteSelectedWidgets.bind(this)
        this.removeWidget = this.removeWidget.bind(this)
        this.clearSelections = this.clearSelections.bind(this)
        this.clearCanvas = this.clearCanvas.bind(this)

        // this.updateCanvasDimensions = this.updateCanvasDimensions.bind(this) 
    }

    componentDidMount() {
        this.initEvents()

        this.createWidget(Widget)

    }

    componentWillUnmount() {

        this.canvasContainerRef.current.removeEventListener("mousedown", this.mouseDownEvent)
        this.canvasContainerRef.current.removeEventListener("mouseup", this.mouseUpEvent)
        this.canvasContainerRef.current.removeEventListener("mousemove", this.mouseMoveEvent)
        this.canvasContainerRef.current.removeEventListener("wheel", this.wheelZoom)

        this.canvasContainerRef.current.removeEventListener("keydown", this.keyDownEvent)


        // NOTE: this will clear the canvas
        this.clearCanvas()
    }

    initEvents() {

        this.canvasContainerRef.current.addEventListener("mousedown", this.mouseDownEvent)
        this.canvasContainerRef.current.addEventListener("mouseup", this.mouseUpEvent)
        this.canvasContainerRef.current.addEventListener("mousemove", this.mouseMoveEvent)
        this.canvasContainerRef.current.addEventListener("wheel", this.wheelZoom)


        this.canvasContainerRef.current.addEventListener("keydown", this.keyDownEvent, true)
        // window.addEventListener("keydown", this.keyDownEvent, true)


    }

    applyTransform() {
        const { currentTranslate, zoom } = this.state
        this.canvasRef.current.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${zoom})`
    }

    /**
    * 
    * @returns  {import("./widgets/base").Widget[]}
    */
    getWidgets() {

        return this.state.widgets
    }

    /**
     * returns list of active objects / selected objects on the canvas
     * @returns Widget[]
     */
    getActiveObjects() {
        return Object.values(this.widgetRefs).filter((widgetRef) => {
            return widgetRef.current?.isSelected()
        })
    }


    /**
     * returns the widget that contains the target
     * @param {HTMLElement} target 
     * @returns {Widget}
     */
    getWidgetFromTarget(target) {
        // TODO: improve search, currently O(n), but can be improved via this.state.widgets or something

        let innerWidget = null
        // FIXME: target selection not accurate when there is inner child involved
        for (let [key, ref] of Object.entries(this.widgetRefs)) {
            console.log("key: ", key, innerWidget)
            if (ref.current.getElement().contains(target)) {

                if (!innerWidget) {
                    innerWidget = ref.current
                } else if (innerWidget.getElement().contains(ref.current.getElement())) {
                    // If the current widget is deeper than the existing innermost widget, update innerWidget
                    innerWidget = ref.current
                }
            }
        }

        return innerWidget
        // for (let [key, ref] of Object.entries(this.widgetRefs)) {
        //     console.log("ref: ", ref, key)
        //     if (ref.current.getElement().contains(target)) {
        //         return ref.current
        //     }
        // }


        // const returnTargetWidget = (widgets) => {
        //     for (let x of widgets) {
        //         const widget = this.widgetRefs[x.id]

        //         // Check if the widget contains the target
        //         if (widget && widget.current.getElement().contains(target)) {
        //             // If it has children, continue checking the children for the innermost match
        //             const childWidget = returnTargetWidget(x.children)

        //             // Return the innermost child widget if found, otherwise return the current widget
        //             return childWidget || widget.current
        //         }
        //     }
        //     // If no matching widget is found, return null
        //     return null
        // }


        // return returnTargetWidget(this.state.widgets)

    }

    keyDownEvent(event) {

        if (event.key === "Delete") {
            this.deleteSelectedWidgets()
        }

        if (event.key === "+") {
            this.setZoom(this.state.zoom + 0.1)
        }

        if (event.key === "-") {
            this.setZoom(this.state.zoom - 0.1)
        }

    }

    mouseDownEvent(event) {

        this.mousePos = { x: event.clientX, y: event.clientY }

        let selectedWidget = this.getWidgetFromTarget(event.target)
        // console.log("selected widget: ", selectedWidget)
        if (event.button === 0) {
            this.mousePressed = true

            // FIXME: the inner widgets are not selected properly
            if (selectedWidget) {
                console.log("selected widget: ", selectedWidget.getId(), selectedWidget.getElement())
                // if the widget is selected don't pan, instead move the widget
                if (!selectedWidget._disableSelection) {
                    console.log("selected widget: ", selectedWidget.getId(), this.state.selectedWidget?.getId())

                    if (!this.state.selectedWidget || (selectedWidget.getId() !== this.state.selectedWidget?.getId())) {
                        this.state.selectedWidget?.deSelect() // deselect the previous widget before adding the new one
                        this.state.selectedWidget?.setZIndex(0)

                        selectedWidget.setZIndex(1000)
                        selectedWidget.select()
                        console.log("widget selected")
                        this.setState({
                            selectedWidget: selectedWidget,
                            toolbarAttrs: selectedWidget.getToolbarAttrs()
                        })
                    }
                    this.currentMode = CanvasModes.MOVE_WIDGET
                }

                this.currentMode = CanvasModes.PAN

            } else if (!selectedWidget) {
                // get the canvas ready to pan, if there are widgets on the canvas
                this.clearSelections()
                this.currentMode = CanvasModes.PAN
                this.setCursor(Cursor.GRAB)
                console.log("clear selection")
            }

            this.setState({
                contextMenuItems: [],
                toolbarOpen: true
            })
            // this.setState({
            //     showContextMenu: false
            // })
        } else if (event.button === 2) {
            //right click

            if (this.state.selectedWidget && this.state.selectedWidget.__id !== selectedWidget.__id) {
                this.clearSelections()
            }

            if (selectedWidget) {

                this.setState({
                    selectedWidget: selectedWidget,
                    contextMenuItems: [
                        {
                            key: "rename",
                            label: (<div onClick={() => selectedWidget.openRenaming()}><EditOutlined /> Rename</div>),
                            icons: <EditOutlined />,
                        },
                        {
                            key: "delete",
                            label: (<div onClick={() => this.deleteSelectedWidgets([selectedWidget])}><DeleteOutlined /> Delete</div>),
                            icons: <DeleteOutlined />,
                            danger: true
                        }
                    ]
                })

            }

        }

    }

    mouseMoveEvent(event) {

        if (this.state.widgetResizing !== "") {
            // if resizing is taking place don't do anything else
            this.handleResize(event)
            return
        }

        // console.log("mode: ", this.currentMode, this.getActiveObjects())
        if (this.mousePressed && [CanvasModes.PAN, CanvasModes.MOVE_WIDGET].includes(this.currentMode)) {
            const deltaX = event.clientX - this.mousePos.x
            const deltaY = event.clientY - this.mousePos.y

            if (!this.state.selectedWidget) {
                // if there aren't any selected widgets, then pan the canvas
                this.setState(prevState => ({
                    currentTranslate: {
                        x: prevState.currentTranslate.x + deltaX,
                        y: prevState.currentTranslate.y + deltaY,
                    }
                }), this.applyTransform)

            } else {
                // update the widgets position
                // this.state.selectedWidgets.forEach(widget => {
                //     const {x, y} = widget.getPos()

                //     const newPosX = x + (deltaX/this.state.zoom) // account for the zoom, since the widget is relative to canvas
                //     const newPosY = y + (deltaY/this.state.zoom) // account for the zoom, since the widget is relative to canvas
                //     widget.setPos(newPosX, newPosY)
                // })
            }


            this.mousePos = { x: event.clientX, y: event.clientY }

            this.setCursor(Cursor.GRAB)
        }
    }

    mouseUpEvent(event) {
        this.mousePressed = false
        this.currentMode = CanvasModes.DEFAULT
        this.setCursor(Cursor.DEFAULT)

        if (this.state.widgetResizing) {
            this.setState({ widgetResizing: "" })
        }

        for (let [key, widget] of Object.entries(this.widgetRefs)) {
            // since the mouseUp event is not triggered inside the widget once its outside, 
            // we'll need a global mouse up event to re-enable drag
            widget.current.enableDrag()
        }
    }

    wheelZoom(event) {
        let delta = event.deltaY
        let zoom = this.state.zoom * 0.999 ** delta

        this.setZoom(zoom, { x: event.offsetX, y: event.offsetY })
    }

    /**
     * handles widgets resizing
     * @param {MouseEvent} event - mouse move event 
     * @returns 
     */
    handleResize = (event) => {
        if (this.state.resizing === "") return

        const widget = this.state.selectedWidget

        if (!widget) return
        const resizeCorner = this.state.widgetResizing
        const size = widget.getSize()
        const pos = widget.getPos()

        const deltaX = event.movementX
        const deltaY = event.movementY

        let newSize = { ...size }
        let newPos = { ...pos }

        const { width: minWidth, height: minHeight } = widget.minSize
        const { width: maxWidth, height: maxHeight } = widget.maxSize
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

        widget.setResize(newPos, newSize)
    }

    getCanvasContainerBoundingRect() {
        return this.canvasContainerRef.current.getBoundingClientRect()
    }

    getCanvasBoundingRect() {
        return this.canvasRef.current.getBoundingClientRect()
    }

    getCanvasTranslation() {
        return this.state.currentTranslate
    }

    /**
     * fits the canvas size to fit the widgets bounding box
     */
    fitCanvasToBoundingBox(padding = 0) {
        const { top, left, right, bottom } = this.getCanvasObjectsBoundingBox()

        const width = right - left
        const height = bottom - top

        const newWidth = Math.max(width + padding, this.minCanvasSize.width)
        const newHeight = Math.max(height + padding, this.minCanvasSize.height)

        const canvasStyle = this.canvasRef.current.style

        // Adjust the canvas dimensions
        canvasStyle.width = `${newWidth}px`
        canvasStyle.height = `${newHeight}px`

        // Adjust the canvas position if needed
        canvasStyle.left = `${left - padding}px`
        canvasStyle.top = `${top - padding}px`
    }

    setCursor(cursor) {
        this.canvasContainerRef.current.style.cursor = cursor
    }

    setZoom(zoom, pos) {

        const { currentTranslate } = this.state

        let newTranslate = currentTranslate

        if (pos) {
            // Calculate the new translation to zoom into the mouse position
            const offsetX = pos.x - (this.canvasContainerRef.current.clientWidth / 2 + currentTranslate.x)
            const offsetY = pos.y - (this.canvasContainerRef.current.clientHeight / 2 + currentTranslate.y)

            const newTranslateX = currentTranslate.x - offsetX * (zoom - this.state.zoom)
            const newTranslateY = currentTranslate.y - offsetY * (zoom - this.state.zoom)
            newTranslate = {
                x: newTranslateX,
                y: newTranslateY
            }
        }

        this.setState({
            zoom: Math.max(0.5, Math.min(zoom, 1.5)), // clamp between 0.5 and 1.5
            currentTranslate: newTranslate
        }, this.applyTransform)


    }

    getZoom() {
        return this.state.zoom
    }

    resetTransforms() {
        this.setState({
            zoom: 1,
            currentTranslate: { x: 0, y: 0 }
        }, this.applyTransform)
    }

    setSelectedWidget(selectedWidget) {
        this.setState({ selectedWidget: [selectedWidget] })
    }

    clearSelections() {

        if (!this.state.selectedWidget)
            return

        this.getActiveObjects().forEach(widget => {
            widget.current?.deSelect()
        })

        // this.context?.updateActiveWidget("")
        // this.context.updateToolAttrs({})

        this.setState({
            selectedWidget: null,
            toolbarAttrs: null,
            // toolbarOpen: 
        })

    }

    /**
     * returns tha combined bounding rect of all the widgets on the canvas
     * 
     */
    getCanvasObjectsBoundingBox() {

        // Initialize coordinates to opposite extremes
        let top = Number.POSITIVE_INFINITY
        let left = Number.POSITIVE_INFINITY
        let right = Number.NEGATIVE_INFINITY
        let bottom = Number.NEGATIVE_INFINITY

        for (let widget of Object.values(this.widgetRefs)) {
            const rect = widget.current.getBoundingRect()
            // Update the top, left, right, and bottom coordinates
            if (rect.top < top) top = rect.top
            if (rect.left < left) left = rect.left
            if (rect.right > right) right = rect.right
            if (rect.bottom > bottom) bottom = rect.bottom
        }

        return { top, left, right, bottom }
    }


    /**
     * finds widgets from the list of this.state.widgets, also checks the children to find the widgets
     * @param {string} widgetId 
     * @returns 
     */
    findWidgetFromListById = (widgetId) => {

        const searchWidgetById = (widgets, widgetId) => {
            for (let widget of widgets) {
                if (widget.id === widgetId) {
                    return widget
                }

                // Recursively search in children
                if (widget.children.length > 0) {
                    const foundInChildren = searchWidgetById(widget.children, widgetId)
                    if (foundInChildren) {
                        return foundInChildren // Found in children
                    }
                }
            }
            return null // Widget not found
        }

        return searchWidgetById(this.state.widgets, widgetId)
    }

    /**
     * Finds the widget from the list and removes it from its current position, even if the widget is in the child position
     * @param {Array} widgets - The current list of widgets
     * @param {string} widgetId - The ID of the widget to remove
     * @returns {Array} - The updated widgets list
     */
    removeWidgetFromCurrentList = (widgetId) => {

        function recursiveRemove(objects) {
            return objects
                .map(obj => {
                    if (obj.id === widgetId) {
                        return null // Remove the object
                    }
                    // Recursively process children
                    if (obj.children && obj.children.length > 0) {
                        obj.children = recursiveRemove(obj.children).filter(Boolean)
                    }
                    return obj
                })
                .filter(Boolean) // Remove any nulls from the array
        }

        // Start the recursive removal from the top level
        return recursiveRemove(this.state.widgets)

    }

    // Helper function for recursive update
    updateWidgetRecursively = (widgets, updatedParentWidget, updatedChildWidget) => {
        return widgets.map(widget => {
            if (widget.id === updatedParentWidget.id) {
                return updatedParentWidget // Update the parent widget
            } else if (widget.id === updatedChildWidget.id) {
                return updatedChildWidget // Update the child widget
            } else if (widget.children && widget.children.length > 0) {
                // Recursively update the children if they exist
                return {
                    ...widget,
                    children: this.updateWidgetRecursively(widget.children, updatedParentWidget, updatedChildWidget)
                }
            } else {
                return widget // Leave other widgets unchanged
            }
        })
    }

    /**
     * Adds the child into the children attribute inside the this.widgets list of objects
     *  //  widgets data structure { id, widgetType: widgetComponentType, children: [], parent: "" }
     * @param {string} parentWidgetId 
     * @param {object} dragElement 
     * @param {boolean} create - if create is set to true the widget will be created before adding to the child tree
     */
    handleAddWidgetChild = ({ parentWidgetId, dragElementID, create = false, swap = false }) => {

        // TODO: creation of the child widget if its not created
        // widgets data structure { id, widgetType: widgetComponentType, children: [], parent: "" }
        const dropWidgetObj = this.findWidgetFromListById(parentWidgetId)
        // Find the dragged widget object
        let dragWidgetObj = this.findWidgetFromListById(dragElementID)

        if (dropWidgetObj && dragWidgetObj) {
            const dragWidget = this.widgetRefs[dragWidgetObj.id]
            const dragData = dragWidget.current.serialize()


            if (swap) {
                // If swapping, we need to find the common parent
                const grandParentWidgetObj = this.findWidgetFromListById(dropWidgetObj.parent)
                // console.log("parent widget: ", grandParentWidgetObj, dropWidgetObj, this.state.widgets)
                if (grandParentWidgetObj) {
                    // Find the indices of the dragged and drop widgets in the grandparent's children array
                    const dragIndex = grandParentWidgetObj.children.findIndex(child => child.id === dragElementID)
                    const dropIndex = grandParentWidgetObj.children.findIndex(child => child.id === parentWidgetId)

                    if (dragIndex !== -1 && dropIndex !== -1) {
                        // Swap their positions
                        let childrenCopy = [...grandParentWidgetObj.children]
                        const temp = childrenCopy[dragIndex]
                        childrenCopy[dragIndex] = childrenCopy[dropIndex]
                        childrenCopy[dropIndex] = temp

                        // Update the grandparent with the swapped children
                        const updatedGrandParentWidget = {
                            ...grandParentWidgetObj,
                            children: childrenCopy
                        }

                        // Update the state with the new widget hierarchy
                        this.setState((prevState) => ({
                            widgets: this.updateWidgetRecursively(prevState.widgets, updatedGrandParentWidget)
                        }))
                    }
                }
            } else {
                // Non-swap mode: Add the dragged widget as a child of the drop widget
                let updatedWidgets = this.removeWidgetFromCurrentList(dragElementID)

                const updatedDragWidget = {
                    ...dragWidgetObj,
                    parent: dropWidgetObj.id, // Keep the parent reference
                    initialData: {
                        ...dragData,
                        positionType: PosType.NONE,
                        zIndex: 0,
                        widgetContainer: WidgetContainer.WIDGET
                    }
                }

                const updatedDropWidget = {
                    ...dropWidgetObj,
                    children: [...dropWidgetObj.children, updatedDragWidget]
                }


                // Recursively update the widget structure
                updatedWidgets = this.updateWidgetRecursively(updatedWidgets, updatedDropWidget, updatedDragWidget)

                // Update the state with the new widget hierarchy
                this.setState({
                    widgets: updatedWidgets
                })
            }
        }

    }

    /**
     * 
     * @param {Widget} widgetComponentType - don't pass <Widget /> instead pass Widget object/class
     */
    createWidget(widgetComponentType, callback) {
        const widgetRef = React.createRef()

        const id = `${widgetComponentType.widgetType}_${UID()}`

        // Store the ref in the instance variable
        this.widgetRefs[id] = widgetRef

        const newWidget = {
            id,
            widgetType: widgetComponentType,
            children: [],
            parent: "",
            initialData: {} //  useful for serializing and deserializing (aka, saving and loading)
        }

        const widgets = [...this.state.widgets, newWidget] // don't add the widget refs in the state

        // Update the state to include the new widget's type and ID
        this.setState({
            widgets: widgets
        }, () => {
            if (callback)
                callback({ id, widgetRef })

            if (this._onWidgetListUpdated)
                this._onWidgetListUpdated(widgets) // inform the parent container
        })

        return { id, widgetRef }
    }

    getWidgetById(id) {

        return this.widgetRefs[id]
    }

    /**
     * delete's the selected widgets from the canvas
     * @param {null|Widget} widgets - optional widgets that can be deleted along the selected widgets
     */
    deleteSelectedWidgets(widgets = []) {


        let activeWidgets = removeDuplicateObjects([...widgets, this.state.selectedWidget], "__id")

        const widgetIds = activeWidgets.map(widget => widget.__id)

        for (let widgetId of widgetIds) {

            // this.widgetRefs[widgetId]?.current.remove()
            delete this.widgetRefs[widgetId]

            this.setState((prevState) => ({
                widgets: prevState.widgets.filter(widget => widget.id !== widgetId)
            }), () => {

                if (this._onWidgetListUpdated)
                    this._onWidgetListUpdated(this.state.widgets)
            })
            // value.current?.remove()
        }



    }

    /**
     * removes all the widgets from the canvas
     */
    clearCanvas() {

        // NOTE: Don't remove from it using remove() function since, it already removed from the DOM tree when its removed from widgets

        this.widgetRefs = {}
        this.setState({
            widgets: []
        })

        if (this._onWidgetListUpdated)
            this._onWidgetListUpdated([])
    }

    removeWidget(widgetId) {

        // FIXME: need to delete the child widgets
        // IDEA: find the widget first, check for the parent, if parent exist remove it from the parents children list
        // this.widgetRefs[widgetId]?.current.remove()

        //this.removeWidgetFromCurrentList(widgetID) <--- use this
        delete this.widgetRefs[widgetId]

        const widgets = this.state.widgets.filter(widget => widget.id !== widgetId)

        this.setState({
            widgets: widgets
        })

        if (this._onWidgetListUpdated)
            this._onWidgetListUpdated(widgets)
    }

    onActiveWidgetUpdate(widgetId) {

        if (!this.state.selectedWidget || widgetId !== this.state.selectedWidget.__id)
            return

        // console.log("updating...", this.state.toolbarAttrs, this.state.selectedWidget.getToolbarAttrs())

        // console.log("attrs: ", this.state.selectedWidgets.at(0).getToolbarAttrs())

        this.setState({
            toolbarAttrs: this.state.selectedWidget.getToolbarAttrs()
        })

    }

    /**
     * Handles drop event to canvas from the sidebar and on canvas widget movement
     * @param {DragEvent} e 
     */
    handleDropEvent = (e, draggedElement) => {

        e.preventDefault()

        const container = draggedElement.getAttribute("data-container")
        const canvasRect = this.canvasRef.current.getBoundingClientRect()
        
        const draggedElementRect = draggedElement.getBoundingClientRect()
        const elementWidth = draggedElementRect.width
        const elementHeight = draggedElementRect.height

        const { clientX, clientY } = e

        // const finalPosition = {
        //     x: (clientX - canvasRect.left) / this.state.zoom,
        //     y: (clientY - canvasRect.top) / this.state.zoom,
        // }
        
        // snaps to center
        const finalPosition = {
            x: (clientX - canvasRect.left) / this.state.zoom - (elementWidth / 2) / this.state.zoom,
            y: (clientY - canvasRect.top) / this.state.zoom - (elementHeight / 2) / this.state.zoom,
        }
        
        if (container === WidgetContainer.SIDEBAR) {
            // TODO: handle drop from sidebar
            // if the widget is being dropped from the sidebar, use the info to create the widget first
            this.createWidget(Widget, ({ id, widgetRef }) => {
                widgetRef.current.setPos(finalPosition.x, finalPosition.y)
            })

        } else if ([WidgetContainer.CANVAS, WidgetContainer.WIDGET].includes(container)) {

            let widgetId = draggedElement.getAttribute("data-widget-id")

            const widgetObj = this.getWidgetById(widgetId)
            // console.log("WidgetObj: ", widgetObj)
            if (container === WidgetContainer.CANVAS) {

                widgetObj.current.setPos(finalPosition.x, finalPosition.y)

            } else if (container === WidgetContainer.WIDGET) {

                // if the widget was inside another widget move it outside 
                let childWidgetObj = this.findWidgetFromListById(widgetObj.current.getId())
                let parentWidgetObj = this.findWidgetFromListById(childWidgetObj.parent)

                const childData = widgetObj.current.serialize() // save the data and pass it the updated child object

                // remove child from current position

                // console.log("pre updated widgets: ", updatedWidgets)

                const updatedChildWidget = {
                    ...childWidgetObj,
                    parent: "",
                    initialData: {
                        ...childData,
                        pos: { x: finalPosition.x, y: finalPosition.y },
                        positionType: PosType.ABSOLUTE, // makes sure that after dropping the position is set to absolute value
                        zIndex: 0,
                        widgetContainer: WidgetContainer.CANVAS
                    }
                }

                let updatedWidgets = this.removeWidgetFromCurrentList(widgetObj.current.getId())


                // Create a new copy of the parent widget with the child added
                const updatedParentWidget = {
                    ...parentWidgetObj,
                    // children: parentWidgetObj.children.filter(child => child.id !== childWidgetObj.id)
                }


                updatedWidgets = updatedWidgets.map(widget => {
                    if (widget.id === parentWidgetObj.id) {
                        return updatedParentWidget // Update the parent widget with the child removed
                    } else {
                        return widget // Leave other widgets unchanged
                    }
                })


                this.setState({
                    widgets: [...updatedWidgets, updatedChildWidget]
                })

            }
        }

    }



    renderWidget = (widget) => {

        const { id, widgetType: ComponentType, children = [], parent, initialData = {} } = widget


        const renderChildren = (childrenData) => {
            // recursively render the child elements
            return childrenData.map((child) => {
                const childWidget = this.findWidgetFromListById(child.id)
                // console.log("Found the child : ", childWidget)
                if (childWidget) {
                    return this.renderWidget(childWidget) // Recursively render child widgets
                }
                return null
            })
        }


        return (
            <ComponentType
                key={id}
                id={id}
                ref={this.widgetRefs[id]}
                initialData={initialData}
                canvasRef={this.canvasContainerRef}
                onWidgetUpdate={this.onActiveWidgetUpdate}
                onAddChildWidget={this.handleAddWidgetChild}
                onWidgetResizing={(resizeSide) => this.setState({ widgetResizing: resizeSide })}
            >
                {/* Render children inside the parent with layout applied */}
                {renderChildren(children)}
            </ComponentType>
        )
    }

    render() {
        return (
            <div className="tw-relative tw-flex tw-w-full tw-h-full tw-max-h-[100vh]">

                <div className="tw-absolute tw-p-2 tw-bg-white tw-z-10 tw-min-w-[100px] tw-h-[50px] tw-gap-2 
                                    tw-top-4 tw-place-items-center tw-right-4 tw-shadow-md tw-rounded-md tw-flex">

                    <Tooltip title="Reset viewport">
                        <Button icon={<ReloadOutlined />} onClick={this.resetTransforms} />
                    </Tooltip>
                    <Tooltip title="Clear canvas">
                        <Button danger icon={<DeleteOutlined />} onClick={this.clearCanvas} />
                    </Tooltip>
                </div>

                {/* <ActiveWidgetProvider> */}
                <DroppableWrapper id="canvas-droppable"
                    className="tw-w-full tw-h-full"
                    onDrop={this.handleDropEvent}>
                    {/* <DragWidgetProvider> */}
                    <Dropdown trigger={['contextMenu']} mouseLeaveDelay={0} menu={{ items: this.state.contextMenuItems, }}>
                        <div className="tw-w-full tw-h-full tw-outline-none tw-flex tw-relative tw-bg-[#f2f2f2] tw-overflow-hidden"
                            ref={this.canvasContainerRef}
                            style={{
                                transition: " transform 0.3s ease-in-out",
                                backgroundImage: `url(${DotsBackground})`,
                                backgroundSize: 'cover', // Ensure proper sizing if needed
                                backgroundRepeat: 'no-repeat',
                            }}
                            tabIndex={0} // allow focus
                        >
                            <DotsBackground
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundSize: 'cover'
                                }}
                            />
                            {/* Canvas */}
                            <div data-canvas className="tw-w-full tw-h-full tw-absolute tw-top-0 tw-select-none
                                                            "
                                ref={this.canvasRef}>
                                <div className="tw-relative tw-w-full tw-h-full">
                                    {
                                        this.state.widgets.map(this.renderWidget)
                                    }
                                </div>
                            </div>
                        </div>
                    </Dropdown>
                    {/* </DragWidgetProvider> */}
                </DroppableWrapper>

                <CanvasToolBar isOpen={this.state.toolbarOpen}
                    widgetType={this.state.selectedWidget?.getWidgetType() || ""}
                    attrs={this.state.toolbarAttrs}
                />
                {/* </ActiveWidgetProvider> */}
            </div>
        )
    }
}

export default Canvas
