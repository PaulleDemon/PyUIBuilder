import React from "react"
import { NotImplementedError } from "../../utils/errors"

import Tools from "../constants/tools"
import Layouts from "../constants/layouts"
import Cursor from "../constants/cursor"



/**
 * Base class to be extended
 */
class Widget extends React.Component{

    static widgetType = "widget"

    constructor(props){
        super(props)

        const {id} = props
        console.log("Id: ", id)
        // this id has to be unique inside the canvas, it will be set automatically and should never be changed
        this.__id = id
        this._zIndex = 0

        this._selected = false
        this._disableResize = false
        this._disableSelection = false

        this.cursor = Cursor.POINTER

        this.icon = "" // antd icon name representing this widget
        
        this.elementRef = React.createRef()

        this.props = {
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
            zIndex: 0
        }

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

    mousePress(event){

        if (!this._disableSelection){
            this._selected = true

            const widgetSelected = new CustomEvent("selection:created", {
                detail: {
                    event,
                    id: this.__id,
                    element: this
                },
            })
            console.log("dispatched")
            document.dispatchEvent(widgetSelected)
        }
    }

    select(){
        this._selected = true
    }

    deSelect(){
        this._selected = false
    }

    getProps(){
        return this.props
    }

    getWidgetFunctions(){
        return this.functions
    }

    getId(){
        return this.__id
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
            top: "40px",  
            left: "40px",  
            width: this.boundingRect.width,
            height: this.boundingRect.height
        }

        let selectionStyle = {
            x: "-5px",
            y: "-5px",
            width: this.boundingRect.width + 5,
            height: this.boundingRect.height + 5
        }

        return (
            
            <div data-id={this.__id} ref={this.elementRef} className="tw-relative tw-w-fit tw-h-fit" style={style}
                >

                {this.renderContent()}
                <div className="tw-absolute tw-bg-transparent tw-scale-[1.1] tw-opacity-35 
                                tw-w-full tw-h-full tw-top-0 tw-border-2 tw-border-solid tw-border-black">
                    
                    <div className="">

                    </div>

                </div>
            </div>
        )

    }

}   


export default Widget