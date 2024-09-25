



import React, { useEffect, useRef, useState } from "react"

import Widget from "../../../canvas/widgets/base"
import { removeKeyFromObject } from "../../../utils/common"

import MapImage from "./assets/map.png"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"


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


class PandasTable extends Widget{

    static widgetType = "pandas_table"

    constructor(props) {
        super(props)

        this.droppableTags = null
        
        const newAttrs = removeKeyFromObject("layout", this.state.attrs)

        this.state = {
            ...this.state,
            size: { width: 400, height: 250 },
        }
    }

    componentDidMount(){
        super.componentDidMount()
        this.setWidgetName("Pandas Table")
        this.setAttrValue("styling.backgroundColor", "#E4E2E2")
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