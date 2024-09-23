import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { removeKeyFromObject } from "../../../utils/common"


class Button extends Widget{

    static widgetType = "button"

    constructor(props) {
        super(props)

        // TODO: disable drop

        this.droppableTags = {
            // TODO: exclude all
            exclude: ["image", "video", "media", "main_window", "toplevel"]
        }
        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.state = {
            ...this.state,
            size: { width: 80, height: 40 },
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
        this.setWidgetName("button")
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")
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
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start " style={this.state.widgetStyling}>
                    {/* {this.props.children} */}
                    <div className="tw-text-sm" style={{color: this.getAttrValue("styling.foregroundColor")}}>
                        {this.getAttrValue("buttonLabel")}
                    </div>
                </div>
            </div>
        )
    }

}


export default Button