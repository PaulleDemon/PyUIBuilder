import React from "react"

import { timePicker, timePickerInput } from 'analogue-time-picker'

import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { removeKeyFromObject } from "../../../utils/common"


class AnalogTimePicker extends Widget{

    static widgetType = "analogue_timepicker"

    constructor(props) {
        super(props)

        this.droppableTags = null
        
        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.timePicker = null

        this.timePickerRef = React.createRef()

        this.state = {
            ...this.state,
            size: { width: 'fit', height: 'fit' },
            attrs: {
                ...newAttrs,
                styling: {
                    ...newAttrs.styling,
                    foregroundColor: {
                        label: "Foreground Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#000",
                        onChange: (value) => {
                            this.setWidgetStyling("color", value)
                            this.setAttrValue("styling.foregroundColor", value)
                        }
                    }
                },
                buttonLabel: {
                    label: "Button Label",
                    tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: {placeholder: "Button label", maxLength: 100}, 
                    value: "Button",
                    onChange: (value) => this.setAttrValue("buttonLabel", value)
                }

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setWidgetName("Time picker")
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")

        this.timePicker = timePicker({
                                element: this.timePickerRef.current,
                                mode: "12"
                            })
        
        const timePickerBtns = this.timePickerRef.current.getElementsByClassName("atp-clock-btn")
        for (let i = 0; i < timePickerBtns.length; i++) {
            timePickerBtns[i].remove()
        }
    }

    componentWillUnmount(){
        this.timePicker.dispose()
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()


        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            buttonLabel: this.state.attrs.buttonLabel,
            size: toolBarAttrs.size,

            ...this.state.attrs,

        })
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md 
                            tw-border tw-border-solid tw-border-gray-400 tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start tw-pointer-events-none" 
                        style={this.state.widgetStyling} ref={this.timePickerRef}>
                    
                </div>
            </div>
        )
    }

}


export default AnalogTimePicker