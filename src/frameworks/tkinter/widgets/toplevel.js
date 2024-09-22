import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"


class TopLevel extends Widget{

    static widgetType = "toplevel"

    constructor(props) {
        super(props)

        this.droppableTags = {
            exclude: ["image", "video", "media", "main_window", "toplevel"]
        }
        this.maxSize = { width: 2000, height: 2000 } // disables resizing above this number

        this.state = {
            ...this.state,
            size: { width: 450, height: 200 },
            attrs: {
                ...this.state.attrs,
                title: {
                    label: "Window Title",
                    tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: {placeholder: "Window title", maxLength: 40}, 
                    value: "Top level",
                    onChange: (value) => this.setAttrValue("title", value)
                }

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")
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
            title: this.state.attrs.title,
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
                <div className="tw-flex tw-w-full tw-h-[25px] tw-bg-[#c7c7c7] tw-p-1
                                tw-overflow-hidden tw-shadow-xl tw-place-items-center">
                    <div className="tw-text-sm">{this.getAttrValue("title")}</div>
                    <div className="tw-ml-auto tw-flex tw-gap-1  tw-place-items-center">
                        <div className="tw-bg-yellow-400 tw-rounded-full tw-w-[15px] tw-h-[15px]">
                        </div>
                        <div className="tw-bg-blue-400 tw-rounded-full tw-w-[15px] tw-h-[15px]">
                        </div>
                        <div className="tw-bg-red-400 tw-rounded-full tw-w-[15px] tw-h-[15px]">
                        </div>
                    </div>
                </div>
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start" style={this.state.widgetStyling}>
                    {this.props.children}
                </div>
            </div>
        )
    }

}


export default TopLevel