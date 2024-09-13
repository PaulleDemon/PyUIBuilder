import { useEffect, useState } from "react"
import { capitalize } from "../utils/common"


function CanvasToolBar({isOpen, activeWidget}){

    const [toolbarOpen, setToolbarOpen] = useState(isOpen)

    const [widget, setWidget] = useState(activeWidget)

    useEffect(() => {
        setToolbarOpen(isOpen)
    }, [isOpen])

    useEffect(() => {
        setWidget(activeWidget)
    }, [activeWidget])
    
    console.log("Widget type: ", widget?.getWidgetType())
    return (
        <div className={`tw-absolute tw-top-20 tw-right-5 tw-bg-white ${toolbarOpen ? "tw-w-[320px]": "tw-w-0"}
                         tw-px-4 tw-p-2 tw-h-[600px] tw-rounded-md tw-z-20 tw-shadow-lg 
                         tw-transition-transform tw-duration-75
                         tw-flex tw-flex-col
                         `}
                        >
            
            <h3 className="tw-text-2xl tw-text-center"> 
                {capitalize(`${widget?.getWidgetType() || ""}`)}
            </h3>

        </div>
    )

}



export default CanvasToolBar