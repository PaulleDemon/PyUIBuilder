import React from "react"

import Tools from "../../../canvas/constants/tools"
import { removeKeyFromObject } from "../../../utils/common"

import VideoImage from "./assets/video.jpg"
import { PlayCircleFilled } from "@ant-design/icons"
import { CustomTkBase } from "../widgets/base"
import { getPythonAssetPath } from "../../utils/pythonFilePath"


class VideoPlayer extends CustomTkBase{

    static widgetType = "video_player"

    static requiredImports = [
        ...CustomTkBase.requiredImports, 
        "import os",
        "from tkVideoPlayer import TkinterVideo"
    ]

    static requirements = ["tkvideoplayer"]


    constructor(props) {
        super(props)

        this.droppableTags = null
        
        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.state = {
            ...this.state,
            size: { width: 350, height: 200 },
            widgetName: "Video player",
            attrs: {
                ...newAttrs,
                play: {
                    label: "Start playing",
                    tool: Tools.CHECK_BUTTON,
                    value: false,
                    onChange: (value) => {
                        this.setAttrValue("play", value)
                    }
                        
                },
                defaultVideo: {
                    label: "Video",
                    tool: Tools.UPLOADED_LIST, 
                    toolProps: {filterOptions: ["video/mp4", "video/webm", "video/m4v"]}, 
                    value: "",
                    onChange: (value) => this.setAttrValue("defaultVideo", value)
                },
            }
        }
    }

    componentDidMount(){
        super.componentDidMount()
        // this.setAttrValue("styling.backgroundColor", "#E4E2E2")
    }

    generateCode(variableName, parent){


        const defaultVideo = this.getAttrValue("defaultVideo")
        const play = this.getAttrValue("play")

        const code = [
            `${variableName} = TkinterVideo(master=${parent}, scaled=True)`,
        ]

        if (defaultVideo){
            code.push(`${variableName}.load(${getPythonAssetPath(defaultVideo.name, "video")})`)
        }

        if (play){
            code.push(`${variableName}.play()`)
        }

        return [
                ...code,
                `${variableName}.${this.getLayoutCode()}`
            ]
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

        // const defaultVideo = this.getAttrValue("defaultVideo")

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