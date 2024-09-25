import Widget from "../../../canvas/widgets/base"

import Tools from "../../../canvas/constants/tools"
import { removeKeyFromObject } from "../../../utils/common"
import { ArrowDownOutlined, DownOutlined } from "@ant-design/icons"
import TkinterBase from "./base"


class OptionMenu extends TkinterBase{

    static widgetType = "option_menu"
    // FIXME: the radio buttons are not visible because of the default heigh provided
    constructor(props) {
        super(props)

        this.droppableTags = null // disables drops

        // const {layout, ...newAttrs} = this.state.attrs // Removes the layout attribute

        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.minSize = {width: 50, height: 30}
        
        
        this.state = {
            ...this.state,
            isDropDownOpen: false,
            size: { width: 120, height: 'fit' },
            attrs: {
                ...newAttrs,
                styling: {
                    label: "styling",
                    foregroundColor: {
                        label: "Foreground Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "#000",
                        onChange: (value) => {
                            this.setWidgetInnerStyle("color", value)
                            this.setAttrValue("styling.foregroundColor", value)
                        }
                    }
                },
               
                defaultValue: {
                    label: "Default Value",
                    tool: Tools.INPUT,
                    value: "Select option",
                    onChange: ({inputs, selectedRadio}) => {
                        this.setAttrValue("options", {inputs, selectedRadio})
                    }
                },
                options: {
                    label: "Options",
                    tool: Tools.INPUT_RADIO_LIST,
                    value: {inputs: ["option 1"], selectedRadio: -1},
                    onChange: ({inputs, selectedRadio}) => {
                        this.setAttrValue("options", {inputs, selectedRadio})
                    }
                }

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        // this.setAttrValue("styling.backgroundColor", "#fff")
        this.setWidgetName("Option menu")
        this.setWidgetInnerStyle("backgroundColor", "#fff")
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()

        const attrs = this.state.attrs
        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            checkLabel: attrs.checkLabel,
            size: toolBarAttrs.size,
            ...attrs,
        })
    }

    toggleDropDownOpen = () => {
        this.setState((prev) => ({
            isDropDownOpen: !prev.isDropDownOpen
        }))
    }

    renderContent(){

        const {inputs, selectedRadio} = this.getAttrValue("options")

        return (
            <div className="tw-flex tw-p-1 tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden"
                style={this.state.widgetInnerStyling}
                onClick={this.toggleDropDownOpen}
                >
                <div className="tw-flex tw-justify-between tw-gap-1">
                    {this.getAttrValue("defaultValue")}
                    
                    <div className="tw-text-sm">
                        <DownOutlined />
                    </div>
                </div>
                {this.state.isDropDownOpen &&
                    <div className="tw-absolute tw-p-1 tw-bg-white tw-rounded-md tw-shadow-md tw-left-0 
                                    tw-w-full tw-h-fit " 
                                    style={{top: "calc(100% + 5px)"}}
                                    >
                        { 
                            inputs.map((value, index) => {
                                return (
                                    <div key={index} className="tw-flex tw-gap-2 tw-w-full tw-h-full tw-place-items-center
                                                                hover:tw-bg-[#c5c5c573] tw-p-1">
                                    
                                        <span className="tw-text-base" style={{color: this.state.widgetInnerStyling.foregroundColor}}>
                                            {value}
                                        </span>
                                    </div>
                                )
                            })  
                        }
                    </div>
                }
                
            </div>
        )
    }

}


export default OptionMenu