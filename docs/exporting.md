# Exporting code

Once you're happy with the UI, click **Export code** in the header. The code is downloaded to your local machine.

## requirements.txt

A `requirements.txt` file is generated automatically whenever your UI uses a third-party widget. Before running the exported code, install dependencies:

```bash
pip install -r requirements.txt
```

## Saving and loading your project

This is separate from exporting code — it saves your **editable project** (the widget tree and layout), not the generated Python.

- **Save**: File dropdown → **Save**.
- **Load**: File dropdown → **Load**, then pick a previously saved design file.

This is how you resume work on a design across sessions without re-building it from scratch, or share a design file with someone else to continue editing in the builder.