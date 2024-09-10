import React from "react"
import * as fabric from 'fabric'
import { FullscreenOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"

import Widget from "./widgets/base"
import Cursor from "./constants/cursor"
import { UID } from "../utils/uid"


const CanvasModes = {
    DEFAULT: 0,
    PAN: 1,
    MOVE_WIDGET: 2 // when the mode is move widget
}


class Canvas extends React.Component {

    constructor(props) {
        super(props)
        
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

        this.state = {
            widgets: [], //  don't store the widget directly here, instead store it in widgetRef, else the changes in the widget will re-render the whole canvas
            zoom: 1,
            isPanning: false,
            currentTranslate: { x: 0, y: 0 },
            canvasSize:  { width: 500, height: 500 },
        }

        this.selectedWidgets = []

        this.resetTransforms = this.resetTransforms.bind(this)
        this.renderWidget = this.renderWidget.bind(this)
        
        this.mouseDownEvent = this.mouseDownEvent.bind(this)
        this.mouseMoveEvent = this.mouseMoveEvent.bind(this)
        this.mouseUpEvent = this.mouseUpEvent.bind(this)
        
        this.getWidgets = this.getWidgets.bind(this)
        this.getActiveObjects = this.getActiveObjects.bind(this)
        this.getWidgetFromTarget = this.getWidgetFromTarget.bind(this)

        this.getCanvasObjectsBoundingBox = this.getCanvasObjectsBoundingBox.bind(this)
        this.fitCanvasToBoundingBox = this.fitCanvasToBoundingBox.bind(this)

        this.updateWidgetPosition = this.updateWidgetPosition.bind(this)

        this.checkAndExpandCanvas = this.checkAndExpandCanvas.bind(this)
        this.expandCanvas = this.expandCanvas.bind(this)

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


        // this.canvasRef.current.addEventListener("selection:created", () => {
        //     console.log("selected")
        //     this.currentMode = Modes.DEFAULT
        // })

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
        this.mousePressed = true
        this.mousePos = { x: event.clientX, y: event.clientY }

        let selectedWidget = this.getWidgetFromTarget(event.target)
        if (selectedWidget){
            // if the widget is selected don't pan, instead move the widget

            if (!selectedWidget._disableSelection){
                selectedWidget.select()
                this.selectedWidgets.push(selectedWidget)
                this.currentMode = CanvasModes.MOVE_WIDGET
            }

            this.currentMode = CanvasModes.PAN

            

        }else if (this.state?.widgets?.length > 0){
            // get the canvas ready to pan, if there are widgets on the canvas
            this.clearSelections()
            this.currentMode = CanvasModes.PAN
            this.setCursor(Cursor.GRAB)

        }

    }

    mouseMoveEvent(event){
        // console.log("mode: ", this.currentMode, this.getActiveObjects())
        if (this.mousePressed && [CanvasModes.PAN, CanvasModes.MOVE_WIDGET].includes(this.currentMode)) {
            const deltaX = event.clientX - this.mousePos.x
            const deltaY = event.clientY - this.mousePos.y
            

            if (this.selectedWidgets.length === 0){
                // if there aren't any selected widgets, then pan the canvas
                this.setState(prevState => ({
                    currentTranslate: {
                        x: prevState.currentTranslate.x + deltaX,
                        y: prevState.currentTranslate.y + deltaY,
                    }
                }), this.applyTransform)

            }else{
                // update the widgets position
                this.selectedWidgets.forEach(widget => {
                    const {x, y} = widget.getPos()

                    const newPosX = x + (deltaX/this.state.zoom) // account for the zoom, since the widget is relative to canvas
                    const newPosY = y + (deltaY/this.state.zoom) // account for the zoom, since the widget is relative to canvas

                    widget.setPos(newPosX, newPosY)
                    this.checkAndExpandCanvas(newPosX, newPosY,  widget.getSize().width,  widget.getSize().height)
                })
                // this.fitCanvasToBoundingBox(10)
                
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

    checkAndExpandCanvas(widgetX, widgetY, widgetWidth, widgetHeight) {
        const canvasWidth = this.canvasRef.current.offsetWidth
        const canvasHeight = this.canvasRef.current.offsetHeight
        
        const canvasRect = this.canvasRef.current.getBoundingClientRect()

        // Get the zoom level
        const zoom = this.state.zoom
    
        // Calculate effective canvas boundaries considering zoom
        const effectiveCanvasRight = canvasWidth
        const effectiveCanvasBottom = canvasHeight
    
        // Calculate widget boundaries
        const widgetRight = widgetX + widgetWidth
        const widgetBottom = widgetY + widgetHeight
    
        // Determine if expansion is needed
        const expandRight = widgetRight > effectiveCanvasRight
        const expandDown = widgetBottom > effectiveCanvasBottom
        const expandLeft = widgetX < canvasRect.left * this.state.zoom
        const expandUp = widgetY < canvasRect.top
    
        if (expandRight || expandLeft || expandDown || expandUp) {
            this.expandCanvas(expandRight, expandLeft, expandDown, expandUp, widgetX, widgetY, widgetWidth, widgetHeight)
        }
    }
    
    // Expand the canvas method
    /**
     * 
     * @param {boolean} expandRight 
     * @param {boolean} expandLeft 
     * @param {boolean} expandDown 
     * @param {boolean} expandUp 
     * @param {number} widgetX 
     * @param {number} widgetY 
     * @param {number} widgetRight 
     * @param {number} widgetBottom 
     */
    expandCanvas(expandRight, expandLeft, expandDown, expandUp, widgetX, widgetY, widgetWidth, widgetHeight) {
        const currentWidth = this.canvasRef.current.offsetWidth
        const currentHeight = this.canvasRef.current.offsetHeight

        console.log("current: ", expandRight, expandDown, expandLeft, expandUp)

        let newWidth = currentWidth
        let newHeight = currentHeight
        let newTranslateX = this.state.currentTranslate.x
        let newTranslateY = this.state.currentTranslate.y

        if (expandRight) {
            // const requiredWidth = widgetRight - newTranslateX // Add padding
            // newWidth = Math.max(requiredWidth, currentWidth)
            newWidth = currentWidth + 50
        }

        if (expandLeft) {
            // const leftOffset = widgetX + newTranslateX // Position of the widget relative to the left edge
            // const requiredLeftExpansion = -leftOffset + 50 // Add padding
            newWidth = currentWidth + widgetWidth
            newTranslateX -= widgetWidth // Adjust translation to move the canvas to the left
        }

        if (expandDown) {
            newHeight = currentHeight + 50

            // const requiredHeight = widgetBottom - newTranslateY // Add padding
            // newHeight = Math.max(requiredHeight, currentHeight)
        }

        if (expandUp) {
            newHeight = currentHeight + widgetHeight
            newTranslateY -= widgetHeight
            // const topOffset = widgetY + newTranslateY // Position of the widget relative to the top edge
            // const requiredTopExpansion = -topOffset + 50 // Add padding
            // newHeight = currentHeight + requiredTopExpansion
            // newTranslateY -= requiredTopExpansion // Adjust translation to move the canvas upwards
        }

        // Apply new dimensions and translation
        this.canvasRef.current.style.width = `${newWidth}px`
        this.canvasRef.current.style.height = `${newHeight}px`

        console.log("translate: ", this.canvasRef.current.offsetWidth, )
        // Now, to keep the widget in the same relative position:
        const updatedWidgetX = widgetX - newTranslateX / this.state.zoom;
        const updatedWidgetY = widgetY - newTranslateY / this.state.zoom;

        this.setState({
            currentTranslate: {
                x: newTranslateX,
                y: newTranslateY
            }
        }, () =>  {
            this.applyTransform()
            this.updateWidgetPosition(updatedWidgetX, updatedWidgetY, widgetWidth, widgetHeight)
        })

    }

    // TODO: FIX this, to ensure that the widget position remains the same
    // Function to update the widget's position based on new updated canvas coordinates, use it after expandCanvas
    updateWidgetPosition(widgetX, widgetY, widgetWidth, widgetHeight) {
        const widgetElement = this.selectedWidgets[0].current; // Assuming the widget is referenced via `widgetRef`

        console.log("widget element: ", this.selectedWidgets[0].current)
        widgetElement.style.left = `${widgetX}px`;
        widgetElement.style.top = `${widgetY}px`;
        widgetElement.style.width = `${widgetWidth}px`;
        widgetElement.style.height = `${widgetHeight}px`;
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
        
        const { currentTranslate } = this.state

        // Calculate the new translation to zoom into the mouse position
        const offsetX = pos.x - (this.canvasContainerRef.current.clientWidth / 2 + currentTranslate.x)
        const offsetY = pos.y - (this.canvasContainerRef.current.clientHeight / 2 + currentTranslate.y)
    
        const newTranslateX = currentTranslate.x - offsetX * (zoom - this.state.zoom)
        const newTranslateY = currentTranslate.y - offsetY * (zoom - this.state.zoom)
    
        this.setState({
            zoom: zoom,
            currentTranslate: {
                x: newTranslateX,
                y: newTranslateY
            }
        }, this.applyTransform)

    }
    
    resetTransforms() {
        this.setState({
            zoom: 1,
            currentTranslate: { x: 0, y: 0 }
        }, this.applyTransform)
    }

    clearSelections(){
        this.getActiveObjects().forEach(widget => {
            widget.current?.deSelect()
        })
        this.selectedWidgets = []
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
    addWidget(widgetComponentType){
        const widgetRef = React.createRef()

        const id = `${widgetComponentType.widgetType}_${UID()}`

        // Store the ref in the instance variable
        this.widgetRefs[id] = widgetRef
        // console.log("widget ref: ", this.widgetRefs)
        // Update the state to include the new widget's type and ID
        this.setState((prevState) => ({
            widgets: [...prevState.widgets, { id, type: widgetComponentType }]
        }))
    }

    /**
     * removes all the widgets from the canvas
     */
    clearCanvas(){

        for (let [key, value] of Object.entries(this.widgetRefs)){
            console.log("removed: ", key, value)
            value.current?.remove()
        }

        this.widgetRefs = {}
        this.setState(() => ({
            widgets: []
        }))
    }

    removeWidget(widgetId){

        this.widgetRefs[widgetId]?.current.remove()
        delete this.widgetRefs[widgetId]

        this.setState((prevState) => ({
            widgets: prevState.widgets.filter(widget => widget.id !== widgetId)
        }))
    }

    renderWidget(widget){
        const { id, type: ComponentType } = widget
        // console.log("widet: ", this.widgetRefs, id)
    
        return <ComponentType key={id} id={id} ref={this.widgetRefs[id]} canvasRef={this.canvasRef} />
    }

    render() {
        return (
            <div className="tw-relative tw-flex tw-w-full tw-h-full tw-max-h-[100vh]">
                
                <div className="tw-absolute tw-p-2 tw-bg-white tw-z-10 tw-min-w-[100px] tw-h-[50px] tw-gap-2 
                                    tw-top-4 tw-place-items-center tw-right-4 tw-shadow-md tw-rounded-md tw-flex">
                    
                    <Tooltip title="Reset viewport">
                        <Button  icon={<ReloadOutlined />} onClick={this.resetTransforms} />
                    </Tooltip>
                </div>

                <div className="tw-w-full tw-relative tw-h-full tw-overflow-hidden" 
                        ref={this.canvasContainerRef}
                        style={{transition: " transform 0.3s ease-in-out"}}
                        >
                    <div data-canvas className="tw-w-full tw-absolute tw-top-0 tw-h-full tw-bg-green-300" 
                            ref={this.canvasRef}>
                        <div className="tw-relative tw-w-full tw-h-full">
                            {
                                this.state.widgets.map(this.renderWidget)
                            }
                        </div>
                    </div>
                </div>       
            </div>
        )
    }
}

export default Canvas
