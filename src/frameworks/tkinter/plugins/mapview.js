import React from "react"


import Widget from "../../../canvas/widgets/base"
import Tools from "../../../canvas/constants/tools"
import { removeKeyFromObject } from "../../../utils/common"

import MapImage from "./assets/map.png"
import { MinusOutlined, PlayCircleFilled, PlusOutlined } from "@ant-design/icons"
import { TkinterBase } from "../widgets/base"


class MapView extends TkinterBase{

    static widgetType = "map_view"

    static requiredImports = [
        ...TkinterBase.requiredImports, 
        "import tkintermapview"
    ]

    static requirements = ["tkintermapview"]

    constructor(props) {
        super(props)

        this.droppableTags = null
        
        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.state = {
            ...this.state,  
            widgetName: "Map viewer",
            size: { width: 400, height: 250 },
        }
    }

    // componentDidMount(){
    //     super.componentDidMount()
    // }

    generateCode(variableName, parent){


        return [
                `${variableName} = tkintermapview.TkinterMapView(master=${parent})`,
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
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md 
                            tw-border tw-border-solid tw-border-gray-400 tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start tw-pointer-events-none" 
                        style={this.state.widgetInnerStyling}>
                    <div className="tw-relative tw-w-full tw-h-full">
                        <div className="tw-absolute tw-left-5 tw-top-3  tw-flex tw-flex-col tw-gap-2">
                            <div className="tw-text-white tw-bg-black tw-text-center
                                            tw-p-[2px]
                                            tw-w-[25px] tw-h-[25px] tw-rounded-md">
                                <PlusOutlined className="tw-text-xl"/>
                            </div>
                            <div className="tw-text-white tw-bg-black tw-text-center
                                            tw-p-1
                                            tw-w-[25px] tw-h-[25px] tw-rounded-md">
                                <MinusOutlined className="tw-text-xl"/>
                            </div>
                        </div>
                        <img src={MapImage} className="tw-w-full tw-h-full" />
                    </div>
                </div>
            </div>
        )
    }

}


export default MapView