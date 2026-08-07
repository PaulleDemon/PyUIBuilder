# Supported frameworks/libraries

| Framework | Status |
|---|---|
| Tkinter | ✅ Supported |
| CustomTkinter | ✅ Supported |
| PySide / PyQt | ✅ Supported |


## Tkinter

Default library thats comes with python. Generated code uses the standard library `tkinter` module plus any third-party Tkinter widgets you've added (e.g. `tkintermapview`, `tktimepicker`).

- Output is OS-dependent — Tkinter itself renders slightly differently across Windows, macOS, and Linux, so what you see on canvas is a common design surface, not a pixel-exact OS preview.

## CustomTkinter

A modern, themeable layer on top of Tkinter — rounded corners, built-in dark/light theming. If you want the on-canvas design to match the exported output more closely than plain Tkinter does, this is the closer match (see [FAQ](faq.md#common-faqs)).

## PySide / PyQt

Now available as a builder target. Supports the same widget/layout/event-handler workflow as the other frameworks — drag widgets, set attributes, wire up handlers in the Code Editor, and export.

## Choosing a framework

- **Tkinter** — ships with Python, no extra runtime, good for scripts and internal tools.
- **CustomTkinter** — same ecosystem as Tkinter, but a more modern look out of the box, and design-to-output fidelity is closer.
- **PySide/PyQt** — a mature, native-feeling widget set for larger desktop applications.

Switching frameworks mid-project clears the canvas, so it's worth prototyping the choice on a throwaway project first if you're unsure.