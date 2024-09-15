import { useState } from "react"


const DroppableWrapper = ({onDrop, ...props}) => {


    const [showDroppable, setShowDroppable] = useState({
                                                            show: false, 
                                                            allow: false
                                                        })

    const handleDragEnter = () => {
        console.log("Drag start")
        setShowDroppable({
            allow: true, 
            show: true
        })
    }

    const handleDragOver = (e) => {
        // console.log("Drag over: ", e)
        e.preventDefault()
    }

    const handleDropEvent = (e) => {

        setShowDroppable({
            allow: false, 
            show: false
        })

        if(onDrop){
            onDrop(e)
        }
    }


    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setShowDroppable({
                allow: false, 
                show: false
            })
        }
    }

    return (
        <div className={`${props.className}`}
                onDragOver={handleDragOver}
                onDrop={handleDropEvent}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                >
            {/* {
                showDroppable.show && 
                <div className={`${showDroppable.allow ? "tw-bg-[#b9f18e77]" : "tw-bg-[#ff7a7a6d]"} 
                                tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-z-[2]`}>
                </div>
            } */}
            {props.children}
            
        </div>
    )

}


export default DroppableWrapper