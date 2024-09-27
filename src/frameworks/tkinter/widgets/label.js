import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString } from "../../../utils/common"
import { TkinterWidgetBase } from "./base"


class Label extends TkinterWidgetBase{

    static widgetType = "label"

    constructor(props) {
        super(props)


        this.state = {
            ...this.state,
            widgetName: "Label",
            size: { width: 80, height: 40 },
            attrs: {
                ...this.state.attrs,
                labelWidget: {
                    label: "Text",
                    tool: Tools.INPUT, 
                    toolProps: {placeholder: "text", maxLength: 100}, 
                    value: "Label",
                    onChange: (value) => this.setAttrValue("labelWidget", value)
                },
                imageUpload: {
                    label: "Image",
                    tool: Tools.UPLOADED_LIST, 
                    toolProps: {filterOptions: ["image/jpg", "image/jpeg", "image/png"]}, 
                    value: "",
                    onChange: (value) => this.setAttrValue("imageUpload", value)
                },
            }
        }
        
    }

    componentDidMount(){
        super.componentDidMount()
        
        
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")
        // this.setWidgetName("label") // Don't do this this causes issues while loading data

    }


    generateCode(variableName, parent){

        const labelText = this.getAttrValue("labelWidget")
        const config = convertObjectToKeyValueString(this.getConfigCode())

        return [
                `${variableName} = tk.Label(master=${parent}, text="${labelText}")`,
                `${variableName}.config(${config})`,
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
            <div className="tw-w-flex tw-flex-col tw-w-full tw-content-start tw-h-full tw-rounded-md tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full  tw-flex tw-place-content-center tw-place-items-center " 
                        style={this.state.widgetInnerStyling}>
                    {/* {this.props.children} */}
                    <div className="" style={{color: this.getAttrValue("styling.foregroundColor")}}>
                        {this.getAttrValue("labelWidget")}
                    </div>
                </div>
            </div>
        )
    }

}


export default Label