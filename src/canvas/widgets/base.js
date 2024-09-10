import React from "react"
import { NotImplementedError } from "../../utils/errors"

import Tools from "../constants/tools"
import Layouts from "../constants/layouts"
import Cursor from "../constants/cursor"
import { toSnakeCase } from "../utils/utils"
import EditableDiv from "../../components/editableDiv"



/**
 * Base class to be extended
 */
class Widget extends React.Component{

    static widgetType = "widget"

    constructor(props){
        super(props)

        const {id, widgetName, canvasRef} = props
        console.log("Id: ", id)
        // this id has to be unique inside the canvas, it will be set automatically and should never be changed
        this.__id = id
        this._zIndex = 0

        this.canvas = canvasRef?.current || null

        // this._selected = false
        this._disableResize = false
        this._disableSelection = false

        this.minSize = {width: 50, height: 50} // disable resizing below this number
        this.maxSize = {width: 500, height: 500} // disable resizing above this number

        this.cursor = Cursor.POINTER

        this.icon = "" // antd icon name representing this widget
        
        this.elementRef = React.createRef()

        this.attrs = {
            styling: {
                backgroundColor: {
                    tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                    value: ""
                },
                foregroundColor: {
                    tool: Tools.COLOR_PICKER,
                    value: ""
                },
            },
            layout: "show", // enables layout use "hide" to hide layout dropdown, takes the layout from this.layout
            events: {
                event1: {
                    tool: Tools.EVENT_HANDLER,
                    value: ""
                }
            }
        }

        this.functions = {
            "load": {"args1": "number", "args2": "string"}
        }


        this.layout = Layouts.PACK
        this.boundingRect = {
            x: 0,
            y: 0,
            height: 100,
            width: 100
        } 

        this.state = {
            attrs: { // attributes
                // replace this with this.props
            },
            zIndex: 0,
            pos: {x: 0, y: 0},
            size: { width: 100, height: 100 },
            selected: false,
            widgetName: widgetName  || 'unnamed widget', // this will later be converted to variable name
            resizing: false,
            resizeCorner: ""
        }

        this.mousePress = this.mousePress.bind(this)
        this.getElement = this.getElement.bind(this)
        this.getBoundingRect = this.getBoundingRect.bind(this)

        this.isSelected = this.isSelected.bind(this)

        this.getPos = this.getPos.bind(this)
        this.setPos = this.setPos.bind(this)

        this.startResizing = this.startResizing.bind(this)
        this.handleResize = this.handleResize.bind(this)
        this.stopResizing = this.stopResizing.bind(this)

    }   


    setComponentAdded(added=true){


        // this.elementRef = document.querySelector(`[data-id="${this.__id}"]`)

    }

    componentDidMount(){
        console.log("mounted: ")
        this.elementRef.current?.addEventListener("click", this.mousePress)

        this.canvas.addEventListener("mousemove", this.handleResize);
        this.canvas.addEventListener("mouseup", this.stopResizing)
    }

    componentWillUnmount(){
        this.elementRef.current?.removeEventListener("click", this.mousePress)

        this.canvas.addEventListener("mousemove", this.handleResize);
        this.canvas.addEventListener("mouseup", this.stopResizing)
    }

    // TODO: add context menu items such as delete, add etc
    contextMenu(){

    }

    getVariableName(){
        return toSnakeCase(this.state.widgetName)
    }

    mousePress(event){
        // event.preventDefault()
        if (!this._disableSelection){

            // const widgetSelected = new CustomEvent("selection:created", {
            //     detail: {
            //         event,
            //         id: this.__id,
            //         element: this
            //     },
            //     // bubbles: true // Allow the event to bubble up the DOM tree
            // })
            // this.canvas.dispatchEvent(widgetSelected)
        }
    }

    select(){
        this.setState({
            selected: true
        })
        console.log("selected")
    }

    deSelect(){
        this.setState({
            selected: false
        })
    }

    isSelected(){
        return this.state.selected
    }

    setPos(x, y){

        if (this.state.resizing){
            // don't change position when resizing the widget
            return
        }

        this.setState({
            pos: {x: x, y: y}
        })
    }

    getPos(){
        return this.state.pos
    }

    getProps(){
        return this.attrs
    }

    getBoundingRect(){
        return this.elementRef.current?.getBoundingClientRect()
    }

    getSize(){
        const boundingRect = this.getBoundingRect()

        return {width: boundingRect.width, height: boundingRect.height}
    }

    getScaleAwareDimensions() {
        // Get the bounding rectangle
        const rect = this.elementRef.current.getBoundingClientRect()
      
        // Get the computed style of the element
        const style = window.getComputedStyle(this.elementRef.current)
      
        // Get the transform matrix
        const transform = style.transform
      
        // Extract scale factors from the matrix
        let scaleX = 1
        let scaleY = 1
      
        if (transform && transform !== 'none') {
          // For 2D transforms (a, c, b, d)
          const matrix = transform.match(/^matrix\(([^,]+),[^,]+,([^,]+),[^,]+,[^,]+,[^,]+\)$/);
      
          if (matrix) {
            scaleX = parseFloat(matrix[1])
            scaleY = parseFloat(matrix[2])
          }
        }
      
        // Return scaled width and height
        return {
          width: rect.width / scaleX,
          height: rect.height / scaleY
        }
      }
      

    getWidgetFunctions(){
        return this.functions
    }

    getId(){
        return this.__id
    }

    getElement(){
        return this.elementRef.current
    }

    startResizing(corner, event) {
        event.stopPropagation()
        this.setState({ resizing: true, resizeCorner: corner })
    }

    handleResize(event) {
        if (!this.state.resizing) return

        const { resizeCorner, size, pos } = this.state
        const deltaX = event.movementX
        const deltaY = event.movementY

        let newSize = { ...size }
        let newPos = { ...pos }
        
        const {width: minWidth, height: minHeight} = this.minSize
        const {width: maxWidth, height: maxHeight} = this.maxSize
        console.log("resizing: ", minHeight, minHeight)

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

        this.setState({ size: newSize, pos: newPos })
    }

    stopResizing() {
        if (this.state.resizing) {
            this.setState({ resizing: false })
        }
    }

    renderContent(){
        // throw new NotImplementedError("render method has to be implemented")
        return (
            <div className="tw-w-full tw-h-full tw-bg-red-400">

            </div>
        )
    }

    /**
     * This is an internal methods don't override
     * @returns {HTMLElement}
     */
    render(){
        
        let style = {
            cursor: this.cursor,
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

        const onWidgetNameChange = (value) => {

            this.setState((prev) => ({
                ...prev,
                widgetName: value.length > 0 ? value : prev.widgetName
            }))
        }

        return (
            
            <div data-id={this.__id} ref={this.elementRef} className="tw-relative tw-w-fit tw-h-fit" 
                    style={style}
                >

                {this.renderContent()}
                <div className={`tw-absolute tw-bg-transparent tw-scale-[1.1] tw-opacity-100 
                                tw-w-full tw-h-full tw-top-0  
                                ${this.state.selected ? 'tw-border-2 tw-border-solid tw-border-blue-500' : 'tw-hidden'}`}>
                    
                    <div className="tw-relative tw-w-full tw-h-full">
                        <EditableDiv value={this.state.widgetName} onChange={onWidgetNameChange}
                                        maxLength={40}
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
        )

    }

}   


export default Widget