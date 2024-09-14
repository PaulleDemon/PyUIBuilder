import { useEffect, useState } from "react"

import { ColorPicker, Input, InputNumber, Select } from "antd"

import { capitalize } from "../utils/common"
import Tools from "./constants/tools.js"


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
        activeWidget?.setWidgetName(e.target.value) // Update widget's internal state
        const updatedWidget = { ...activeWidget } // Create a shallow copy of the widget
        setActiveWidget(updatedWidget) // Update the state with the modified widget
    }

    const handleChange = (attrPath, value, callback) => {
        // console.log("Value: ", attrPath, value)
        activeWidget?.setAttrValue(attrPath, value) // Update widget's internal state
        const updatedWidget = { ...activeWidget }
        
        if (callback){
            callback(value)
        }
        
        setActiveWidget(updatedWidget)
    }


    const renderWidgets = (obj, parentKey = "") => {
        return Object.entries(obj).map(([key, val], i) => {
            // console.log("parent key: ", parentKey)
            // Build a unique identifier for keys that handle nested structures
            const keyName =  parentKey ? `${parentKey}.${key}` : key
        
            // Check if the current value is an object and has a "tool" property
            if (typeof val === "object" && val.tool) {
                // Render widgets based on the tool type
                return (
                <div key={keyName} className="tw-flex tw-flex-col tw-gap-2">
                    {
                        parentKey ? 
                            <div className={`tw-text-sm tw-font-medium `}>{val.label}</div>
                        :
                            <div className="tw-text-lg tw-text-blue-700">{capitalize(key)}</div>
                    }

{
                        val.tool === Tools.NUMBER_INPUT && (
                            <InputNumber 
                                defaultValue={val.value || 0}
                                size="small"
                                onChange={(value) => handleChange(keyName, value, val.onChange)}
                            />
                    )}

                    {
                        val.tool === Tools.COLOR_PICKER && (
                            <ColorPicker 
                                defaultValue={val.value || "#fff"}
                                disabledAlpha
                                arrow={false}
                                size="middle"
                                showText
                                format="hex"
                                placement="bottomRight"
                                className="tw-w-fit !tw-min-w-[100px]"
                                onChange={(value) => handleChange(keyName, value.toHexString(), val.onChange)}
                            />
                    )}
                    
                    {
                        val.tool === Tools.SELECT_DROPDOWN && (
                            <Select 
                                options={val.options}
                                showSearch
                                value={val.value || ""}
                                placeholder={`${val.label}`}
                                onChange={(value) => handleChange(keyName, value, val.onChange)}
                            />
                        )
                    }

                    {/* Add more widget types here as needed */}
                </div>
                )
            }
        
            // If the value is another nested object, recursively call renderWidgets
            if (typeof val === "object") {
                return (
                <div key={keyName} className="tw-flex tw-flex-col tw-gap-2">
                    <div className="tw-text-lg tw-text-blue-700">{capitalize(key)}</div>
                    {renderWidgets(val, keyName)}
                </div>
                )
            }
        
            return null // Skip rendering for non-object types
        })
    }

    return (
        <div className={`tw-absolute tw-top-20 tw-right-5 tw-bg-white ${toolbarOpen ? "tw-w-[320px]": "tw-w-0"}
                         tw-px-4 tw-p-2 tw-h-[600px] tw-rounded-md tw-z-20 tw-shadow-lg 
                         tw-transition-transform tw-duration-75
                         tw-flex tw-flex-col tw-overflow-y-auto
                         `}
                        >
            
            <h3 className="tw-text-xl tw-text-center"> 
                {capitalize(`${activeWidget?.getWidgetType() || ""}`)}
            </h3>

            <div>
                <Input placeholder="widget name" 
                    value={activeWidget?.getWidgetName() || ""}
                    onChange={handleWidgetNameChange}
                    />
            </div>
            <hr />
            <div className="tw-flex tw-flex-col tw-gap-4">
                {renderWidgets(activeWidget?.state?.attrs || {})}
            </div>

        </div>
    )

}



export default CanvasToolBar