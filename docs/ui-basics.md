# UI basics

## Profile

Hover over the profile icon in the top-right corner to check which plan you're on or to log out.

## The builder layout

![Layout basics](./assets/basics.png)

1. **Sidebar (left)** — multiple tabs, each giving you a different set of tools:
   - **Widgets** — drag built-in widgets onto the canvas
   - **Plugins** — third-party widget libraries (see [Plugins & templates](plugins.md))
   - **Tree view** — a hierarchical view of every widget currently on the canvas, useful for selecting deeply nested widgets
   - **Uploads** — upload local assets (e.g. images) to use in the design
   - **Templates** — pre-built layouts you can start a project from
   - **Code Editor** — write the event handler code for your widgets (see [Event handlers](event-handlers.md))
2. **Canvas** — where you drag and drop widgets to build the layout.
3. **Toolbar** — appears only when a widget is selected; contains that widget's attributes (colors, size, layout options, etc.), organized into collapsible sections.
4. **Code editor** — where you write event handler code for the selected widget's events.

## Canvas

Things you can do on the canvas:

1. Add widgets from the sidebar.
2. Zoom and pan using the mouse.
3. Zoom using the `+` / `-` keys.
4. Delete a widget with the `Del` key, or by right-clicking it (on Mac: `fn + Delete`).
5. Duplicate the selected widget with `Ctrl/Cmd + D`.

## Project name

New projects default to `"untitled project"`. Rename the project from the header input next to **Export code**.

## Selecting a UI library

Choose the target framework (Tkinter, CustomTkinter, or PySide/PyQt) from the header dropdown. **Changing the framework mid-project erases the canvas**, so pick before you start building. See [Supported frameworks](supported-frameworks.md).

## Grids and snapping

![Grids and snapping](./assets/grids.png)

Open the grid controls from the top-left, near the delete icon.

- Toggle **Enable snap** to snap widgets to the grid as you position them.
- Use the slider to adjust grid size.
- You can also enable a grid for a parent widget individually, by switching that widget's own grid toggle on — useful when you want snapping inside one container without affecting the rest of the canvas.

## Live preview and demo

- **Watch Demo** (header) plays a walkthrough of the builder.
- **Preview** (desktop app only) runs your current UI immediately, without exporting code first — see [Desktop app](desktop-app.md#live-preview).