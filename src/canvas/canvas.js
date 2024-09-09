import React from "react"
import * as fabric from 'fabric'
import { FullscreenOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"

import Widget from "./widgets/base"
import Cursor from "./constants/cursor"
import { UID } from "../utils/uid"


class Canvas extends React.Component {

    constructor(props) {
        super(props)
        
        this.canvasRef = React.createRef()  
        this.canvasContainerRef = React.createRef()

        this.widgetRefs = {}

        this.modes = {
            DEFAULT: 0,
            PAN: 1,
            MOVE_WIDGET: 2 // when the mode is move widget
        }
        this.currentMode = this.modes.DEFAULT
        
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
        //     this.currentMode = this.modes.DEFAULT
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
                this.currentMode = this.modes.MOVE_WIDGET
            }

            this.currentMode = this.modes.PAN

            

        }else if (this.state?.widgets?.length > 0){

            this.clearSelections()
            this.currentMode = this.modes.PAN
            this.setCursor(Cursor.GRAB)

        }

    }

    mouseMoveEvent(event){
        // console.log("mode: ", this.currentMode, this.getActiveObjects())
        if (this.mousePressed && [this.modes.PAN, this.modes.MOVE_WIDGET].includes(this.currentMode)) {
            const deltaX = event.clientX - this.mousePos.x
            const deltaY = event.clientY - this.mousePos.y
            

            if (this.selectedWidgets.length === 0){
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
                })
            }


           this.mousePos = { x: event.clientX, y: event.clientY }

           this.setCursor(Cursor.GRAB)
       }
    }

    mouseUpEvent(event){
        this.mousePressed = false
        this.currentMode = this.modes.DEFAULT
        this.setCursor(Cursor.DEFAULT)
    }

    wheelZoom(event){
        let delta = event.deltaY
        let zoom = this.state.zoom * 0.999 ** delta
        this.setZoom(zoom, {x: event.offsetX, y: event.offsetY})
    }

    /**
     * fits the canvas size to fit the widgets bounding box
     */
    fitCanvasToBoundingBox(){
        // this.canvasRef.current.style.width = this.canvasContainerRef.current.clientWidth
        // this.canvasRef.current.style.height = this.canvasContainerRef.current.clientHeight
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

    getCanvasObjectsBoundingBox(padding = 0) {
        const objects = this.fabricCanvas.getObjects()
        if (objects.length === 0) {
            return { left: 0, top: 0, width: this.fabricCanvas.width, height: this.fabricCanvas.height }
        }
    
        const boundingBox = objects.reduce((acc, obj) => {
            const objBoundingBox = obj.getBoundingRect(true)
            acc.left = Math.min(acc.left, objBoundingBox.left)
            acc.top = Math.min(acc.top, objBoundingBox.top)
            acc.right = Math.max(acc.right, objBoundingBox.left + objBoundingBox.width)
            acc.bottom = Math.max(acc.bottom, objBoundingBox.top + objBoundingBox.height)
            return acc
        }, {
            left: Infinity,
            top: Infinity,
            right: -Infinity,
            bottom: -Infinity
        })
    
        // Adding padding
        boundingBox.left -= padding
        boundingBox.top -= padding
        boundingBox.right += padding
        boundingBox.bottom += padding
        
        return {
            left: boundingBox.left,
            top: boundingBox.top,
            width: boundingBox.right - boundingBox.left,
            height: boundingBox.bottom - boundingBox.top
        }
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

        // TODO: remove from widgets
        // this.setState(() => ({
        //     widgets: []
        // }))
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

                <div className="tw-w-full tw-relative tw-h-full tw-bg-red-300 tw-overflow-hidden" 
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
