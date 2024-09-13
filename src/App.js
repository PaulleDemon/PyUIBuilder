import { useRef, useState } from 'react'

import { LayoutFilled, ProductFilled, CloudUploadOutlined } from "@ant-design/icons"

import Sidebar from './sidebar/sidebar'
import WidgetsContainer from './sidebar/widgetsContainer'
import UploadsContainer from './sidebar/uploadsContainer'
import Canvas from './canvas/canvas'
import Header from './components/header'
import { DndContext, useSensors, useSensor, PointerSensor, closestCorners, DragOverlay, rectIntersection } from '@dnd-kit/core'
import { DraggableWidgetCard } from './components/cards'
import Widget from './canvas/widgets/base'
import { snapCenterToCursor } from '@dnd-kit/modifiers'


function App() {

	/**
	 * @type {Canvas | null>}
	*/
	const canvasRef = useRef() 
	const widgetOverlayRef = useRef()
	const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })


    const [uploadedAssets, setUploadedAssets] = useState([]) //  a global storage for assets, since redux can't store files(serialize files)

	const [dropAnimation, setDropAnimation] = useState(null)

	const [sidebarWidgets, setSidebarWidgets] = useState([])
	const [canvasWidgets, setCanvasWidgets] = useState([]) // contains the reference to the widgets inside the canvas
	
	const [activeSidebarWidget, setActiveSidebarWidget] = useState(null) // helps with the dnd overlay

	const sensors = useSensors(
		useSensor(PointerSensor)
	)

	const sidebarTabs = [
		{
			name: "Widgets",
			icon: <LayoutFilled />,
			content: <WidgetsContainer onWidgetsUpdate={(widgets) => setSidebarWidgets(widgets)}/>
		},
		{
			name: "Extensions",
			icon: <ProductFilled />,
			content: <></>
		},
		{
			name: "Uploads",
			icon: <CloudUploadOutlined />,
			content: <UploadsContainer assets={uploadedAssets} 
						onAssetUploadChange={(assets) => setUploadedAssets(assets)}/>
		}
	]

	const handleDragStart = (event) => {
		console.log("Drag start: ", event)
		const draggedItem = sidebarWidgets.find((item) => item.name === event.active.id)
		setActiveSidebarWidget(draggedItem)

		const activeItemElement = widgetOverlayRef.current

		if (activeItemElement) {
			const rect = activeItemElement.getBoundingClientRect()
			
			// Store the initial position of the dragged element
			setInitialPosition({
				x: rect.left,
				y: rect.top,
			})
		}
	}

	const handleDragMove = (event) => {

		// console.log("drag move: ", event)
	}

	const handleDragEnd = (event) => {
		// add items to canvas from sidebar

		const {active, over, delta, activatorEvent} = event

		const widgetItem = active.data.current?.title
		const activeItemElement =  widgetOverlayRef.current


		console.log("ended: ", activatorEvent.clientX, activatorEvent.clientY)
		// console.log("over: ", active, over, activeItemElement)
		if (over?.id !== "canvas-droppable" || !widgetItem) {
			setDropAnimation({ duration: 250, easing: "ease" })
			return
		}
		setDropAnimation(null)

		// FIXME: drop offset is not correct
		// Calculate the dragged item's bounding rectangle
		const itemRect = activeItemElement.getBoundingClientRect();
		const itemCenterX = itemRect.left + itemRect.width / 2
		const itemCenterY = itemRect.top + itemRect.height / 2

		console.log("widget overlay: ", delta, itemRect)

	
		 // Get widget dimensions (assuming you have a way to get these)
		 const widgetWidth = activeItemElement.offsetWidth; // Adjust this based on how you get widget size
		 const widgetHeight = activeItemElement.offsetHeight; // Adjust this based on how you get widget size
	   

		const canvasContainerRect = canvasRef.current.getCanvasContainerBoundingRect()
		const canvasTranslate = canvasRef.current.getCanvasTranslation()
		const zoom = canvasRef.current.getZoom()

		// let finalPosition = {	
		// 	x: (delta.x - canvasContainerRect.x - canvasTranslate.x) / zoom,
		// 	y: (delta.y - canvasContainerRect.y - canvasTranslate.y) / zoom,
		// }

		let finalPosition = {	
			x: (initialPosition.x + delta.x - canvasContainerRect.x - canvasTranslate.x) / zoom - (widgetWidth / 2),
			y: (initialPosition.y + delta.y - canvasContainerRect.y - canvasTranslate.y) / zoom - (widgetHeight / 2),
		}


		// find the center of the active widget then set the final position

		// finalPosition = {
		// 	finalPosition
		// }

		console.log("drop position: ", "delta: ", delta, "activator", finalPosition, canvasTranslate,)

		canvasRef.current.addWidget(Widget, ({id, widgetRef}) => {
			widgetRef.current.setPos(finalPosition.x, finalPosition.y)
			// widgetRef.current.setPos(10, 10)
		})

		setActiveSidebarWidget(null)

	}

	const handleWidgetAddedToCanvas = (widgets) => {
		console.log("canvas ref: ", canvasRef)
		setCanvasWidgets(widgets)
	}

	return (
		<div className="tw-w-full tw-h-[100vh] tw-flex tw-flex-col tw-bg-primaryBg">
			<Header className="tw-h-[6vh]"/>
			
			<DndContext
					modifiers={[snapCenterToCursor]}
					collisionDetection={rectIntersection}
					onDragStart={handleDragStart}
					onDragMove={handleDragMove}
					onDragEnd={handleDragEnd}
					
				>
				<div className="tw-w-full tw-h-[94vh] tw-flex">
					<Sidebar tabs={sidebarTabs}/>
					<Canvas ref={canvasRef} widgets={canvasWidgets} onWidgetAdded={handleWidgetAddedToCanvas}/>
				</div>

				{/* dragOverlay (dnd-kit) helps move items from one container to another */}
				<DragOverlay dropAnimation={dropAnimation}>
					{activeSidebarWidget ? (
							<DraggableWidgetCard name={activeSidebarWidget.name}
												 img={activeSidebarWidget.img}
												 url={activeSidebarWidget.link}
												 innerRef={widgetOverlayRef}
												/> 
							): 
					null}
				</DragOverlay>

			</DndContext>
		</div>
	)
}

export default App;
