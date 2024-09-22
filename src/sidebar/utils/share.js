import { useMemo, useState } from "react"

import { Modal, message } from "antd"
import { CopyOutlined, FacebookFilled, LinkedinFilled, MediumCircleFilled, RedditCircleFilled, TwitchFilled, TwitterCircleFilled } from "@ant-design/icons"


function Share({children, className=""}){

    const [shareModalOpen, setShareModalOpen] = useState(false)

    const shareInfo = useMemo(() => {

        return {
            url: encodeURI("https://github.com/PaulleDemon/tkbuilder"),
            text: "Check out Framework agnostic GUI builder for python"
        }
    }, [])

    const onClick = () => {
        setShareModalOpen(true)
    }

    const onClose = (event) => {
        event.stopPropagation()
        setShareModalOpen(false)
    }

    const onCopy = (event) => {
        event.stopPropagation()
        navigator.clipboard.writeText(`Check out Font tester: ${shareInfo.url}`).then(function() {
            message.success("Link copied to clipboard")
    
        }, function(err) {
            message.error("Error copying to clipboard")
        })
    }

    return (
        <div onClick={onClick} className={className}>
            {children}
            <Modal title={<h3 className="tw-text-xl tw-font-medium">Share PyUI Builder with others</h3>} 
                    styles={{wrapper: {zIndex: 14000, gap: "10px"}}}
                    onCancel={onClose}
                    onOk={onClose}
                    footer={null}
                    open={shareModalOpen}>
                
                <div className="tw-mt-5 tw-flex tw-place-content-center tw-w-full tw-place-items-center">
                    <a onClick={onCopy}
                        className="hover:!tw-bg-gray-100 hover:!tw-color-black !tw-text-4xl" 
                                                        style={{width: "80px", height: "80px", outline: "none", border: "none", color: "#000", 
                                                                backgroundColor: "transparent", display: "flex", justifyContent: "center",
                                                                padding: "0.5rem 0.75rem", borderRadius: "0.375rem"}}>
                        <CopyOutlined />
                    </a>

                    <a href={`https://www.reddit.com/submit?url=${shareInfo.url}&title=${encodeURIComponent(shareInfo.text)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="hover:!tw-bg-gray-100 hover:!tw-color-black !tw-text-4xl" 
                                                        style={{width: "80px", height: "80px", outline: "none", border: "none", color: "#000", 
                                                                backgroundColor: "transparent", display: "flex", justifyContent: "center",
                                                                padding: "0.5rem 0.75rem", borderRadius: "0.375rem"}}>
                        <RedditCircleFilled />
                    </a>

                    <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareInfo.url}&title=${encodeURIComponent(shareInfo.text)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="hover:!tw-bg-gray-100 hover:!tw-color-black !tw-text-4xl" 
                                                        style={{width: "80px", height: "80px", outline: "none", border: "none", color: "#000", 
                                                                backgroundColor: "transparent", display: "flex", justifyContent: "center",
                                                                padding: "0.5rem 0.75rem", borderRadius: "0.375rem"}}>
                        <LinkedinFilled />
                    </a>

                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareInfo.url}`}
                        target="_blank" rel="noopener noreferrer"
                        className="hover:!tw-bg-gray-100 hover:!tw-color-black !tw-text-4xl" 
                                                        style={{width: "80px", height: "80px", outline: "none", border: "none", color: "#000", 
                                                                backgroundColor: "transparent", display: "flex", justifyContent: "center",
                                                                padding: "0.5rem 0.75rem", borderRadius: "0.375rem"}}>
                        <FacebookFilled />
                    </a>

                    <a href="https://medium.com/new-story"
                        target="_blank" rel="noopener noreferrer"
                        className="hover:!tw-bg-gray-100 hover:!tw-color-black !tw-text-4xl" 
                                                        style={{width: "80px", height: "80px", outline: "none", border: "none", color: "#000", 
                                                                backgroundColor: "transparent", display: "flex", justifyContent: "center",
                                                                padding: "0.5rem 0.75rem", borderRadius: "0.375rem"}}>
                        <MediumCircleFilled />
                    </a>
                    
                    <a href={`https://twitter.com/share?url=${shareInfo.url}&text=${encodeURIComponent(shareInfo.text)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="hover:!tw-bg-gray-100 hover:!tw-color-black !tw-text-4xl" 
                                                        style={{width: "80px", height: "80px", outline: "none", border: "none", color: "#000", 
                                                                backgroundColor: "transparent", display: "flex", justifyContent: "center",
                                                                padding: "0.5rem 0.75rem", borderRadius: "0.375rem"}}>
                        <TwitterCircleFilled />
                    </a>
                </div>

            </Modal>

        </div>
    )

}

export default Share