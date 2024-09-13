import { useEffect, useState } from "react"

import { Input } from "antd"

import { capitalize } from "../utils/common"


/**
 * 
 * @param {boolean} isOpen 
 * @param {import("./widgets/base.js").Widget} activeWidget 
 * @param {React.Dispatch<React.SetStateAction<import("./widgets/base.js").Widget>>} setActiveWidget 
 * @returns 
 */
function CanvasToolBar({isOpen, activeWidget, setActiveWidget}){

    const [toolbarOpen, setToolbarOpen] = useState(isOpen)

    useEffect(() => {
        setToolbarOpen(isOpen)
    }, [isOpen])

    
    const handleWidgetNameChange = (e) => {
        const updatedWidget = { ...activeWidget } // Create a shallow copy of the widget
        updatedWidget?.setWidgetName(e.target.value) // Update widget's internal state
        setActiveWidget(updatedWidget) // Update the state with the modified widget
    }

    return (
        <div className={`tw-absolute tw-top-20 tw-right-5 tw-bg-white ${toolbarOpen ? "tw-w-[320px]": "tw-w-0"}
                         tw-px-4 tw-p-2 tw-h-[600px] tw-rounded-md tw-z-20 tw-shadow-lg 
                         tw-transition-transform tw-duration-75
                         tw-flex tw-flex-col
                         `}
                        >
            
            <h3 className="tw-text-2xl tw-text-center"> 
                {capitalize(`${activeWidget?.getWidgetType() || ""}`)}
            </h3>

            <div>
                <Input placeholder="widget name" 
                    value={activeWidget?.getWidgetName() || ""}
                    onChange={handleWidgetNameChange}
                    />
            </div>

        </div>
    )

}



export default CanvasToolBar