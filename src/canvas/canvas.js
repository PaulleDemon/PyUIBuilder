import React from "react"

import {DndContext} from '@dnd-kit/core'

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

import DotsBackground from "../assets/background/dots.svg"
import DroppableWrapper from "../components/draggable/droppable"

// const DotsBackground = require("../assets/background/dots.svg")

const CanvasModes = {
    DEFAULT: 0,
    PAN: 1,
    MOVE_WIDGET: 2 // when the mode is move widget
}


class Canvas extends React.Component {

    constructor(props) {
        super(props)

        const { canvasWidgets, onWidgetListUpdated } = props
        
        this.canvasRef = React.createRef()  
        this.canvasContainerRef = React.createRef()

        this.widgetRefs = {} // stores the actual refs to the widgets inside the canvas

    
        this.currentMode = CanvasModes.DEFAULT

        this.minCanvasSize = {width: 500, height: 500}

        this.mousePressed = false
        this.mousePos = {
            x: 0,
            y: 0
        }

        // this._contextMenuItems = []

        this.state = {
            widgets: [], //  don't store the refs directly here, instead store it in widgetRef, store the widget type here
            zoom: 1,
            isPanning: false,
            currentTranslate: { x: 0, y: 0 },
            canvasSize:  { width: 500, height: 500 },
            
            contextMenuItems: [],
            selectedWidgets: [],
            
            toolbarOpen: true,  
            toolbarAttrs: null
        }

        this._onWidgetListUpdated = onWidgetListUpdated // a function callback when the widget is added to the canvas

        this.resetTransforms = this.resetTransforms.bind(this)
        this.renderWidget = this.renderWidget.bind(this)
        
        this.mouseDownEvent = this.mouseDownEvent.bind(this)
        this.mouseMoveEvent = this.mouseMoveEvent.bind(this)
        this.mouseUpEvent = this.mouseUpEvent.bind(this)

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

        this.addWidget(Widget)

    }

    componentWillUnmount() {
        
        // NOTE: this will clear the canvas
        this.clearCanvas()
    }

    /**
     * 
     * @returns  {import("./widgets/base").Widget[]}
     */
    getWidgets(){
        
        return this.state.widgets
    }

    /**
     * returns list of active objects / selected objects on the canvas
     * @returns Widget[]
     */
    getActiveObjects(){
        return Object.values(this.widgetRefs).filter((widgetRef) => {
            return widgetRef.current?.isSelected()
        })
    }

    initEvents(){

        this.canvasContainerRef.current.addEventListener("mousedown", this.mouseDownEvent)
        this.canvasContainerRef.current.addEventListener("mouseup", this.mouseUpEvent)
        this.canvasContainerRef.current.addEventListener("mousemove", this.mouseMoveEvent)

        this.canvasContainerRef.current.addEventListener('wheel', (event) => {
            this.wheelZoom(event)
        })
              
    }

