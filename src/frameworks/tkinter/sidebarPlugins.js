
import ClockImage from "./assets/widgets/plugins/clock.png"
import VideoImage from "./assets/widgets/plugins/video.png"
import MapImage from "./assets/widgets/plugins/map.png"
import DataTableImage from "./assets/widgets/plugins/tables.png"

import AnalogTimePicker from "./plugins/analogTimepicker"
import VideoPlayer from "./plugins/videoPlayer"
import MapView from "./plugins/mapview"
import PandasTable from "./plugins/pandasTable"

// TODO: add license for 3rd party plugins

const TkinterPluginWidgets = [
    {
        name: "Analog TimePicker",
        img: ClockImage,
        link: "https://github.com/PaulleDemon/tkTimePicker",
        widgetClass: AnalogTimePicker,
        license: {
            name: "MIT",
            url: ""
        }
    },
    {
        name: "Video Player",
        img: VideoImage,
        link: "https://github.com/PaulleDemon/tkVideoPlayer",
        widgetClass: VideoPlayer,
        license: {
            name: "MIT",
            url: ""
        }
    },
    {
        name: "Map viewer",
        img: MapImage,
        link: "https://github.com/TomSchimansky/TkinterMapView",
        widgetClass: MapView,
        license: {
            name: "CC0 1.0",
            url: "https://github.com/TomSchimansky/TkinterMapView/blob/main/LICENSE.txt"
        }
    },
    {
        name: "Pandas Table",
        img: DataTableImage,
        link: "https://github.com/dmnfarrell/pandastable",
        widgetClass: PandasTable,
        license: {
            name: "GPL v3",
            url: "https://github.com/dmnfarrell/pandastable/blob/master/LICENSE"
        }
    },

]


export default TkinterPluginWidgets
