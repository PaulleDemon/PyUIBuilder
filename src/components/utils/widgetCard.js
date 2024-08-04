import { useEffect, useMemo } from "react"
import Draggable from "./draggable"

import { GithubOutlined, GitlabOutlined, LinkOutlined } from "@ant-design/icons"


function DraggableWidgetCard({name, img, url}){

    const urlIcon = useMemo(() => {
        if (url){
            const host = new URL(url).hostname.toLowerCase()

            if (host === "github.com"){
                return <GithubOutlined />
            }else if(host === "gitlab.com"){
                return <GitlabOutlined />
            }else{
                return <LinkOutlined />
            }
        }

    }, [url])

    useEffect(() => {
    }, [])


    return (
        <Draggable className="tw-cursor-pointer">
            <div className="tw-w-full tw-h-[240px] tw-flex tw-flex-col tw-rounded-md tw-overflow-hidden 
                            tw-gap-2 tw-text-gray-600 tw-bg-[#ffffff44] tw-border-solid tw-border-[1px] tw-border-[#888] ">
                <div className="tw-h-[200px] tw-w-full tw-overflow-hidden">
                    <img src={img} alt={name} className="tw-object-contain tw-h-full tw-w-full tw-select-none" />
                </div>
                <span className="tw-text-xl">{name}</span>
                <div className="tw-flex tw-text-lg  tw-justify-between tw-px-4">

                    <a href={url} className="tw-text-black" target="_blank" rel="noopener noreferrer">
                        {urlIcon}
                    </a>
                </div>
            </div>
        </Draggable>
    )

}


export default DraggableWidgetCard