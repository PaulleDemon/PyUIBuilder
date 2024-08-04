import Sidebar from './sidebar/sidebar';

import { LayoutFilled, ProductFilled, CloudUploadOutlined } from "@ant-design/icons";
import WidgetsContainer from './sidebar/widgetsContainer';


function App() {

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
			content: <></>
		}
	]

	return (
		<div className="tw-w-full tw-h-[100vh] tw-flex tw-bg-primaryBg">

			<Sidebar tabs={tabs}/>

		</div>
	);
}

export default App;
