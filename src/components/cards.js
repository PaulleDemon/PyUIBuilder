import { useEffect, useMemo, useRef } from "react"
import Draggable from "./utils/draggableDnd"

import { GithubOutlined, GitlabOutlined, LinkOutlined,
            AudioOutlined, FileTextOutlined} from "@ant-design/icons"
import DraggableWrapper from "./draggable/draggable"


export function SidebarWidgetCard({ name, img, url, license, widgetClass, innerRef}){

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


    return (
        // <Draggable className="tw-cursor-pointer" id={name}>
            <DraggableWrapper data-container={"sidebar"} 
                                dragElementType={widgetClass.widgetType} 
                                dragWidgetClass={widgetClass}
                                className="tw-cursor-pointer tw-w-fit tw-bg-white tw-h-fit">
                
                <div ref={innerRef} className="tw-select-none  tw-h-[200px] tw-w-[230px] tw-flex tw-flex-col 
                                                tw-rounded-md tw-overflow-hidden 
                                                tw-gap-2 tw-text-gray-600 tw-bg-[#ffffff44] tw-border-solid tw-border-[1px]
                                                tw-border-blue-500 tw-shadow-md">
                    <div className="tw-h-[200px] tw-pointer-events-none tw-w-full tw-overflow-hidden">
                        <img src={img} alt={name} className="tw-object-contain tw-h-full tw-w-full tw-select-none" />
                    </div>
                    <span className="tw-text-center tw-text-black tw-text-lg">{name}</span>
                    <div className="tw-flex tw-text-lg tw-place tw-px-4">

                        <a href={url} className="tw-text-gray-600" target="_blank" rel="noopener noreferrer">
                            {urlIcon}
                        </a>

                        {license?.name && 

                            <div className="tw-ml-auto tw-text-sm">
                                {
                                license.url ? 
                                    <a href={license.url} target="_blank" rel="noreferrer noopener"
                                        className="tw-p-[1px] tw-px-2 tw-text-blue-500 tw-border-[1px]
                                                                        tw-border-solid tw-rounded-sm tw-border-blue-500
                                                                        tw-shadow-md tw-text-center tw-no-underline">
                                        {license.name}
                                    </a>
                                    :
                                    <div className="tw-p-[1px] tw-px-2 tw-text-blue-500 tw-border-[1px]
                                                    tw-border-solid tw-rounded-sm tw-border-blue-500
                                                    tw-shadow-md tw-text-center">
                                        {license.name}
                                    </div>
                                }
                            </div>    
                        }
                    </div>
                    
                </div>
            </DraggableWrapper>
        // </Draggable> 
    )

}


export function DraggableAssetCard({file}){

    const videoRef = useRef()

    useEffect(() => {

        function playOnMouseEnter(){
            videoRef.current.play()
        }

        function pauseOnMouseEnter(){
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }

        if (videoRef.current){
            videoRef.current.addEventListener("mouseenter", playOnMouseEnter)
            videoRef.current.addEventListener("mouseleave", pauseOnMouseEnter)
        }

        return () => {
            if (videoRef.current){
                videoRef.current.removeEventListener("mouseenter", playOnMouseEnter)
                videoRef.current.removeEventListener("mouseleave", pauseOnMouseEnter)
            }
        }

    }, [videoRef])


    return (
        <>
            <div className="tw-w-full tw-h-[240px] tw-p-1 tw-flex tw-flex-col tw-rounded-md tw-overflow-hidden 
                            tw-gap-2 tw-text-gray-600 tw-bg-[#ffffff44] tw-border-solid tw-border-[1px] 
                            tw-border-blue-500 tw-shadow-md ">
                <div className="tw-h-[200px] tw-w-full tw-flex tw-place-content-center tw-p-1 tw-text-3xl tw-overflow-hidden">
                    { file.fileType === "image" &&
                        <img src={file.previewUrl} alt={file.name} className="tw-object-contain tw-h-full tw-w-full tw-select-none" />
                    }

                    {
                        file.fileType === "video" &&
                        <video className="tw-w-full tw-object-contain" ref={videoRef} muted>
                            <source src={file.previewUrl} type={`${file.type || "video/mp4"}`} />
                            Your browser does not support the video tag.
                        </video>
                    }

                    {
                        file.fileType === "audio" && 
                            <AudioOutlined />
                    } 
                    {
                        file.fileType === "others" && 
                            <FileTextOutlined />
                    }

                </div>
                <span className="tw-text-sm tw-text-back">{file.name}</span>
            </div>
        </>
    )

}