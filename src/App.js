import { useState } from 'react'

import { LayoutFilled, ProductFilled, CloudUploadOutlined } from "@ant-design/icons"

import Sidebar from './sidebar/sidebar'
import WidgetsContainer from './sidebar/widgetsContainer'
import UploadsContainer from './sidebar/uploadsContainer'
import Canvas from './canvas/canvas'

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
		<div className="tw-w-full tw-h-[100vh] tw-flex tw-bg-primaryBg">

			<Sidebar tabs={tabs}/>
			<Canvas />
		</div>
	);
}

export default App;
