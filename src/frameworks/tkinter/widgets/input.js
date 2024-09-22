import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"


class Input extends Widget{

    static widgetType = "input"
    // TODO: override the widgetName value
    constructor(props) {
        super(props)

        this.droppableTags = {
            // TODO: exclude all
            exclude: ["image", "video", "media", "main_window", "toplevel"]
        }

        this.state = {
            ...this.state,
            size: { width: 120, height: 40 },
            attrs: {
                ...this.state.attrs,
                styling: {
                    ...this.state.attrs.styling,
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
                placeHolder: {
                    label: "PlaceHolder",
                    tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: {placeholder: "text", maxLength: 100}, 
                    value: "placeholder text",
                    onChange: (value) => this.setAttrValue("placeHolder", value)
                }

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#fff")
    }

    getToolbarAttrs(){
        return ({
            id: this.__id,
            widgetName: {
                label: "Widget Name",
                tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                toolProps: { placeholder: "Widget name", maxLength: 40 },
                value: this.state.widgetName,
                onChange: (value) => this.setWidgetName(value)
            },
            placeHolder: this.state.attrs.placeHolder,
            size: {
                label: "Size",
                display: "horizontal",
                width: {
                    label: "Width",
                    tool: Tools.NUMBER_INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: { placeholder: "width", max: this.maxSize.width, min: this.minSize.width },
                    value: this.state.size.width || 100,
                    onChange: (value) => this.setWidgetSize(value, null)
                },
                height: {
                    label: "Height",
                    tool: Tools.NUMBER_INPUT,
                    toolProps: { placeholder: "height", max: this.maxSize.height, min: this.minSize.height },
                    value: this.state.size.height || 100,
                    onChange: (value) => this.setWidgetSize(null, value)
                },
            },

            ...this.state.attrs,

        })
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start " style={this.state.widgetStyling}>
                    <div className="tw-text-sm tw-text-gray-300">
                        {this.getAttrValue("placeHolder")}
                    </div>
                </div>
            </div>
        )
    }

}


export default Input