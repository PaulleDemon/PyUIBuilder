



import React, { useEffect, useRef, useState } from "react"

import Widget from "../../../canvas/widgets/base"
import { removeKeyFromObject } from "../../../utils/common"

import MapImage from "./assets/map.png"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { TkinterBase } from "../widgets/base"
import Tools from "../../../canvas/constants/tools"
import { getPythonAssetPath } from "../../utils/pythonFilePath"


const ResizableTable = ({minRows=5, minCols=5}) => {
    const [rows, setRows] = useState(minRows)
    const [cols, setCols] = useState(minCols)
    const containerRef = useRef(null)



    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect

                // Set number of columns and rows based on widget width and height
                const newCols = Math.max(minCols, Math.floor(width / 100)) // each column is 100px wide
                const newRows = Math.max(minRows, Math.floor(height / 50))  // each row is 50px high

                setCols(newCols)
                setRows(newRows)
            }
        })

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);  // Start observing the widget
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);  // Stop observing when component unmounts
            }
        }
    }, [containerRef])


    return (
        <div ref={containerRef} className="tw-w-full tw-h-full tw-rounded-md tw-border tw-border-solid tw-overflow-hidden">
            <table className="tw-w-full tw-h-full">
                <tbody className="">
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="">
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <td key={colIndex} className="tw-border tw-border-solid tw-border-gray-400 tw-p-2">
                                    {/* Row {rowIndex + 1}, Col {colIndex + 1} */}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


class PandasTable extends TkinterBase{

    static widgetType = "pandas_table"

    static requiredImports = [
        ...TkinterBase.requiredImports, 
        "import os",
        "from pandastable import Table",
    ]

    static requirements = ["pandastable"]


    constructor(props) {
        super(props)

        this.droppableTags = null
        
        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.state = {
            ...this.state,
            widgetName: "Pandas Table",
            size: { width: 400, height: 250 },
            attrs: {
                ...newAttrs,
                styling: {
                    ...newAttrs.styling,
                    textColor: {
                        label: "Text Color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "",
                        onChange: (value) => {
                            this.setAttrValue("styling.textColor", value)
                        }
                    },
                    cellBg: {
                        label: "Cell background",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "",
                        onChange: (value) => {
                            this.setAttrValue("styling.textColor", value)
                        }
                    },
                    outlineColor: {
                        label: "Box outline color",
                        tool: Tools.COLOR_PICKER, // the tool to display, can be either HTML ELement or a constant string
                        value: "",
                        onChange: (value) => {
                            this.setAttrValue("styling.textColor", value)
                        }
                    },
                },
                defaultTable: {
                    label: "Default table",
                    tool: Tools.UPLOADED_LIST, 
                    toolProps: {filterOptions: ["text/csv"]}, 
                    value: "",
                    onChange: (value) => this.setAttrValue("defaultTable", value)
                },
                enableEdit: {
                    label: "Enable editing",
                    tool: Tools.CHECK_BUTTON,
                    value: false,
                    onChange: (value) => {
                        this.setAttrValue("enableEdit", value)
                    }
                        
                },
            }
        }
    }

    // componentDidMount(){
    //     super.componentDidMount()
    //     this.setWidgetName("Pandas Table")
    //     this.setAttrValue("styling.backgroundColor", "#E4E2E2")
    // }

    generateCode(variableName, parent){

        const defaultTable = this.getAttrValue("defaultTable")

        const textColor = this.getAttrValue("styling.textColor")
        const cellBg = this.getAttrValue("styling.cellBg")
        const outlineColor = this.getAttrValue("styling.outlineColor")
        
        const enableEdit = this.getAttrValue("enableEdit")

        const code = [
            `${variableName} = Table(master=${parent})`,
            `${variableName}.editable = ${enableEdit ? "True" : "False"}`,
        ]

        if (textColor){
            code.push(`${variableName}.textColor = "${textColor}"`)
        }
        if (cellBg){
            code.push(`${variableName}.cellbackgr = "${cellBg}"`)
        }

        if (outlineColor){
            code.push(`${variableName}.boxoutlinecolor = "${outlineColor}"`)
        }

        if (defaultTable){
            code.push(`${variableName}.importCSV(${getPythonAssetPath(defaultTable, "text/csv")})`)
        }
        
        return [
                ...code,
                `${variableName}.show()`,
                `${variableName}.${this.getLayoutCode()}`
            ]
    }

    getToolbarAttrs(){

        const toolBarAttrs = super.getToolbarAttrs()


        return ({
            id: this.__id,
            widgetName: toolBarAttrs.widgetName,
            size: toolBarAttrs.size,

            ...this.state.attrs,

        })
    }

    renderContent(){
        return (
            <div className="tw-w-flex tw-flex-col tw-w-full tw-h-full tw-rounded-md 
                            tw-border tw-border-solid tw-border-gray-400 tw-overflow-hidden">
                <div className="tw-p-2 tw-w-full tw-h-full tw-content-start tw-pointer-events-none" 
                        style={this.state.widgetInnerStyling}>
                    <ResizableTable />
                </div>
            </div>
        )
    }

}


export default PandasTable




/**
 * {'align': 'w',
 'cellbackgr': '#F4F4F3',
 'cellwidth': 80,
 'floatprecision': 2,
 'thousandseparator': '',
 'font': 'Arial',
 'fontsize': 12,
 'fontstyle': '',
 'grid_color': '#ABB1AD',
 'linewidth': 1,
 'rowheight': 22,
 'rowselectedcolor': '#E4DED4',
 'textcolor': 'black'}
 */