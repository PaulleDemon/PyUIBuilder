import React, { createContext, Component, useContext, useState, createRef, useMemo } from 'react'



// NOTE: using this context provider causes many re-rendering when the canvas is panned the toolbar updates unnecessarily
// use draggable widgetcontext

// Create the Context
export const ActiveWidgetContext = createContext()

// Create the Provider component
export class ActiveWidgetProvider extends Component {
    state = {
        activeWidgetId: null,
        activeWidgetAttrs: {}
    }

    updateActiveWidget = (widget) => {
        this.setState({ activeWidgetId: widget })
    }

    updateToolAttrs = (widgetAttrs) => {
        this.setState({activeWidgetAttrs: widgetAttrs})
    }

    render() {
        return (
            <ActiveWidgetContext.Provider
                value={{ ...this.state, updateActiveWidget: this.updateActiveWidget, updateToolAttrs: this.updateToolAttrs }}
            >
                {this.props.children}
            </ActiveWidgetContext.Provider>
        );
    }
}

// Custom hook for function components
export const useActiveWidget = () => {
    const context = useContext(ActiveWidgetContext)
    if (context === undefined) {
        throw new Error('useActiveWidget must be used within an ActiveWidgetProvider')
    }
    return useMemo(() => context, [context.activeWidgetId, context.activeWidgetAttrs, context.updateToolAttrs, context.updateActiveWidget])
}

// Higher-Order Component for class-based components
export const withActiveWidget = (WrappedComponent) => {
    return class extends Component {

        render() {
            return (
                <ActiveWidgetContext.Consumer>
                    {context => <WrappedComponent {...this.props} {...context} />}
                </ActiveWidgetContext.Consumer>
            )
        }
    }
}



