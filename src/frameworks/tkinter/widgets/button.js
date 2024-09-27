import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString } from "../../../utils/common"
import { TkinterWidgetBase } from "./base"


class Button extends TkinterWidgetBase{

    static widgetType = "button"

    constructor(props) {
        super(props)

        this.state = {
            ...this.state,
            size: { width: 80, height: 40 },
            widgetName: "Button",
            attrs: {
                ...this.state.attrs,
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
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")
    }

    generateCode(variableName, parent){

        const labelText = this.getAttrValue("buttonLabel")

        const config = convertObjectToKeyValueString(this.getConfigCode())

        return [
                `${variableName} = tk.Button(master=${parent}, text="${labelText}")`,
                `${variableName}.config(${config})`,
                `${variableName}.${this.getLayoutCode()}`
            ]
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
                <div className="tw-p-2 tw-w-full tw-flex tw-place-content-center tw-place-items-center tw-h-full tw-text-center" 
                        style={this.state.widgetInnerStyling}>
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