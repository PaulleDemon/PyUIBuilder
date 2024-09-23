import Widget from "../../../canvas/widgets/base"

import Tools from "../../../canvas/constants/tools"
import { Checkbox } from "antd"
import { removeKeyFromObject } from "../../../utils/common"
import { CheckOutlined, CheckSquareFilled } from "@ant-design/icons"


export class CheckBox extends Widget{

    static widgetType = "check_button"
    // TODO: remove layouts
    constructor(props) {
        super(props)

        this.droppableTags = null // disables drops

        // const {layout, ...newAttrs} = this.state.attrs // Removes the layout attribute

        let newAttrs = removeKeyFromObject("layout", this.state.attrs)
        newAttrs = removeKeyFromObject("styling.backgroundColor", newAttrs)

        this.minSize = {width: 50, height: 30}

        this.state = {
            ...this.state,
            size: { width: 120, height: 30 },
            attrs: {
                ...newAttrs,
                styling: {
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
                checkLabel: {
                    label: "Check Label",
                    tool: Tools.INPUT, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: {placeholder: "Button label", maxLength: 100}, 
                    value: "Checkbox",
                    onChange: (value) => this.setAttrValue("checkLabel", value)
                },
                defaultChecked: {
                    label: "Checked",
                    tool: Tools.CHECK_BUTTON, // the tool to display, can be either HTML ELement or a constant string
                    toolProps: {placeholder: "text", maxLength: 100}, 
                    value: true,
                    onChange: (value) => this.setAttrValue("defaultChecked", value)
                }

            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        // this.setAttrValue("styling.backgroundColor", "#fff")
        this.setWidgetName("Checkbox")
        this.setWidgetStyling("backgroundColor", "#fff0")
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()

        const attrs = this.state.attrs
        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            checkLabel: attrs.checkLabel,
            size: toolBarAttrs.size,
            ...attrs,
        })
    }

    renderContent(){
        return (
            <div className="tw-flex tw-p-1 tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden"
                style={this.state.widgetStyling}
                >
                
                <div className="tw-flex tw-gap-2 tw-w-full tw-h-full tw-place-items-center tw-place-content-center">
                    <div className="tw-border-solid tw-border-[#D9D9D9] tw-border-2
                                    tw-min-w-[20px] tw-min-h-[20px] tw-w-[20px] tw-h-[20px] 
                                    tw-text-blue-600 tw-flex tw-items-center tw-justify-center
                                    tw-rounded-md tw-overflow-hidden">
                        {
                            this.getAttrValue("defaultChecked") === true &&
                            <CheckSquareFilled className="tw-text-[20px]" />
                        }
                    </div>


                    {this.getAttrValue("checkLabel")}
                </div>
              
            </div>
        )
    }

}