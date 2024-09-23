import { memo, useEffect, useState } from "react"

import { Checkbox, ColorPicker, Input, InputNumber, Select } from "antd"

import { capitalize } from "../utils/common"
import Tools from "./constants/tools.js"
import { useActiveWidget } from "./activeWidgetContext.js"
import { Layouts } from "./constants/layouts.js"


// FIXME: Maximum recursion error

/**
 * 
 * @param {boolean} isOpen 
 * @param {string} widgetType 
 * @param {object} attrs - widget attributes 
 */
const CanvasToolBar = memo(({ isOpen, widgetType, attrs = {} }) => {

    // const { activeWidgetAttrs } = useActiveWidget()

    // console.log("active widget context: ", activeWidgetAttrs)
    const [toolbarOpen, setToolbarOpen] = useState(isOpen)
    const [toolbarAttrs, setToolbarAttrs] = useState(attrs)


    useEffect(() => {
        setToolbarOpen(isOpen)
    }, [isOpen])

    useEffect(() => {
        setToolbarAttrs(attrs)
    }, [attrs])


    const handleChange = (value, callback) => {
        if (callback) {
            callback(value)
        }
    }


    const renderLayoutManager = (val) => {

        return (
            <div className="tw-flex tw-flex-col tw-gap-2">
                <Select
                    options={[
                        { value: Layouts.FLEX, label: "Flex" },
                        { value: Layouts.GRID, label: "Grid" },
                        { value: Layouts.PLACE, label: "Place" },
                    ]}
                    showSearch
                    value={val.value?.layout || ""}
                    placeholder={`${val.label}`}
                    size="medium"
                    onChange={(value) => handleChange({ ...val.value, layout: value }, val.onChange)}
                />

                <div className="tw-flex tw-flex-col tw-gap-1">
                    <span className="tw-text-sm">Direction</span>
                    <Select
                        options={[
                            { value: "column", label: "Vertical" },
                            { value: "row", label: "Horizontal" },
                        ]}
                        showSearch
                        value={val.value?.direction || "row"}
                        placeholder={`${val.label}`}
                        onChange={(value) => handleChange({ ...val.value, direction: value }, val.onChange)}
                    />
                </div>
                <div className="tw-flex tw-flex-col">
                    <span className="tw-text-sm">Gap</span>
                    <InputNumber
                        max={500}
                        min={1}
                        value={val.value?.gap || 10}
                        size="small"
                        onChange={(value) => {
                            handleChange({ ...val.value, gap: value }, val.onChange)
                        }}
                    />
                </div>
                <div className="tw-flex tw-flex-col">
                    <span className="tw-text-sm tw-font-medium">Grids</span>
                    <div className="tw-flex tw-gap-2">
                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-sm">Rows</span>
                            <InputNumber
                                max={12}
                                min={1}
                                value={val.value?.grid.rows || 1}
                                size="small"
                                onChange={(value) => {
                                    let newGrid = {
                                        rows: value,
                                        cols: val.value?.grid.cols
                                    }
                                    handleChange({ ...val.value, grid: newGrid }, val.onChange)
                                }}
                            />
                        </div>
                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-sm">Columns</span>
                            <InputNumber
                                max={12}
                                min={1}
                                value={val.value?.grid.cols || 1}
                                size="small"
                                onChange={(value) => {
                                    let newGrid = {
                                        rows: val.value?.grid.cols,
                                        cols: value
                                    }
                                    handleChange({ ...val.value, grid: newGrid }, val.onChange)
                                }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        )

    }


    const renderWidgets = (obj, parentKey = "") => {
        return Object.entries(obj).map(([key, val], i) => {
            const keyName = parentKey ? `${parentKey}.${key}` : key

            // Highlight outer labels in blue for first-level keys
            const isFirstLevel = parentKey === ""

            const outerLabelClass = isFirstLevel
                ? "tw-text-base tw-text-blue-700 tw-font-medium"
                : "tw-text-base"

            // Render tool widgets
            if (typeof val === "object" && val.tool) {
                return (
                    <div key={keyName} className="tw-flex tw-flex-col tw-gap-2">
                        <div className={`${isFirstLevel ? outerLabelClass : "tw-text-sm"}`}>{val.label}</div>

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
                                // defaultValue={val.value || "#fff"}
                                value={val.value || "#fff"}
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

                        {val.tool === Tools.CHECK_BUTTON && (
                            <Checkbox
                                value={val.value}
                                defaultChecked={val.value}
                                onChange={(e) => handleChange(e.target.checked, val.onChange)}
                            >{val.label}</Checkbox>
                        )}

                        {
                            val.tool === Tools.LAYOUT_MANAGER && (
                                renderLayoutManager(val)
                            )
                        }

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
            className={`tw-absolute tw-top-20 tw-right-5 tw-bg-white ${toolbarOpen ? "tw-w-[280px]" : "tw-w-0"
                } tw-px-4 tw-p-2 tw-h-[600px] tw-rounded-md tw-z-[1000] tw-shadow-lg 
                             tw-transition-transform tw-duration-75
                             tw-flex tw-flex-col tw-gap-2 tw-overflow-y-auto`}
        >
            <h3 className="tw-text-xl tw-text-center">
                {capitalize(`${widgetType || ""}`).replace(/_/g, " ")}
            </h3>

            <div className="tw-flex tw-flex-col tw-gap-4">{renderWidgets(toolbarAttrs || {})}</div>
        </div>
    )

})



export default CanvasToolBar