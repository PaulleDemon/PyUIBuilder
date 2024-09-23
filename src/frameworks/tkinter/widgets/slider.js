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
            size: { width: 120, height: 40 },
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
                <div className="tw-p-2 tw-w-full tw-h-full tw-flex tw-place-items-center" style={this.state.widgetStyling}>
                    <div className="tw-text-sm tw-text-gray-300">
                        {this.getAttrValue("placeHolder")}
                    </div>
                </div>
            </div>
        )
    }

}


export default Slider