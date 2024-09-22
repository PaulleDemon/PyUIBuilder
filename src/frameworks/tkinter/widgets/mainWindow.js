import { CloseCircleFilled, ExpandOutlined, MinusCircleFilled } from "@ant-design/icons"
import Widget from "../../../canvas/widgets/base"


class MainWindow extends Widget{

    static widgetType = "main_window"

    constructor(props) {
        super(props)

        this.droppableTags = {
            exclude: ["image", "video", "media"]
        }

        this.state = {
            ...this.state,

        }
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md tw-overflow-hidden">
                <div className="tw-flex tw-w-full tw-h-[25px] tw-bg-[#adadad] tw-shadow-md">
                    <div className="tw-ml-auto tw-flex tw-gap-1 tw-p-1 tw-place-items-center">
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


export default MainWindow