import React from "react"

import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { removeKeyFromObject } from "../../../utils/common"

import VideoImage from "./assets/video.jpg"
import { PlayCircleFilled } from "@ant-design/icons"


class VideoPlayer extends Widget{

    static widgetType = "video_player"

    constructor(props) {
        super(props)

        this.droppableTags = null
        
        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.state = {
            ...this.state,
            size: { width: 'fit', height: 'fit' },
        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setWidgetName("Video Player")
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()


        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            size: toolBarAttrs.size,

            ...this.state.attrs,

        })
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md 
                            tw-border tw-border-solid tw-border-gray-400 tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start tw-pointer-events-none" 
                        style={this.state.widgetInnerStyling}>
                    <div className="tw-relative tw-w-full tw-h-full">
                        <div className="tw-absolute tw-text-white tw-left-1/2 tw-top-1/2 
                                        tw--translate-x-1/2 tw--translate-y-1/2">
                            <PlayCircleFilled className="tw-text-4xl"/>
                        </div>
                        <img src={VideoImage} className="tw-w-full tw-h-full" />
                    </div>
                </div>
            </div>
        )
    }

}


export default VideoPlayer