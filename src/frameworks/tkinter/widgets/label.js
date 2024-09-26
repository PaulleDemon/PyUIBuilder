import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { removeKeyFromObject } from "../../../utils/common"
import TkinterBase from "./base"
import { Layouts } from "../../../canvas/constants/layouts"


class Label extends TkinterBase{

    static widgetType = "label"

    constructor(props) {
        super(props)

        this.droppableTags = null

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
                            this.setWidgetInnerStyle("color", value)
                            this.setAttrValue("styling.foregroundColor", value)
                        }
                    }
                },
                labelWidget: {
                    label: "Text",
                    tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: {placeholder: "text", maxLength: 100}, 
                    value: "Label",
                    onChange: (value) => this.setAttrValue("labelWidget", value)
                }

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")
        this.setWidgetName("label")
    }


    generateCode(variableName, parent){

        const labelText = this.getAttrValue("labelWidget")
        const bg = this.getAttrValue("styling.backgroundColor")
        const fg = this.getAttrValue("styling.foregroundColor")
        return [
                `${variableName} = tk.Label(master=${parent}, text="${labelText}")`,
                `${variableName}.config(bg="${bg}", fg="${fg}")`,
                `${variableName}.${this.getLayoutCode()}`
            ]
    }


    getToolbarAttrs(){
        const toolBarAttrs = super.getToolbarAttrs()

        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            labelWidget: this.state.attrs.labelWidget,
            size: toolBarAttrs.size,

            ...this.state.attrs,

        })
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full  tw-flex tw-place-content-center tw-place-items-center " style={this.state.widgetInnerStyling}>
                    {/* {this.props.children} */}
                    <div className="tw-text-sm" style={{color: this.getAttrValue("styling.foregroundColor")}}>
                        {this.getAttrValue("labelWidget")}
                    </div>
                </div>
            </div>
        )
    }

}


export default Label