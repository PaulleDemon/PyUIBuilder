

const DraggableWrapper = (props) => {


    const handleDragStart = () => {
        console.log("Drag start")
    }

    const handleDragOver = () => {
        // console.log("Drag over")
    }

    const handleDragEnd = (e) => {
        // console.log("Drag end: ", e, e.target.closest('div'))

    }

    return (
        <div className={`${props.className}`} draggable 
                onDragStart={handleDragStart} 
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                >
            {props.children}
        </div>
    )

}


export default DraggableWrapper