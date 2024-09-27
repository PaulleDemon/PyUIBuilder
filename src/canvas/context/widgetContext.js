import React, { createContext, Component } from 'react'

const WidgetContext = createContext()

// NOTE: Don't use this context provider

class WidgetProvider extends Component {
    state = {
        activeWidget: null,  // Keeps track of the active widget's data
        widgetMethods: null,  // Function to update active widget's state
    }

    setActiveWidget = (widgetData, widgetMethods) => {
        this.setState({
            activeWidget: widgetData,
            widgetMethods: widgetMethods,  // Store the update function of the active widget
        })
    }

    render() {
        return (
            <WidgetContext.Provider
                value={{
                    activeWidget: this.state.activeWidget,
                    setActiveWidget: this.setActiveWidget,
                    widgetMethods: this.state.widgetMethods,  // Expose the update function
                }}
            >
                {this.props.children}
            </WidgetContext.Provider>
        )
    }
}

export { WidgetContext, WidgetProvider }