    applyTransform(){
        const { currentTranslate, zoom } = this.state
        this.canvasRef.current.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${zoom})`
    }

    /**
     * returns the widget that contains the target
     * @param {HTMLElement} target 
     * @returns {Widget}
     */
    getWidgetFromTarget(target){

        for (let [key, ref] of Object.entries(this.widgetRefs)){
            if (ref.current.getElement().contains(target)){
                return ref.current
            }
        }

    }


    mouseDownEvent(event){

        this.mousePos = { x: event.clientX, y: event.clientY }
        
        let selectedWidget = this.getWidgetFromTarget(event.target)
        if (event.button === 0){
            this.mousePressed = true
        
            if (selectedWidget){
                // if the widget is selected don't pan, instead move the widget
                if (!selectedWidget._disableSelection){

                    const selectedLength = this.state.selectedWidgets.length

                    // console.log("selected widget: ", selectedWidget)

                    if (selectedLength === 0 || (selectedLength === 1 && selectedWidget.__id !== this.state.selectedWidgets[0].__id)){
                        this.state.selectedWidgets[0]?.deSelect() // deselect the previous widget before adding the new one
                        this.state.selectedWidgets[0]?.setZIndex(0)

                        selectedWidget.setZIndex(1000)
                        selectedWidget.select()

                        this.setState({
                            selectedWidgets: [selectedWidget],
                            toolbarAttrs: selectedWidget.getToolbarAttrs()
                        })
                    }
                    this.currentMode = CanvasModes.MOVE_WIDGET
                }

                this.currentMode = CanvasModes.PAN

            }else if (!selectedWidget){
                // get the canvas ready to pan, if there are widgets on the canvas
                this.clearSelections()
                this.currentMode = CanvasModes.PAN
                this.setCursor(Cursor.GRAB)

            }

            this.setState({
                contextMenuItems: [],
                toolbarOpen: true
            })
            // this.setState({
            //     showContextMenu: false
            // })
        }else if (event.button === 2){
            //right click
            
            if (this.state.selectedWidgets.length > 0 && this.state.selectedWidgets[0].__id !== selectedWidget.__id){
                this.clearSelections()
            }

            if (selectedWidget){

                this.setState({
                    selectedWidget: [selectedWidget],
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

    mouseMoveEvent(event){

        // console.log("mode: ", this.currentMode, this.getActiveObjects())
        if (this.mousePressed && [CanvasModes.PAN, CanvasModes.MOVE_WIDGET].includes(this.currentMode)) {
            const deltaX = event.clientX - this.mousePos.x
            const deltaY = event.clientY - this.mousePos.y
            
            if (this.state.selectedWidgets.length === 0){
                // if there aren't any selected widgets, then pan the canvas
                this.setState(prevState => ({
                    currentTranslate: {
                        x: prevState.currentTranslate.x + deltaX,
                        y: prevState.currentTranslate.y + deltaY,
                    }
                }), this.applyTransform)

            }else{
                // update the widgets position
                this.state.selectedWidgets.forEach(widget => {
                    const {x, y} = widget.getPos()

                    const newPosX = x + (deltaX/this.state.zoom) // account for the zoom, since the widget is relative to canvas
                    const newPosY = y + (deltaY/this.state.zoom) // account for the zoom, since the widget is relative to canvas
                    widget.setPos(newPosX, newPosY)
                })
            }


           this.mousePos = { x: event.clientX, y: event.clientY }

           this.setCursor(Cursor.GRAB)
       }
    }

    mouseUpEvent(event){
        this.mousePressed = false
        this.currentMode = CanvasModes.DEFAULT
        this.setCursor(Cursor.DEFAULT)
    }

    wheelZoom(event){
        let delta = event.deltaY
        let zoom = this.state.zoom * 0.999 ** delta
        
        this.setZoom(zoom, {x: event.offsetX, y: event.offsetY})
    }

    getCanvasContainerBoundingRect(){
        return this.canvasContainerRef.current.getBoundingClientRect()
    }

    getCanvasBoundingRect(){
        return this.canvasRef.current.getBoundingClientRect()
    }

    getCanvasTranslation(){
        return this.state.currentTranslate
    }

    /**
     * Given a position relative to canvas container, 
     * returns the position relative to the canvas
     */
    getRelativePositionToCanvas(x, y){

        const canvasRect = this.canvasRef.current.getBoundingClientRect()
        let zoom = this.state.zoom

        return {x: (canvasRect.left - x ), y: (canvasRect.top - y)}
    }

    /**
     * fits the canvas size to fit the widgets bounding box
     */
    fitCanvasToBoundingBox(padding=0){
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

    setCursor(cursor){
        this.canvasContainerRef.current.style.cursor = cursor
    }

    setZoom(zoom, pos={x:0, y:0}){
        
        // if (zoom < 0.5 || zoom > 2){
        //     return
        // }

        const { currentTranslate } = this.state

        
        // Calculate the new translation to zoom into the mouse position
        const offsetX = pos.x - (this.canvasContainerRef.current.clientWidth / 2 + currentTranslate.x)
        const offsetY = pos.y - (this.canvasContainerRef.current.clientHeight / 2 + currentTranslate.y)
    
        const newTranslateX = currentTranslate.x - offsetX * (zoom - this.state.zoom)
        const newTranslateY = currentTranslate.y - offsetY * (zoom - this.state.zoom)
    
        this.setState({
            zoom: Math.max(0.5, Math.min(zoom, 1.5)), // clamp between 0.5 and 1.5
            currentTranslate: {
                x: newTranslateX,
                y: newTranslateY
            }
        }, this.applyTransform)

        // this.canvasRef.current.style.width = `${100/zoom}%`
        // this.canvasRef.current.style.height = `${100/zoom}%`

    }

    getZoom(){
        return this.state.zoom
    }
    
    resetTransforms() {
        this.setState({
            zoom: 1,
            currentTranslate: { x: 0, y: 0 }
        }, this.applyTransform)
    }

    setSelectedWidget(selectedWidget){
        this.setState({ selectedWidget: [selectedWidget] })
    }

    clearSelections(){
        this.getActiveObjects().forEach(widget => {
            widget.current?.deSelect()
        })

        this.setState({
            selectedWidgets: [],
            toolbarAttrs: null,
            // toolbarOpen: 
        })

    }

    /**
     * returns tha combined bounding rect of all the widgets on the canvas
     * 
     */
    getCanvasObjectsBoundingBox(){

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
     * 
     * @param {Widget} widgetComponentType - don't pass <Widget /> instead pass Widget object
     */
    addWidget(widgetComponentType, callback){
        const widgetRef = React.createRef()

        const id = `${widgetComponentType.widgetType}_${UID()}`

        // Store the ref in the instance variable
        this.widgetRefs[id] = widgetRef
        // console.log("widget ref: ", this.widgetRefs)

        const widgets = [...this.state.widgets, { id, widgetType: widgetComponentType }] // don't add the widget refs in the state
        // Update the state to include the new widget's type and ID
        this.setState({
            widgets: widgets
        }, () => {
            if (callback)
                callback({id, widgetRef})

            if (this._onWidgetListUpdated)
                this._onWidgetListUpdated(widgets)
        })

        

        return {id, widgetRef}
    }

    deleteSelectedWidgets(widgets=[]){

        
        let activeWidgets = removeDuplicateObjects([...widgets, ...this.state.selectedWidgets], "__id")
        
        const widgetIds = activeWidgets.map(widget => widget.__id)

        for (let widgetId of widgetIds){

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
    clearCanvas(){

        // NOTE: Don't remove from it using remove() function since, it already removed from the DOM tree when its removed from widgets
        // for (let [key, value] of Object.entries(this.widgetRefs)){
        //     console.log("removed: ", value, value.current?.getElement())

        //     value.current?.remove()
        // }

        this.widgetRefs = {}
        this.setState({
            widgets: []
        })

        if (this._onWidgetListUpdated)
            this._onWidgetListUpdated([])
    }

    removeWidget(widgetId){

        // this.widgetRefs[widgetId]?.current.remove()
        delete this.widgetRefs[widgetId]

        const widgets = this.state.widgets.filter(widget => widget.id !== widgetId)

        this.setState({
            widgets: widgets
        })

        if (this._onWidgetListUpdated)
            this._onWidgetListUpdated(widgets)
    }

    onActiveWidgetUpdate(widgetId){

        if (this.state.selectedWidgets.length === 0 || widgetId !== this.state.selectedWidgets[0].__id)
            return

        // console.log("updating...")

        this.setState({
            toolbarAttrs: this.state.selectedWidgets.at(0).getToolbarAttrs()
        })

    }

    /**
     * Handles drop event to canvas from the sidebar
     * @param {DragEvent} e 
     */
    handleDropEvent = (e) => {

        e.preventDefault()

        // const canvasContainerRect = this.getCanvasContainerBoundingRect()
        const canvasRect = this.canvasRef.current.getBoundingClientRect()
        const { clientX, clientY } = e

        const finalPosition = {	
			x: (clientX - canvasRect.left) / this.state.zoom,
			y: (clientY - canvasRect.top) / this.state.zoom,
		}

        this.addWidget(Widget, ({id, widgetRef}) => {
            widgetRef.current.setPos(finalPosition.x, finalPosition.y)
        })

    }

    renderWidget(widget){
        const { id, widgetType: ComponentType } = widget
        // console.log("widet: ", this.widgetRefs, id)
    
        return <ComponentType key={id} id={id} ref={this.widgetRefs[id]} 
                                canvasRef={this.canvasContainerRef} 
                                onWidgetUpdate={this.onActiveWidgetUpdate}
                                />
    }

    render() {
        return (
            <div className="tw-relative tw-flex tw-w-full tw-h-full tw-max-h-[100vh]">
                
                <div className="tw-absolute tw-p-2 tw-bg-white tw-z-10 tw-min-w-[100px] tw-h-[50px] tw-gap-2 
                                    tw-top-4 tw-place-items-center tw-right-4 tw-shadow-md tw-rounded-md tw-flex">
                    
                    <Tooltip title="Reset viewport">
                        <Button  icon={<ReloadOutlined />} onClick={this.resetTransforms} />
                    </Tooltip>
                    <Tooltip title="Clear canvas">
                        <Button danger icon={<DeleteOutlined />} onClick={this.clearCanvas} />
                    </Tooltip>
                </div>

                <DroppableWrapper id="canvas-droppable" 
                                    className="tw-w-full tw-h-full" onDrop={this.handleDropEvent}>
                    {/* <Dropdown trigger={['contextMenu']} mouseLeaveDelay={0} menu={{items: this.state.contextMenuItems, }}> */}
                            <div className="dots-bg tw-w-full tw-h-full tw-flex tw-relative tw-bg-[#f2f2f2] tw-overflow-hidden" 
                                    ref={this.canvasContainerRef}
                                    style={{
                                            transition: " transform 0.3s ease-in-out", 
                                            backgroundImage: `url('${DotsBackground}')`,
                                            backgroundSize: 'cover', // Ensure proper sizing if needed
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                    >
                                {/* Canvas */}
                                <div data-canvas className="tw-w-full tw-h-full tw-absolute tw-top-0 tw-select-none
                                                            tw-bg-green-300" 
                                        ref={this.canvasRef}>
                                    <div className="tw-relative tw-w-full tw-h-full">
                                        {
                                            this.state.widgets.map(this.renderWidget)
                                        }
                                    </div>
                                </div>
                            </div>
                    {/* </Dropdown> */}
                </DroppableWrapper>

                <CanvasToolBar isOpen={this.state.toolbarOpen} 
                                widgetType={this.state.selectedWidgets?.at(0)?.getWidgetType() || ""}
                                attrs={this.state.toolbarAttrs}
                                />
            </div>
        )
    }
}

export default Canvas
