import { memo, useEffect, useMemo, useState } from "react"

import {
    Checkbox, ColorPicker, Input,
    InputNumber, Select, Collapse
} from "antd"

import { capitalize } from "../utils/common"
import Tools from "./constants/tools.js"
import { useActiveWidget } from "./activeWidgetContext.js"
import { Layouts } from "./constants/layouts.js"
import { DynamicRadioInputList } from "../components/inputs.js"
import { useFileUploadContext } from "../contexts/fileUploadContext.js"
import { AudioOutlined, FileImageOutlined, FileTextOutlined, VideoCameraOutlined } from "@ant-design/icons"


// FIXME: Maximum recursion error
// FIXME: Every time the parent attrs are changed a remount happens, which causes input cursor to go to the end
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

    const {uploadedAssets} = useFileUploadContext()

    const uploadItems = useMemo(() => {

        const returnComponentBasedOnFileType = (file) => {
            if (file.fileType === "image"){
                return  (
                    <div className="tw-w-flex tw-gap-2">
                        <FileImageOutlined />
                        <span className="tw-ml-1">{file.name}</span>
                    </div>
                )
            }else if (file.fileType === "video"){
                return (
                    <div className="tw-w-flex tw-gap-2">
                        <VideoCameraOutlined />
                        <span className="tw-ml-1">{file.name}</span>
                    </div>
                )
            }else if (file.fileType === "audio"){
                       
                return  (
                    <div className="tw-w-flex tw-gap-2">
                        <AudioOutlined />
                        <span className="tw-ml-1">{file.name}</span>
                    </div>
                )

            }else{
                return  (
                    <div className="tw-w-flex tw-gap-2">
                        <FileTextOutlined />
                        <span className="tw-ml-1">{file.name}</span>
                    </div>
                 )
            }

        }   

        const uploadList = uploadedAssets.map((file, idx) => ({
            value: file.name,
            label: returnComponentBasedOnFileType(file),
            fileType: file.fileType,
            type: file.type,
            // previewUrl: file.previewUrl,
        }))

        return uploadList

    }, [uploadedAssets])

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


    const renderUploadDropDown = (val, filter) => {


        let uploadOptions = [...uploadItems]

        if (filter){
            uploadOptions = uploadOptions.filter((value, idx) => filter.includes(value.type))
        }

        return (
            <div className="tw-flex tw-w-full">

                <Select 
                    options={uploadOptions}
                    size="large"
                    placeholder="select content"
                    showSearch
                    className="tw-w-full"
                    filterOption={(input, option) =>
                        (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
            </div>
        )

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
                {/* <div className="tw-flex tw-flex-col">
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
                </div> */}

            </div>
        )

    }


    const renderTool = (keyName, val) => {

        return (
            <>
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
                        className="tw-w-full"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => handleChange(value, val.onChange)}
                    />
                )}

                {val.tool === Tools.CHECK_BUTTON && (
                    <Checkbox
                        checked={val.value}
                        defaultChecked={val.value}
                        onChange={(e) => handleChange(e.target.checked, val.onChange)}
                    >{val.label}</Checkbox>
                )}

                {val.tool === Tools.INPUT_RADIO_LIST && (
                    <DynamicRadioInputList
                        defaultInputs={val.value.inputs}
                        defaultSelected={val.value.selectedRadio}
                        onChange={({ inputs, selectedRadio }) => handleChange({ inputs, selectedRadio }, val.onChange)}
                    />
                )}

                {
                    val.tool === Tools.LAYOUT_MANAGER && (
                        renderLayoutManager(val)
                    )
                }
                {
                    val.tool === Tools.UPLOADED_LIST && (
                        renderUploadDropDown(val.value, val?.toolProps?.filterOptions || null)
                    )
                }

            </>
        )

    }


    const renderToolbar = (obj, parentKey = "", toolCount=0) => {
        const keys = []

        return Object.entries(obj).map(([key, val], i) => {
            const keyName = parentKey ? `${parentKey}.${key}` : key

            // Highlight outer labels in blue for first-level keys
            const isFirstLevel = parentKey === ""

            const outerLabelClass = isFirstLevel
                ? "tw-text-sm tw-text-black tw-font-medium"
                : "tw-text-sm"

            // Render tool widgets
            if (typeof val === "object" && val.tool) {
                
                if (isFirstLevel && keys.length < 3) keys.push(keyName)
                
                if (isFirstLevel){
                    return (
                        <Collapse key={keyName} ghost defaultActiveKey={keys}>
                            <Collapse.Panel header={val.label} key={keyName}>
                                {renderTool(keyName, val)}
                            </Collapse.Panel>
                        </Collapse>
                    )

                }

                else
                    return (
                        <div key={keyName} className="tw-flex tw-flex-col tw-gap-2">
                            <div className={`${isFirstLevel ? outerLabelClass : "tw-text-sm"}`}>{val.label}</div>
                            {renderTool(keyName, val)}
                        </div>
                        
                    )
            }

            // Handle nested objects and horizontal display for inner elements
            if (typeof val === "object") {
                const containerClass = val.display === "horizontal"
                    ? "tw-flex tw-flex-row tw-flex-wrap tw-content-start tw-gap-4"
                    : "tw-flex tw-flex-col tw-gap-2"

                if (isFirstLevel && keys.length < 3) keys.push(keyName)

                if (isFirstLevel){
                    return (
                        <Collapse key={keyName} ghost defaultActiveKey={keys}>
                            <Collapse.Panel header={val.label} key={keyName}>
                                <div className={`${containerClass} tw-px-2`}>
                                    {renderToolbar(val, keyName, toolCount+1)}
                                </div>
                            </Collapse.Panel>
                        </Collapse>
                    )
                }else{
                    return (
                        <div key={keyName} className="tw-flex tw-flex-col tw-gap-2">
                            {/* Outer label highlighted in blue for first-level */}
                            <div className={outerLabelClass}>{val.label}</div>
                            <div className={`${containerClass} tw-px-2`}>
                                {renderToolbar(val, keyName, toolCount+1)}
                            </div>
                        </div>
                    )
                }
            }

            return null
        })
    }

    return (
        <div
            className={`tw-absolute tw-top-20 tw-right-5 tw-bg-white 
                ${toolbarOpen ? "tw-translate-x-0" : "tw-translate-x-full"} 
                tw-w-[280px] tw-px-3 tw-p-2 tw-h-[600px] tw-rounded-md tw-z-[1000] tw-shadow-lg 
                tw-transition-transform tw-duration-[0.3s] tw-overflow-x-hidden
                tw-flex tw-flex-col tw-gap-2 tw-overflow-y-auto`}

                style={{
                    transform: toolbarOpen ? "translateX(0)" : "translateX(calc(100% + 50px))"
                }}
        >
            <h3 className="tw-text-lg tw-text-center">
                {capitalize(`${widgetType || ""}`).replace(/_/g, " ")}
            </h3>

            <div className="tw-flex tw-flex-col tw-gap-2">
                {renderToolbar(toolbarAttrs || {})}
            </div>
        </div>
    )

})



export default CanvasToolBar