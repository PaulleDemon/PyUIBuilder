import Cursor from "./constants/cursor"
import Widget from "./widgets/base"
import { useEffect, useState } from "react"

// FIXME: when using this if the widhet has invisible swappable area, this won't work
/**
 * 
 * @param {Widget} - selectedWidget 
 * @returns 
 */
const ResizeWidgetContainer = ({selectedWidget, onResize}) => {

    const [pos, setPos] = useState({x: 0, y: 0})
    const [size, setSize] = useState({width: 0, height: 0})

    useEffect(() => {

        if (selectedWidget){
            setPos(selectedWidget.getPos())
            setSize(selectedWidget.getSize())
        }

        console.log("selected widget resizable: ", selectedWidget)

    }, [selectedWidget, selectedWidget?.getPos(), selectedWidget?.getSize()])



    return (
        <div className={`tw-absolute tw-bg-transparent tw-top-[-20px] tw-left-[-20px] tw-opacity-100 
            tw-w-full tw-h-full tw-z-[-1] tw-border-2 tw-border-solid tw-border-blue-500`}
            style={{
                top: `${pos.y - 40}px`,
                left: `${pos.x - 20}px`,
                width: `${size.width + 40}px`,
                height: `${size.height + 40}px`,
            }}
        >

            <div className={`"tw-relative tw-w-full  tw-h-full"`}>
                {/* <EditableDiv value={this.state.widgetName} onChange={this.setWidgetName}
                    maxLength={40}
                    openEdit={this.state.enableRename}
                    className="tw-text-sm tw-w-fit tw-max-w-[160px] tw-text-clip tw-min-w-[150px] 
                                            tw-overflow-hidden tw-absolute tw--top-6 tw-h-6"
                /> */}

                <div
                    className="tw-w-2 tw-h-2 tw-absolute  tw--left-1 tw--top-1 tw-bg-blue-500"
                    style={{ cursor: Cursor.NW_RESIZE }}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onResize("nw")
                        // this.setState({ dragEnabled: false })
                    }}
                // onMouseUp={() => this.setState({ dragEnabled: true })}
                />
                <div
                    className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--top-1 tw-bg-blue-500"
                    style={{ cursor: Cursor.SW_RESIZE }}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onResize("nw")
                        // this.setState({ dragEnabled: false })
                    }}
                // onMouseUp={() => this.setState({ dragEnabled: true })}
                />
                <div
                    className="tw-w-2 tw-h-2 tw-absolute tw--left-1 tw--bottom-1 tw-bg-blue-500"
                    style={{ cursor: Cursor.SW_RESIZE }}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onResize("nw")
                        // this.props.onWidgetResizing("sw")
                        // this.setState({ dragEnabled: false })
                    }}
                    onMouseUp={() => this.setState({ dragEnabled: true })}
                />
                <div
                    className="tw-w-2 tw-h-2 tw-absolute tw--right-1 tw--bottom-1 tw-bg-blue-500"
                    style={{ cursor: Cursor.SE_RESIZE }}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onResize("nw")
                        // this.props.onWidgetResizing("se")
                        // this.setState({ dragEnabled: false })
                    }}
                // onMouseUp={() => this.setState({ dragEnabled: true })}
                />

            </div>

        </div>
    )
}


export default ResizeWidgetContainer