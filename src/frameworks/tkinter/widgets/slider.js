import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString, removeKeyFromObject } from "../../../utils/common"
import {TkinterBase, TkinterWidgetBase} from "./base"


class Slider extends TkinterWidgetBase{

    static widgetType = "scale"

    constructor(props) {
        super(props)

        this.state = {
            ...this.state,
            widgetName: "Scale",
            size: { width: 'fit', height: 'fit' },
            attrs: {
                ...this.state.attrs,
                styling: {
                    ...this.state.attrs.styling,
                    // TODO: trough color
                    troughColor: {
                        label: "Trough Color",
                        tool: Tools.COLOR_PICKER, 
                        value: "#fff",
                        onChange: (value) => {
                            // this.setWidgetInnerStyle("color", value)
                            this.setAttrValue("styling.troughColor", value)
                        }
                    }
                },
                scale: {
                    label: "Scale",
                    display: "horizontal",
                    min: {
                        label: "Min",
                        tool: Tools.NUMBER_INPUT, // the tool to display, can be either HTML ELement or a constant string
                        toolProps: { placeholder: "min" },
                        value: 0,
                        onChange: (value) => this.setAttrValue("scale.min", value)
                    },
                    max: {
                        label: "Max",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: { placeholder: "max"},
                        value: 100,
                        onChange: (value) => this.setAttrValue("scale.max", value)
                    },
                    step: {
                        label: "Step",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: { placeholder: "max", stringMode: true, step: "0.1"},
                        value: 1,
                        onChange: (value) => this.setAttrValue("scale.step", value)
                    },
                    default: {
                        label: "Default",
                        tool: Tools.NUMBER_INPUT,
                        toolProps: { placeholder: "max", stringMode: true, step: "0.1"},
                        value: 0,
                        onChange: (value) => this.setAttrValue("scale.default", value)
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
        // TODO: add orientation
        
        const config = this.getConfigCode()

        config["_from"] = this.getAttrValue("scale.min")
        config["to"] = this.getAttrValue("scale.max")
        config["resolution"] = this.getAttrValue("scale.step")

        const defaultValue = this.getAttrValue("defaultValue")

        return [
                `${variableName}_var = tk.DoubleVar(${defaultValue})`,
                `${variableName} = tk.Scale(master=${parent}, variable=${variableName}_var)`,
                `${variableName}.config(${config})`,
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
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                    <div className="w-full max-w-md">
                        <input
                            type="range"
                            min={this.getAttrValue("scale.min")}
                            max={this.getAttrValue("scale.max")}
                            step={this.getAttrValue("scale.step")}
                            value={this.getAttrValue("scale.default")}
                            className="tw-pointer-events-none w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                       
                    </div>
                </div>
            </div>
        )
    }

}


export default Slider