import { useEffect, useRef, useMemo, useState } from "react";

import { CloseCircleFilled } from "@ant-design/icons";


function Sidebar({tabs}){

    const sideBarRef = useRef()
    const sideBarExtraRef = useRef()

    const [activeTab, setActiveTab] = useState(-1) // -1 indicates no active tabs
    const [hoverIndex, setHoverIndex] = useState(-1) // -1 indicates no active tabs
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const sidebarTabs = useMemo(() => tabs, [tabs])

    useEffect(() => {

    }, [sideBarRef, sideBarExtraRef, sidebarOpen])

    const openSidebar = () => {
        
        sideBarRef.current?.classList.add("tw-w-[400px]")
        sideBarRef.current?.classList.remove("tw-w-[80px]")
        
        setSidebarOpen(true)
    }

    const closeSidebar = () => {
        sideBarRef.current?.classList.add("tw-w-[80px]")
        sideBarRef.current?.classList.remove("tw-w-[400px]")
        setSidebarOpen(false)
        setActiveTab(-1)
        setHoverIndex(-1)
    }

    const hideOnMouseLeave = () => {

        if (activeTab === -1){
            closeSidebar()
        }

    }

    return (
        <div className={`tw-relative tw-min-w-[80px] tw-duration-[0.3s] tw-transition-all
                        tw-max-w-[400px] tw-flex tw-h-full tw-z-10
                        ${sidebarOpen ? "tw-bg-white tw-min-w-[400px] tw-w-[400px] tw-shadow-lg": "tw-bg-primaryBg tw-w-[80px]"}
                        `} ref={sideBarRef} 
                        onMouseLeave={hideOnMouseLeave}
                >
            

            <div className="tw-w-full  tw-max-w-[80px] tw-h-full tw-flex tw-flex-col tw-gap-4 tw-p-3 tw-place-items-center">
                {
                    sidebarTabs.map((tab, index) => {
                        return (
                            <div className={`${activeTab === index ? "tw-text-blue-400 " :  "tw-text-gray-600"} tw-cursor-pointer 
                                            hover:tw-text-blue-400 tw-flex tw-flex-col tw-gap-2 tw-place-items-center`}
                                    key={tab.name}
                                    onMouseEnter={() => {
                                        openSidebar()
                                        setHoverIndex(index)
                                    }}
                                    onClick={() => {
                                        setActiveTab(index)
                                    }}
                                 >
                                <div className="tw-bg-white  tw-shadow-lg tw-p-2 tw-rounded-md">
                                    {tab.icon}
                                </div>
                                <span className="tw-text-[12px] ">{tab.name}</span>
                            </div>

                        )
                    })
                }
            </div>

            <div className="tw-w-full tw-h-full tw-bg-inherit tw-flex tw-flex-col tw-overflow-x-hidden" ref={sideBarExtraRef}>
                <div className="tw-w-full tw-h-[50px] tw-flex tw-place-content-end tw-p-1">
                    <button className="tw-outline-none tw-bg-transparent tw-border-none tw-text-gray-600 tw-cursor-pointer tw-text-xl"
                            onClick={closeSidebar}
                            >
                        <CloseCircleFilled />
                    </button>
                </div>

                <div className="tw-flex tw-w-full tw-h-full tw-max-h-full tw-overflow-y-auto">
                    {(activeTab > -1 || hoverIndex > -1) && tabs[activeTab > -1 ? activeTab : hoverIndex].content}
                </div>

            </div>

        </div>
    );

}


export default Sidebar;