import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString, removeKeyFromObject } from "../../../utils/common"
import { DownOutlined, UpOutlined } from "@ant-design/icons"
import {TkinterBase, TkinterWidgetBase} from "./base"


class SpinBox extends TkinterWidgetBase{

    static widgetType = "spin_box"

    constructor(props) {
        super(props)

        this.state = {
            ...this.state,
            size: { width: 70, height: 'fit' },
            widgetName: "Spin box",
            attrs: {
                ...this.state.attrs,
                spinProps: {
                    label: "Properties",
                    display: "horizontal",
                    min: {
                        label: "Min",
                        tool: Tools.NUMBER_INPUT, // the tool to display, can be either HTML ELement or a constant string
                        toolProps: { placeholder: "min" },
                        value: 0,
                        onChange: (value) => this.setAttrValue("spinProps.min", value)
                    },
                    max: {
                        label: "Max",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: { placeholder: "max"},
                        value: 100,
                        onChange: (value) => this.setAttrValue("spinProps.max", value)
                    },
                    step: {
                        label: "Step",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: { placeholder: "max", stringMode: true, step: "0.1"},
                        value: 1,
                        onChange: (value) => this.setAttrValue("spinProps.step", value)
                    },
                    default: {
                        label: "Default",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: { placeholder: "max", stringMode: true, step: "0.1"},
                        value: 0,
                        onChange: (value) => this.setAttrValue("spinProps.default", value)
                    }
                },

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#fff")
    }

    generateCode(variableName, parent){

        const min = this.getAttrValue("spinProps.min")
        const max = this.getAttrValue("spinProps.max")
        const step = this.getAttrValue("spinProps.step")
        const defaultValue = this.getAttrValue("spinProps.default")

        const config = {
            from_: min,
            to: max,
            increment: step,
            value: defaultValue, 
            ...this.getConfigCode()
        }
        
        const code = []
        let spinBox =  `${variableName} = tk.Spinbox(master=${parent})`
        if (defaultValue){
            code.push(`${variableName}_var = tk.IntVar(${defaultValue})`)
            spinBox =  `${variableName} = tk.Spinbox(master=${parent}, textvariable=${variableName}_var)`
        }
        code.push(spinBox)

        return [
               ...code,
                `${variableName}.config(${convertObjectToKeyValueString(config)})`,
                `${variableName}.${this.getLayoutCode()}`
            ]
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()

        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            placeHolder: this.state.attrs.placeHolder,
            size: toolBarAttrs.size,

            ...this.state.attrs,

        })
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-flex tw-place-items-center tw-justify-between" 
                        style={this.getInnerRenderStyling()}>
                    <div className="tw-text-sm ">
                        {this.getAttrValue("spinProps.default")}
                    </div>
                    <div className="tw-flex tw-flex-col tw-text-black tw-gap-1 tw-text-sm">
                        <UpOutlined />
                        <DownOutlined />
                    </div>
                </div>
            </div>
        )
    }

}


export default SpinBox