import { useState } from 'react'

import { LayoutFilled, ProductFilled, CloudUploadOutlined } from "@ant-design/icons"

import Sidebar from './sidebar/sidebar'
import WidgetsContainer from './sidebar/widgetsContainer'
import UploadsContainer from './sidebar/uploadsContainer'
import Canvas from './canvas/canvas'
import Header from './components/header'
import { DndContext, useSensors, useSensor, PointerSensor, closestCorners, DragOverlay } from '@dnd-kit/core'
import { DraggableWidgetCard } from './components/cards'


function App() {

    const [uploadedAssets, setUploadedAssets] = useState([]) //  a global storage for assets, since redux can't store files(serialize files)

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
		console.log("Dragging", event.active)
		const draggedItem = sidebarWidgets.find((item) => item.name === event.active.id)
		setActiveSidebarWidget(draggedItem)
	}

	const handleDragMove = (event) => {
	}

	const handleDragEnd = (event) => {
		// add items to canvas from sidebar
		const widgetItem = event.active.data.current?.title

		if (event.over?.id !== "cart-droppable" || !widgetItem) return
		// const temp = [...widgets]
		// temp.push(widgetItem)
		// setCanvasWidgets(temp)	
		setActiveSidebarWidget(null)

	}


	return (
		<div className="tw-w-full tw-h-[100vh] tw-flex tw-flex-col tw-bg-primaryBg">
			<Header className="tw-h-[6vh]"/>
			
			<DndContext sensors={sensors} collisionDetection={closestCorners}
					onDragStart={handleDragStart}
					onDragMove={handleDragMove}
					onDragEnd={handleDragEnd}
				>
				<div className="tw-w-full tw-h-[94vh] tw-flex">
					<Sidebar tabs={sidebarTabs}/>
					<Canvas widgets={canvasWidgets}/>
				</div>

				{/* dragOverlay (dnd-kit) helps move items from one container to another */}
				<DragOverlay>
					{activeSidebarWidget ? (
							<DraggableWidgetCard name={activeSidebarWidget.name}
												 img={activeSidebarWidget.img}
												 url={activeSidebarWidget.url}
												/> 
							): 
					null}
				</DragOverlay>

			</DndContext>
		</div>
	)
}

export default App;
