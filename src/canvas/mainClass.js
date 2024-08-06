import React from "react"
import * as fabric from 'fabric'
import { FullscreenOutlined } from "@ant-design/icons"
import { Button, Tooltip } from "antd"


class Canvas extends React.Component {

    constructor(props) {
        super(props)
        
        /** @type {fabric.Canvas | null} */
        this.fabricCanvas = null
        this.canvasRef = React.createRef()  

        this.mousePressed = false
        this.mousePos = {
            startX: 0,
            startY: 0
        }

        this.modes = {
            DEFAULT: '',
            PAN: 'pan',
        }
        this.currentMode = this.modes.DEFAULT
        
        this.updateCanvasDimensions = this.updateCanvasDimensions.bind(this) 
    }

    componentDidMount() {
        this.initCanvas()
        window.addEventListener("resize", this.updateCanvasDimensions)
        this.updateCanvasDimensions()
    }

    componentWillUnmount() {
        this.fabricCanvas.clear()
        this.fabricCanvas.dispose()
        window.removeEventListener("resize", this.updateCanvasDimensions)
    }

    updateCanvasDimensions() {
        if (!this.canvasRef.current || !this.fabricCanvas) return

        const parent = this.canvasRef.current.parentNode.parentNode  // Get the outer container

        this.fabricCanvas.setDimensions({
            width: parent.clientWidth,
            height: parent.clientHeight
        })

        this.fabricCanvas.calcOffset()
        this.fabricCanvas.renderAll()
    }

    initCanvas(){
        this.fabricCanvas = new fabric.Canvas(this.canvasRef.current, {
            selection: false,
        })

        this.fabricCanvas.hoverCursor = this.fabricCanvas.moveCursor = 'pointer'

        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 200,
            height: 100,
            angle: 0
        })
        this.fabricCanvas.add(rect)
        fabric.FabricImage.fromURL("https://images.unsplash.com/photo-1722898614949-c9a315e35209?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D").then((img) => {

            img.scale(0.2)
            this.fabricCanvas.add(img)
        })

        // this.fabricCanvas.renderAll()
        this.initEvents()

    }

    initEvents(){

        this.fabricCanvas.on("mouse:down", (event) => {
            this.mousePressed = true
            
            if (this.fabricCanvas.getActiveObjects().length === 0){
                this.currentMode = this.modes.PAN
            }

            this.mousePos.startX = event.e.clientX
            this.mousePos.startY = event.e.clientY

            this.fabricCanvas.setCursor("grab")

        })

        this.fabricCanvas.on("mouse:up", () => {
            this.mousePressed = false
            this.fabricCanvas.setCursor("default")

        })

        this.fabricCanvas.on("mouse:move", (event) => {

            if (event.e.buttons === 1 && this.currentMode === this.modes.PAN){

                this.fabricCanvas.setCursor("grab")

                // TODO: add panning limits

                const deltaX = event.e.clientX - this.mousePos.startX
                const deltaY = event.e.clientY - this.mousePos.startY
                
                this.fabricCanvas.relativePan({ x: deltaX, y: deltaY })
                
                this.mousePos.startX = event.e.clientX
                this.mousePos.startY = event.e.clientY

            }

        })

        this.fabricCanvas.on("selection:created", () => {
            console.log("selected")
            this.currentMode = this.modes.DEFAULT
        })

        this.fabricCanvas.on('mouse:wheel', (opt) => {
            // console.log("opt: ", opt)
            let delta = opt.e.deltaY
            let zoom = this.fabricCanvas.getZoom()
            zoom *= 0.999 ** delta

            if (zoom > 20) zoom = 20
            if (zoom < 0.01) zoom = 0.01
            
            this.fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
            
            opt.e.preventDefault()
            opt.e.stopPropagation()
        })
              

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
    

    resetZoom(){
        this.fabricCanvas.setViewportTransform([1,0,0,1,0,0])
    }

    resetPan(){
        this.fabricCanvas.setViewportTransform([1,0,0,1,0,0])
    }

    render() {
        return (
            <div className="tw-relative tw-flex tw-w-full tw-h-full tw-max-h-[100vh] tw-overflow-auto">
                
                <div className="tw-absolute tw-p-2 tw-bg-white tw-z-10 tw-min-w-[100px] tw-h-[50px] tw-gap-2 
                                    tw-top-4 tw-place-items-center tw-right-4 tw-shadow-md tw-rounded-md tw-flex">
                    
                    <Tooltip title="Reset zoom">
                        <Button  icon={<FullscreenOutlined />} />
                    </Tooltip>
                </div>

                <canvas className="tw-w-full tw-h-full" ref={this.canvasRef}/> {/* Don't add any bg color here */}
            </div>
        )
    }
}

export default Canvas
