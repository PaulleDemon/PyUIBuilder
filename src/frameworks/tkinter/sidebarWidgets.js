
import Widget from "../../canvas/widgets/base"

import ButtonWidget from "./assets/widgets/button.png"
import Button from "./widgets/button"
import Frame from "./widgets/frame"
import Input from "./widgets/input"
import Label from "./widgets/label"
import MainWindow from "./widgets/mainWindow"
import TopLevel from "./widgets/toplevel"


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
        widgetClass: TopLevel
    },
    {
        name: "Frame",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Frame
    },
    {
        name: "Label",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Label
    },
    {
        name: "Button",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Button
    },
    {
        name: "Input",
        img: ButtonWidget,
        link: "https://github.com",
        widgetClass: Input
    },
]


export default TkinterSidebar