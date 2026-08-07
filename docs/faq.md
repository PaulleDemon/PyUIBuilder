# FAQ

## Common FAQs

**Why does the design I created in Tkinter look a bit off from my actual output?**

Tkinter is an OS-dependent framework, and PyUIBuilder gives you a common design interface to work in regardless of OS. We may consider rendering the design based on your actual OS in the future.

For a closer match between design and output, try the **CustomTkinter** framework instead.

**Why do I see a small padding in the design, but not in the Tkinter output?**

The default padding in the design exists so widgets are easy to drag and drop. You can adjust the output padding from the toolbar. We may add a default output padding in the future.

## Login and license FAQ

**I purchased a paid plan — where's my license key?**

Your account is automatically upgraded to the pro/hobby plan you purchased. You don't need a license key for normal use — that's only needed if you're purchasing licenses in bulk.

PyUIBuilder uses OAuth login (instead of manual license keys) so logging in is consistent between the web app and the desktop app.

**I'm on a paid plan, but the desktop app splash screen is asking for a license key.**

You likely logged into the wrong account on desktop. Log out using the logout button at the bottom-left, below the active key button, then log back in with the correct account.

![Logout desktop](./assets/logout%20desktop.png)

## Desktop app FAQs

**Do I need Python pre-installed?**

If the desktop app detects Python isn't installed, it'll prompt you to install it. The app bundles Python for you, except on **Mac Intel** builds, which use your system Python.

**Does a workspace automatically save my design?**

No — a workspace is used to create a virtual environment for running Python, not to store your design. Use **Save/Load** from the File menu to persist a project. See [Exporting code](exporting.md#saving-and-loading-your-project).

---

Something not covered here? Ask in the [Discord](https://discord.gg/dHXjrrCA7G).