import Widget from "../../../canvas/widgets/base"


class Frame extends Widget{

    static widgetType = "frame"

    constructor(props) {
        super(props)

        this.droppableTags = {
            exclude: ["image", "video", "media"]
        }

        this.state = {
            ...this.state,

        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setAttrValue("styling.backgroundColor", "#EDECEC")
        this.setWidgetName("frame")
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-relative tw-rounded-md tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start" style={this.state.widgetStyling}>
                    {this.props.children}
                </div>
            </div>
        )
    }

}


export default Frame