import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { removeKeyFromObject } from "../../../utils/common"


class Slider extends Widget{

    static widgetType = "scale"

    constructor(props) {
        super(props)

        this.droppableTags = null // disables drops

        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

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
        this.setWidgetName("Scale")
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