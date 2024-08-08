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
            DEFAULT: '',
            PAN: 'pan',
        }
        this.currentMode = this.modes.DEFAULT
        
        this.mousePressed = false
        this.mousePos = {
            x: 0,
            y: 0
        }

        this.state = {
            widgets: [],
            zoom: 1,
            isPanning: false,
            currentTranslate: { x: 0, y: 0 },
        }

        this.resetTransforms = this.resetTransforms.bind(this)
        this.renderWidget = this.renderWidget.bind(this)

        // this.updateCanvasDimensions = this.updateCanvasDimensions.bind(this) 
    }

    componentDidMount() {
        this.initEvents()

        // this.widgets.push(new Widget())

        // let widgetRef = React.createRef()

        // this.widgetRefs[widgetRef.current.__id] = widgetRef

        // // Update the state to include the new widget's ID
        // this.setState((prevState) => ({
        //     widgetIds: [...prevState.widgetIds, widgetRef.current.__id]
        // }))

        this.addWidget(Widget)

    }

    componentWillUnmount() {
      
    }

    mouseDownEvent(event){

        this.mousePressed = true

        this.mousePos.x = event.e.clientX
        this.mousePos.y = event.e.clientY

    }

    mouseMoveEvent(event){

    }

    mouseUpEvent(event){
        this.mousePressed = false
    }

    /**
     * 
     * @returns  {import("./widgets/base").Widget[]}
     */
    getWidgets(){
        
        return this.state.widgets
    }

    /**
     * returns list of active objects on the canvas
     * @returns Widget[]
     */
    getActiveObjects(){

        return this.getWidgets().filter((widget) => {
            return widget.isSelected
        })

    }

    initEvents(){

        this.canvasContainerRef.current.addEventListener("mousedown", (event) => {
            this.mousePressed = true
            this.mousePos = { x: event.clientX, y: event.clientY }

            if (this.state.widgets.length > 0){

                this.currentMode = this.modes.PAN
                this.setCursor(Cursor.GRAB)

            }

        })

        this.canvasContainerRef.current.addEventListener("mouseup", () => {
            this.mousePressed = false
            this.currentMode = this.modes.DEFAULT
            this.setCursor(Cursor.DEFAULT)
        })

        this.canvasContainerRef.current.addEventListener("mousemove", (event) => {
            // console.log("event: ", event)
            if (this.mousePressed && this.currentMode === this.modes.PAN) {
                 const deltaX = event.clientX - this.mousePos.x
                const deltaY = event.clientY - this.mousePos.y

                this.setState(prevState => ({
                    currentTranslate: {
                        x: prevState.currentTranslate.x + deltaX,
                        y: prevState.currentTranslate.y + deltaY,
                    }
                }), this.applyTransform)

                this.mousePos = { x: event.clientX, y: event.clientY }

                this.setCursor(Cursor.GRAB)
            }



        })

        this.canvasContainerRef.current.addEventListener("selection:created", () => {
            console.log("selected")
            this.currentMode = this.modes.DEFAULT
        })

        this.canvasContainerRef.current.addEventListener('wheel', (event) => {
            this.wheelZoom(event)
        })
              
    }

    applyTransform(){
        const { currentTranslate, zoom } = this.state
        this.canvasRef.current.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${zoom})`
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

    /**
     * 
     * @param {Widget} widgetComponentType - don't pass <Widget /> instead pass Widget
     */
    addWidget(widgetComponentType){
        const widgetRef = React.createRef()

        const id = `${widgetComponentType.widgetType}_${UID()}`

        // Store the ref in the instance variable
        this.widgetRefs[id] = widgetRef
        console.log("widget ref: ", this.widgetRefs)
        // Update the state to include the new widget's type and ID
        this.setState((prevState) => ({
          widgets: [...prevState.widgets, { id, type: widgetComponentType }]
        }))
    }

    renderWidget(widget){
        const { id, type: ComponentType } = widget
        console.log("widet: ", this.widgetRefs, id)
    
        return <ComponentType key={id} id={id} ref={this.widgetRefs[id]} />
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
