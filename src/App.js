import { useState } from 'react'

import { LayoutFilled, ProductFilled, CloudUploadOutlined } from "@ant-design/icons"

import Sidebar from './sidebar/sidebar'
import WidgetsContainer from './sidebar/widgetsContainer'
import UploadsContainer from './sidebar/uploadsContainer'
import Canvas from './canvas/canvas'
import Header from './components/header'

function App() {

    const [uploadedAssets, setUploadedAssets] = useState([]) //  a global storage for assets, since redux can't store files(serialize files)


	const tabs = [
		{
			name: "Widgets",
			icon: <LayoutFilled />,
			content: <WidgetsContainer />
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

	return (
		<div className="tw-w-full tw-h-[100vh] tw-flex tw-flex-col tw-bg-primaryBg">
			<Header className="tw-h-[6vh]"/>
			<div className="tw-w-full tw-h-[94vh] tw-flex">
				<Sidebar tabs={tabs}/>
				<Canvas />
			</div>
		</div>
	);
}

export default App;
