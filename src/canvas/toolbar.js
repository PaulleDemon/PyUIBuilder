import { useEffect, useState } from "react"

import { ColorPicker, Input, InputNumber, Select } from "antd"

import { capitalize } from "../utils/common"
import Tools from "./constants/tools.js"


// FIXME: Maximum recursion error

/**
 * 
 * @param {boolean} isOpen 
 * @param {string} widgetType 
 * @param {object} attrs - widget attributes 
 */
function CanvasToolBar({ isOpen, widgetType, attrs = {} }) {

    const [toolbarOpen, setToolbarOpen] = useState(isOpen)
    const [toolbarAttrs, setToolbarAttrs] = useState(attrs)

    useEffect(() => {
        setToolbarOpen(isOpen)
    }, [isOpen])

    useEffect(() => {
        setToolbarAttrs(attrs)
    }, [attrs])

    // const handleTextInputChange = (e) => {
    //     activeWidget?.setWidgetName(e.target.value) // Update widget's internal state
    //     const updatedWidget = { ...activeWidget } // Create a shallow copy of the widget
    //     setActiveWidget(updatedWidget) // Update the state with the modified widget
    // }


    // const handleChange = (attrPath, value, callback) => {
    //     // console.log("Value: ", attrPath, value)
    //     activeWidget?.setAttrValue(attrPath, value) // Update widget's internal state
    //     const updatedWidget = { ...activeWidget }

    //     if (callback) {
    //         callback(value)
    //     }

    //     setActiveWidget(updatedWidget)
    // }

    const handleChange = (value, callback) => {
        if (callback) {
            callback(value)
        }
    }

    const renderWidgets = (obj, parentKey = "") => {
        return Object.entries(obj).map(([key, val], i) => {
            const keyName = parentKey ? `${parentKey}.${key}` : key

            // Highlight outer labels in blue for first-level keys
            const isFirstLevel = parentKey === ""

            const outerLabelClass = isFirstLevel
                ? "tw-text-lg tw-text-blue-700 tw-font-medium"
                : "tw-text-lg"

            // Render tool widgets
            if (typeof val === "object" && val.tool) {
                return (
                    <div key={keyName} className="tw-flex tw-flex-col tw-gap-2">
                        <div className={`${isFirstLevel ? outerLabelClass : "tw-text-base"}`}>{val.label}</div>

                        {val.tool === Tools.INPUT && (
                            <Input
                                {...val.toolProps}
                                value={val.value}
                                onChange={(e) => handleChange(e.target.value, val.onChange)}
                            />
                        )}

                        {val.tool === Tools.NUMBER_INPUT && (
                            <InputNumber
                                {...val.toolProps}
                                value={val.value || 0}
                                size="small"
                                onChange={(value) => handleChange(value, val.onChange)}
                            />
                        )}

                        {val.tool === Tools.COLOR_PICKER && (
                            <ColorPicker
                                defaultValue={val.value || "#fff"}
                                disabledAlpha
                                arrow={false}
                                size="middle"
                                showText
                                format="hex"
                                placement="bottomRight"
                                className="tw-w-fit !tw-min-w-[110px]"
                                onChange={(value) => handleChange(value.toHexString(), val.onChange)}
                            />
                        )}

                        {val.tool === Tools.SELECT_DROPDOWN && (
                            <Select
                                options={val.options}
                                showSearch
                                value={val.value || ""}
                                placeholder={`${val.label}`}
                                onChange={(value) => handleChange(value, val.onChange)}
                            />
                        )}
                    </div>
                );
            }

            // Handle nested objects and horizontal display for inner elements
            if (typeof val === "object") {
                const containerClass = val.display === "horizontal"
                    ? "tw-flex tw-flex-row tw-gap-4"
                    : "tw-flex tw-flex-col tw-gap-2"

                return (
                    <div key={keyName} className="tw-flex tw-flex-col tw-gap-2">
                        {/* Outer label highlighted in blue for first-level */}
                        <div className={outerLabelClass}>{val.label}</div>
                        <div className={`${containerClass} tw-px-2`}>{renderWidgets(val, keyName)}</div>
                    </div>
                )
            }

            return null
        })
    }

    return (
        <div
            className={`tw-absolute tw-top-20 tw-right-5 tw-bg-white ${toolbarOpen ? "tw-w-[320px]" : "tw-w-0"
                } tw-px-4 tw-p-2 tw-h-[600px] tw-rounded-md tw-z-20 tw-shadow-lg 
                             tw-transition-transform tw-duration-75
                             tw-flex tw-flex-col tw-gap-2 tw-overflow-y-auto`}
        >
            <h3 className="tw-text-xl tw-text-center">
                {capitalize(`${widgetType || ""}`)}
            </h3>

            <hr />
            <div className="tw-flex tw-flex-col tw-gap-4">{renderWidgets(toolbarAttrs || {})}</div>
        </div>
    )

}



export default CanvasToolBar