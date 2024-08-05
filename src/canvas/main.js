import { useCallback, useRef, useState } from "react"
import FabricJSCanvas from "./fabricCanvas"


function Canvas(){

    const fabricCanvasRef = useRef()

    const updateCanvasDimensions = useCallback((event) => {
        console.log("Updating: ", fabricCanvasRef)
        if (!fabricCanvasRef.current)
            return

        const parent = event.target
        
        fabricCanvasRef.current.setDimensions({ width: parent.clientWidth, height: parent.clientHeight })
        fabricCanvasRef.current.renderAll()

    }, [fabricCanvasRef])


    return (
        <div className="tw-flex tw-w-full tw-h-full tw-max-h-[100vh] tw-overflow-auto"
                
                        >
            <FabricJSCanvas className="tw-bg-red-200" 
                            onCanvasContextUpdate={(canvas) => fabricCanvasRef.current = canvas}/>
        </div>
    )
}


export default Canvas