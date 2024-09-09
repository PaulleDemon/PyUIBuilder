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
            selected: false,
            widgetName: widgetName  || 'unnamed widget' // this will later be converted to variable name
        }

        this.mousePress = this.mousePress.bind(this)
        this.getElement = this.getElement.bind(this)

        this.isSelected = this.isSelected.bind(this)

        this.getPos = this.getPos.bind(this)
        this.setPos = this.setPos.bind(this)

    }   


    setComponentAdded(added=true){


        // this.elementRef = document.querySelector(`[data-id="${this.__id}"]`)

    }

    componentDidMount(){
        console.log("mounted: ")
        this.elementRef.current?.addEventListener("click", this.mousePress)
    }

    componentWillUnmount(){
        this.elementRef.current?.removeEventListener("click", this.mousePress)
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
        console.log("DeSelected")

    }

    isSelected(){
        return this.state.selected
    }

    setPos(x, y){
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

    getWidgetFunctions(){
        return this.functions
    }

    getId(){
        return this.__id
    }

    getElement(){
        return this.elementRef.current
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
            width: this.boundingRect.width,
            height: this.boundingRect.height
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
                                ${this.state.selected ? 'tw-border-2 tw-border-solid tw-border-blue-500' : 'tw-border-none'}`}>
                    
                    <div className="tw-relative tw-w-full tw-h-full">

                        {/* <div contentEditable="true" onClick={(e) => e.preventDefault()} className="tw-text-sm tw-w-fit tw-min-w-[100px] tw-absolute tw--top-2">
                            {this._widgetName}
                        </div> */}
                        { this.state.selected &&
                            <EditableDiv value={this.state.widgetName} onChange={onWidgetNameChange}
                                        maxLength={40}
                                        className="tw-text-sm tw-w-fit tw-max-w-[160px] tw-text-clip tw-min-w-[150px] 
                                                    tw-overflow-hidden tw-absolute tw--top-4 tw-h-6"
                                />
                        }
                    </div>

                

                </div>
            </div>
        )

    }

}   


export default Widget