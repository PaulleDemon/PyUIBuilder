import Tools from "../../../canvas/constants/tools"
import {  DownOutlined } from "@ant-design/icons"
import { TkinterWidgetBase} from "./base"
import { convertObjectToKeyValueString } from "../../../utils/common"


class OptionMenu extends TkinterWidgetBase{

    static widgetType = "option_menu"

    constructor(props) {
        super(props)

        // const {layout, ...newAttrs} = this.state.attrs // Removes the layout attribute

        this.minSize = {width: 50, height: 30}
                
        this.state = {
            ...this.state,
            isDropDownOpen: false,
            widgetName: "Option menu",
            size: { width: 120, height: 30 },
            fitContent: { width: true, height: true },
            attrs: {
                ...this.state.attrs,
                defaultValue: {
                    label: "Default Value",
                    tool: Tools.INPUT,
                    value: "Select option",
                    onChange: ({inputs, selectedRadio}) => {
                        this.setAttrValue("options", {inputs, selectedRadio})
                    }
                },
                widgetOptions: {
                    label: "Options",
                    tool: Tools.INPUT_RADIO_LIST,
                    value: {inputs: ["option 1"], selectedRadio: -1},
                    onChange: ({inputs, selectedRadio}) => {
                        this.setAttrValue("widgetOptions", {inputs, selectedRadio})
                    }
                }

            }
        }

    }

    componentDidMount(){
        super.componentDidMount()
        this.setWidgetInnerStyle("backgroundColor", "#fff")
    }

    generateCode(variableName, parent){

        
        const config = convertObjectToKeyValueString(this.getConfigCode())

        const defaultValue = this.getAttrValue("defaultValue")
        const options = this.getAttrValue("widgetOptions").inputs

        const code = [
            `${variableName}_options = ${JSON.stringify(options)}`,
            `${variableName}_var = tk.StringVar(value="${options.at(1) || defaultValue || ''}")`,
            `${variableName} = tk.OptionMenu(${parent}, ${variableName}_var, *${variableName}_options)`
        ]


        return [
                ...code,
                `${variableName}.config(${config})`,
                `${variableName}.${this.getLayoutCode()}`
            ]
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

        const {inputs, selectedRadio} = this.getAttrValue("widgetOptions")

        return (
            <div className="tw-flex tw-p-1 tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden"
                style={this.getInnerRenderStyling()}
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