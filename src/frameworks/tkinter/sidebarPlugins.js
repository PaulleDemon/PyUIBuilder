
import ClockImage from "./assets/widgets/plugins/clock.png"
import VideoImage from "./assets/widgets/plugins/video.png"
import MapImage from "./assets/widgets/plugins/map.png"
import DataTableImage from "./assets/widgets/plugins/tables.png"

import AnalogTimePicker from "./plugins/analogTimepicker"
import VideoPlayer from "./plugins/videoPlayer"
import MapView from "./plugins/mapview"
import PandasTable from "./plugins/pandasTable"


const TkinterPluginWidgets = [
    {
        name: "Analog TimePicker",
        img: ClockImage,
        link: "https://github.com", 
        widgetClass: AnalogTimePicker
    },
    {
        name: "Video Player",
        img: VideoImage,
        link: "https://github.com/PaulleDemon/tkVideoPlayer", 
        widgetClass: VideoPlayer
    },
    {
        name: "Map viewer",
        img: MapImage,
        link: "https://github.com/TomSchimansky/TkinterMapView", 
        widgetClass: MapView
    },
    {
        name: "Pandas Table",
        img: DataTableImage,
        link: "https://github.com/dmnfarrell/pandastable", 
        widgetClass: PandasTable
    },
   
]


export default TkinterPluginWidgets
