import React from "react"
import * as fabric from 'fabric'


class Canvas extends React.Component {

    constructor(props) {
        super(props)

        this.fabricCanvas = null
        this.canvasRef = React.createRef()  

        this.mousePressed = false
        this.mousePos = {
            startX: 0,
            startY: 0
        }

        this.modes = {
            PAN: 'pan',
        }
        this.currentMode = 'pan'
        
        this.updateCanvasDimensions = this.updateCanvasDimensions.bind(this) 
    }

    componentDidMount() {
        this.fabricCanvas = new fabric.Canvas(this.canvasRef.current, {
            selection: false,
        })
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 200,
            height: 100,
            angle: 0
        })
        this.fabricCanvas.add(rect)
        console.log("Mounted: ", rect)
        fabric.FabricImage.fromURL("https://images.unsplash.com/photo-1722898614949-c9a315e35209?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
            (oImg) => {
                console.log("added image", oImg)
                
                const canvasWidth = this.fabricCanvas.getWidth()
                const canvasHeight = this.fabricCanvas.getHeight()
            
                // Get the image's original dimensions
                const imgWidth = oImg.getScaledWidth()
                const imgHeight = oImg.getScaledHeight()
            
                // Set the position to the center
                oImg.set({
                    left: (canvasWidth - imgWidth) / 2,
                    top: (canvasHeight - imgHeight) / 2
                })

                oImg.scaleX(2)
                oImg.scaleY(2)
            
                // this.fabricCanvas.backgroundImage = oImg
                this.fabricCanvas.add(oImg)
                this.fabricCanvas.renderAll()
        })

        this.initPan()

        window.addEventListener("resize", this.updateCanvasDimensions)
        this.updateCanvasDimensions()
    }

    componentWillUnmount() {
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

    initPan(){

        this.fabricCanvas.on("mouse:down", (event) => {
            this.mousePressed = true
            
            this.startX = event.e.clientX
            this.startY = event.e.clientY

            this.fabricCanvas.setCursor("grab")

        })

        this.fabricCanvas.on("mouse:up", () => {
            this.mousePressed = false
            this.fabricCanvas.setCursor("default")

        })

        this.fabricCanvas.on("mouse:move", (event) => {

            if (this.mousePressed && this.currentMode === this.modes.PAN){

                this.fabricCanvas.setCursor("grab")

                const deltaX = event.e.clientX - this.mousePos.startX
                const deltaY = event.e.clientY - this.mousePos.startY
                
                this.fabricCanvas.relativePan({ x: deltaX, y: deltaY })
                
                this.mousePos.startX = event.e.clientX
                this.mousePos.startY = event.e.clientY

            }

        })

    }

    render() {
        return (
            <div className="tw-relative tw-flex tw-w-full tw-h-full tw-max-h-[100vh] tw-overflow-auto">
                <canvas className="tw-w-full tw-h-full" ref={this.canvasRef}/> {/* Don't add any bg color here */}
            </div>
        )
    }
}

export default Canvas
