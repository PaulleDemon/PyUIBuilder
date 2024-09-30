import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString } from "../../../utils/common"
import { TkinterWidgetBase } from "./base"


export class Input extends TkinterWidgetBase{

    static widgetType = "entry"
    
    constructor(props) {
        super(props)

        this.state = {
            ...this.state,
            size: { width: 120, height: 40 },
            widgetName: "Entry",
            attrs: {
                ...this.state.attrs,
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

    generateCode(variableName, parent){

        const placeHolderText = this.getAttrValue("placeHolder")
        
        const config = convertObjectToKeyValueString(this.getConfigCode())

        return [
                `${variableName} = tk.Entry(master=${parent}, text="${placeHolderText}")`,
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
                <div className="tw-p-2 tw-w-full tw-h-full tw-flex tw-place-items-center" 
                        style={this.getInnerRenderStyling()}>
                    <div className="tw-text-sm tw-text-gray-300">
                        {this.getAttrValue("placeHolder")}
                    </div>
                </div>
            </div>
        )
    }

}


export class Text extends TkinterWidgetBase{

    static widgetType = "Text"

    constructor(props) {
        super(props)

        this.state = {
            ...this.state,
            size: { width: 120, height: 80 },
            attrs: {
                ...this.state.attrs,
                // placeHolder: {
                //     label: "PlaceHolder",
                //     tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                //     toolProps: {placeholder: "text", maxLength: 100}, 
                //     value: "placeholder text",
                //     onChange: (value) => this.setAttrValue("placeHolder", value)
                // }

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#fff")
        this.setWidgetName("text")
    }

    generateCode(variableName, parent){

        const placeHolderText = this.getAttrValue("placeHolder")
        
        const config = convertObjectToKeyValueString(this.getConfigCode())

        return [
                `${variableName} = tk.Text(master=${parent})`,
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
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start " 
                        style={this.getInnerRenderStyling()}>
                    <div className="tw-text-sm tw-text-gray-300">
                        {this.getAttrValue("placeHolder")}
                    </div>
                </div>
            </div>
        )
    }

}
