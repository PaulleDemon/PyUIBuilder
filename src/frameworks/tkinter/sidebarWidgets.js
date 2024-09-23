

import { CheckBox, RadioButton } from "./widgets/ checkButton"
import Button from "./widgets/button"
import Frame from "./widgets/frame"
import { Input, Text } from "./widgets/input"
import Label from "./widgets/label"
import MainWindow from "./widgets/mainWindow"
import OptionMenu from "./widgets/optionMenu"
import Slider from "./widgets/slider"
import TopLevel from "./widgets/toplevel"
import SpinBox from "./widgets/spinBox"

import MainWindowImage from "./assets/widgets/mainwindow.png"
import TopLevelImage from "./assets/widgets/Toplevel.png"
import FrameImage from "./assets/widgets/frame2.png"
import LabelImage from "./assets/widgets/label.png"
import ButtonImage from "./assets/widgets/button.png"
import InputImage from "./assets/widgets/input.png"
import TextAreaImage from "./assets/widgets/textarea.png"
import SliderImage from "./assets/widgets/slider.png"
import DropDownImage from "./assets/widgets/dropdown.png"
import CheckButtonImage from "./assets/widgets/check.png"
import RadioButtonImage from "./assets/widgets/radio.png"
import SpinBoxImage from "./assets/widgets/spinbox.png"


const TkinterSidebar = [
    {
        name: "Main window",
        img: MainWindowImage,
        link: "https://github.com", 
        widgetClass: MainWindow
    },
    {
        name: "Top Level",
        img: TopLevelImage,
        link: "https://github.com", 
        widgetClass: TopLevel
    },
    {
        name: "Frame",
        img: FrameImage,
        link: "https://github.com",
        widgetClass: Frame
    },
    {
        name: "Label",
        img: LabelImage,
        link: "https://github.com",
        widgetClass: Label
    },
    {
        name: "Button",
        img: ButtonImage,
        link: "https://github.com",
        widgetClass: Button
    },
    {
        name: "Entry",
        img: InputImage,
        link: "https://github.com",
        widgetClass: Input
    },
    {
        name: "Text",
        img: TextAreaImage,
        link: "https://github.com",
        widgetClass: Text
    },
    {
        name: "CheckBox",
        img: CheckButtonImage,
        link: "https://github.com",
        widgetClass: CheckBox
    },
    {
        name: "Radio button",
        img: RadioButtonImage,
        link: "https://github.com",
        widgetClass: RadioButton
    },
    {
        name: "Scale",
        img: SliderImage,
        link: "https://github.com",
        widgetClass: Slider
    },
    {
        name: "Option Menu",
        img: DropDownImage,
        link: "https://github.com",
        widgetClass: OptionMenu
    },
    {
        name: "Spinbox",
        img: SpinBoxImage,
        link: "https://github.com",
        widgetClass: SpinBox
    },

]


export default TkinterSidebar


/**
 *  widgets = {
        "Tk": set(),
        "Label": set(),
        "Button": set(),
        "Entry": set(),
        "CheckButton": set(),
        "RadioButton": set(),
        "Scale": set(),
        "ListBox": set(),
        "Frame": set(),
        "LabelFrame": set(),
        "PanedWindow": set(),
        "SpinBox": set(),
        "OptionMenu": set(),
        "Canvas": set(),
        "TopLevel": set(),
        "Message": set(),
        "Menu": set(),
        "MenuButton": set(),
        "ScrollBar": set(),
        "Text": set()
    }
 */