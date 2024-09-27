import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { removeKeyFromObject } from "../../../utils/common"
import { DownOutlined, UpOutlined } from "@ant-design/icons"
import {TkinterBase} from "./base"


class SpinBox extends TkinterBase{

    static widgetType = "spin_box"

    constructor(props) {
        super(props)

        this.droppableTags = null // disables drops

        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.state = {
            ...this.state,
            size: { width: 70, height: 'fit' },
            widgetName: "Spin box",
            attrs: {
                ...newAttrs,
                styling: {
                    ...newAttrs.styling,
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
        const defaultValue = this.getAttrValue("spinProps.defaultValue")

        const bg = this.getAttrValue("styling.backgroundColor")
        const fg = this.getAttrValue("styling.foregroundColor")
        return [
                `${variableName} = tk.Spinbox(master=${parent})`,
                `${variableName}.config(bg="${bg}", fg="${fg}", from_=${min}, to=${max}, 
                                    increment=${step})`,
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
                <div className="tw-p-2 tw-w-full tw-h-full tw-flex tw-place-items-center tw-justify-between" style={this.state.widgetInnerStyling}>
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