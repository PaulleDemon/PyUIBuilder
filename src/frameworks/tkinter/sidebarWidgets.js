
import Widget from "../../canvas/widgets/base"

import ButtonWidget from "./assets/widgets/button.png"
import MainWindow from "./widgets/mainWindow"


const TkinterSidebar = [
    {
        name: "Main window",
        img: ButtonWidget,
        link: "https://github.com", 
        widgetClass: MainWindow
    },
    {
        name: "Top Level",
        img: ButtonWidget,
        link: "https://github.com", 
        widgetClass: Widget
    },
    {
        name: "Frame",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Widget
    },
    {
        name: "Button",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Widget
    },
    {
        name: "Input",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Widget
    },
]


export default TkinterSidebar