import { useCallback, useRef, useEffect, useMemo } from "react"
import * as fabric from 'fabric'

/**
 * 
 * This is a functional based component of the canvas which was discarded because it makes code
 * ugly and hard to interface with fabric.js, Fabric 6 has breaking changes such as dispose, is async
 * which interferes wih useEffect 
 */

function Canvas(){

    const canvasRef = useRef(null)

    const canvas = useMemo(() => {
        const options = {}

        if (canvasRef.current)
            return new fabric.Canvas(canvasRef.current, options)
        else
            return null

    }, [canvasRef.current])

    useEffect(() => {

        return () => {
            canvas?.dispose() // canvas.dispose is async, https://github.com/fabricjs/fabric.js/issues/8299
        }

    }, [])

  

    useEffect(() => {
        if (canvasRef.current && canvas) {
            window.addEventListener("resize", updateCanvasDimensions)
            updateCanvasDimensions()
        }

        return () => {
            window.removeEventListener("resize", updateCanvasDimensions)
        }
    }, [canvasRef, canvas])


    const updateCanvasDimensions = useCallback(() => {
        if (!canvasRef.current || !canvas)
            return
        // console.log("Updating canvas")
        const parent = canvasRef.current.parentNode.parentNode // this is the canvas outer container

        canvas.setDimensions({ width: parent.clientWidth, height: parent.clientHeight })
        canvas.calcOffset()

        canvas.renderAll()

    }, [canvas, canvasRef])



    return (
        <div className="tw-relative tw-flex tw-w-full tw-h-full tw-max-h-[100vh] tw-overflow-auto"
                        onResize={updateCanvasDimensions}>
            <canvas className="tw-bg-red-200 tw-w-full tw-h-full" ref={canvasRef}/>
            
        </div>
    )
}


export default Canvas