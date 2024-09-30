import React from "react"

import { timePicker } from 'analogue-time-picker'

import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString, removeKeyFromObject } from "../../../utils/common"
import { CustomTkBase } from "../widgets/base"

import "./styles/timepickerStyle.css"


const Themes = {
    NAVY_BLUE: "Navy Blue",
    DRACULA: "Dracula",
    PURPLE: "Purple",
    NONE: ""
}

class AnalogTimePicker extends CustomTkBase{

    static widgetType = "analog_timepicker"

    static requiredImports = [
                                ...CustomTkBase.requiredImports, 
                                'from tktimepicker import AnalogPicker, AnalogThemes, constants'
                            ]
    
    static requirements = ["tkTimePicker"]

    constructor(props) {
        super(props)

        this.droppableTags = null
        
        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.timePicker = null

        this.timePickerRef = React.createRef()

        this.minSize = {width: 100, height: 100}

        this.state = {
            ...this.state,
            widgetName: "Timepicker",
            size: { width: 250, height: 350 },
            attrs: {
                ...newAttrs,
                styling: {
                    theme:{
                        label: "Theme",
                        tool: Tools.SELECT_DROPDOWN, 
                        toolProps: {placeholder: "select theme"},
                        value: "",
                        options: Object.values(Themes).map(val => ({value: val, label: val})),
                        onChange: (value) => this.handleThemeChange(value)
                    },
                    ...newAttrs.styling,
                    clockColor: {
                        label: "Clock Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#EEEEEE",
                        onChange: (value) => {
                            this.setAttrValue("styling.clockColor", value)
                        }
                    },
                    displayColor: {
                        label: "Display Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#000",
                        onChange: (value) => {
                            this.setAttrValue("styling.displayColor", value)
                        }
                    },
                    numberColor: {
                        label: "Numbers Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#000",
                        onChange: (value) => {
                            this.setAttrValue("styling.numberColor", value)
                        }
                    },
                    handleColor: {
                        label: "Handle Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#000000",
                        onChange: (value) => {
                            this.setAttrValue("styling.handleColor", value)
                        }
                    },
                    
                },
                clockMode:{
                    label: "Clock Mode",
                    tool: Tools.SELECT_DROPDOWN, 
                    toolProps: {placeholder: "select mode", defaultValue: 12},
                    value: 12,
                    options: [12, 24].map(val => ({value: val, label: val})),
                    onChange: (value) => {
                        this.setAttrValue("clockMode", value)
                        if (value === 24){
                            // FIXME: the timepicker for 24 hrs also shows 12 hrs time
                            
                            this.timePicker.set24h()

                        }else{
                            this.timePicker.set12h()
                        }
                    }
                },

            }
        }

        this.handleThemeChange = this.handleThemeChange.bind(this)
    }

    componentDidMount(){
        super.componentDidMount()
        this.timePicker = timePicker({
                                element: this.timePickerRef.current,
                                mode: "12",
                                width: this.state.size.width,
                                // height: this.state.size.height
                            })
        
        // used to remove ok and cancel buttons
        const timePickerBtns = this.timePickerRef.current.getElementsByClassName("atp-clock-btn")
        for (let i = 0; i < timePickerBtns.length; i++) {
            timePickerBtns[i].remove()
        }
    }

    componentWillUnmount(){
        this.timePicker.dispose()
    }

    setResize(pos, size){
        super.setResize(pos, size)
        this.timePicker.setWidth(size.width)
    }

    handleThemeChange(value){
        this.setAttrValue("styling.theme", value)

        if (value === Themes.NAVY_BLUE){
            this.setAttrValue("styling.handleColor", "#009688")
            this.setAttrValue("styling.displayColor", "#009688")
            this.setAttrValue("styling.backgroundColor", "#fff")
            this.setAttrValue("styling.clockColor", "#EEEEEE")
            this.setAttrValue("styling.numberColor", "#000")
        }else if (value === Themes.DRACULA){
            this.setAttrValue("styling.handleColor", "#863434")
            this.setAttrValue("styling.displayColor", "#404040")
            this.setAttrValue("styling.backgroundColor", "#404040")
            this.setAttrValue("styling.clockColor", "#363636")
            this.setAttrValue("styling.numberColor", "#fff")
        }else if (value === Themes.PURPLE){
            this.setAttrValue("styling.handleColor", "#EE333D")
            this.setAttrValue("styling.displayColor", "#71135C")
            this.setAttrValue("styling.backgroundColor", "#4E0D3A")
            this.setAttrValue("styling.clockColor", "#71135C")
            this.setAttrValue("styling.numberColor", "#fff")
        }

    }

    generateCode(variableName, parent){

        const theme = this.getAttrValue("styling.theme")

        const mode = this.getAttrValue("clockMode")
        const bgColor = this.getAttrValue("styling.backgroundColor")
        const clockColor = this.getAttrValue("styling.clockColor")
        const displayColor = this.getAttrValue("styling.displayColor")
        const numColor = this.getAttrValue("styling.numberColor")
        const handleColor = this.getAttrValue("styling.handleColor")

        const code = [
            `${variableName} = AnalogPicker(parent=${parent}, type=${mode===12 ? "constants.HOURS12" : "constants.HOURS24"})`,
        ]

        if (theme){

            code.push(`${variableName}_theme = AnalogThemes(${variableName})`)
            if (theme === Themes.NAVY_BLUE){
                code.push(`${variableName}_theme.setNavyBlue()`)
            }else if (theme === Themes.DRACULA){
                code.push(`${variableName}_theme.setDracula()`)
            }else if (theme === Themes.PURPLE){
                code.push(`${variableName}_theme.setPurple()`)
            }

        }else{

            const configAnalog = {
                "canvas_bg": `"${bgColor}"`,
                "textcolor": `"${numColor}"`,
                "bg": `"${clockColor}"`,
                "handcolor": `"${handleColor}"`,
                "headcolor": `"${handleColor}"`
            }

            const displayConfig = {
                bg: `"${displayColor}"`
            }

            code.push(`${variableName}.configAnalog(${convertObjectToKeyValueString(configAnalog)})`)
            code.push(`${variableName}.configSpin(${convertObjectToKeyValueString(displayConfig)})`)


            // code.push(`configAnalog(canvas_bg="${bgColor}", textcolor="${numColor}", 
            //                         bg="${clockColor}", handcolor="${handleColor}", headcolor="${handleColor}")`)

            // code.push(`configSpin(bg="${displayColor}"`)
        }

        return [
                ...code,
                `${variableName}.${this.getLayoutCode()}`
            ]
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()


        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            size: toolBarAttrs.size,

            ...this.state.attrs,

        })
    }

    
    renderContent(){
        const timePickerStyling = { 
                '--bg': this.getAttrValue("styling.backgroundColor"), 
                '--clock-color': this.getAttrValue("styling.clockColor"), 
                '--number-color': this.getAttrValue("styling.numberColor"), 
                '--time-display': this.getAttrValue("styling.displayColor"), 
                '--main-handle-color': this.getAttrValue("styling.handleColor"), 
            }

        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md 
                            tw-border tw-border-solid tw-border-gray-400 tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-flex tw-content-start tw-pointer-events-none" 
                        style={timePickerStyling} 
                        ref={this.timePickerRef}>
                    
                </div>
            </div>
        )
    }

}


export default AnalogTimePicker