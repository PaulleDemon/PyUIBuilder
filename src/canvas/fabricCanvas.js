import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as fabric from 'fabric'

/**
 * NOTE: Not in use
 */
function FabricJSCanvas({ canvasOptions, className = '', onCanvasContextUpdate }) {

    const canvasRef = useRef(null)

    const fabricCanvasRef = useRef(null)

    useEffect(() => {

        const options = {}
        let canvas = null
        if (canvasRef.current) {
            canvas = new fabric.Canvas(canvasRef.current, options)
            const parent = canvasRef.current.parentNode.parentNode
            canvas.setDimensions({ width: parent.clientWidth, height: parent.clientHeight })
            canvas.calcOffset()

            fabricCanvasRef.current = canvas
            canvasRef.current.parentNode.style.width = "100%"
            canvasRef.current.parentNode.style.height = "100%"
            
            console.log("Parent: ", canvasRef.current.parentNode.parentNode)
            
            canvasRef.current.parentNode.parentNode.addEventListener("resize", updateCanvasDimensions)
            window.addEventListener("resize", updateCanvasDimensions)

            // make the fabric.Canvas instance available to your app
            if (onCanvasContextUpdate)
                onCanvasContextUpdate(canvas)
        }

        return () => {
            window.removeEventListener("resize", updateCanvasDimensions)
            canvasRef.current.parentNode.parentNode.removeEventListener("resize", updateCanvasDimensions)
        
            if (onCanvasContextUpdate)
                onCanvasContextUpdate(null)

            canvas.dispose()
        }
    }, [canvasRef])


    const updateCanvasDimensions = useCallback(() => {
        if (!canvasRef.current || !fabricCanvasRef.current)
            return
        // console.log("Updating canvas")
        const parent = canvasRef.current.parentNode.parentNode

        fabricCanvasRef.current.setDimensions({ width: parent.clientWidth, height: parent.clientHeight })
        fabricCanvasRef.current.calcOffset()

        fabricCanvasRef.current.renderAll()

    }, [fabricCanvasRef, canvasRef])

  

    return <canvas className={className} ref={canvasRef}/>
}


export default FabricJSCanvas