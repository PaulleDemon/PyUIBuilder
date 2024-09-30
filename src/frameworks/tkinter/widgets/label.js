import Tools from "../../../canvas/constants/tools"
import { convertObjectToKeyValueString } from "../../../utils/common"
import { getPythonAssetPath } from "../../utils/pythonFilePath"
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

    getImports(){
        const imports = super.getImports()
        
        if (this.getAttrValue("imageUpload"))
            imports.push("import os", "from PIL import Image, ImageTk", )

        return imports
    }

    getRequirements(){
        const requirements = super.getRequirements()

        
        if (this.getAttrValue("imageUpload"))
            requirements.push("pillow")

        return requirements
    }

    generateCode(variableName, parent){


        const labelText = this.getAttrValue("labelWidget")
        const config = convertObjectToKeyValueString(this.getConfigCode())
        const image = this.getAttrValue("imageUpload")

        let labelInitialization = `${variableName} = tk.Label(master=${parent}, text="${labelText}")`

        const code = []

        if (image?.name){
            code.push(`${variableName}_img = Image.open(${getPythonAssetPath(image.name, "image")})`)
            code.push(`${variableName}_img = ImageTk.PhotoImage(${variableName}_img)`)
            // code.push("\n")
            labelInitialization = `${variableName} = tk.Label(master=${parent}, image=${variableName}_img, text="${labelText}", compound=tk.TOP)`
        }

        // code.push("\n")
        code.push(labelInitialization)
        return [
                ...code,
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

        const image = this.getAttrValue("imageUpload")
        
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-content-start tw-h-full tw-rounded-md tw-overflow-hidden"
                    style={{
                        flexGrow: 1, // Ensure the content grows to fill the parent
                        minWidth: '100%', // Force the width to 100% of the parent
                        minHeight: '100%', // Force the height to 100% of the parent
                    }}
                >
                <div className="tw-p-2 tw-w-full tw-h-full  tw-flex tw-place-content-center tw-place-items-center " 
                        style={this.getInnerRenderStyling()}>
                    {/* {this.props.children} */}
                    {
                        image && (
                            <img src={image.previewUrl} className="tw-bg-contain tw-w-full tw-h-full" />
                        )
                    }
                    <div className="" style={{color: this.getAttrValue("styling.foregroundColor")}}>
                        {this.getAttrValue("labelWidget")}
                    </div>
                </div>
            </div>
        )
    }

}


export default Label