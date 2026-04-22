# Website Package Tools

## Rebuild edited HTML files from a project package

Use the exported project package JSON from the browser helper with:

```powershell
powershell -ExecutionPolicy Bypass -File .\Apply-WebsitePackage.ps1 -PackagePath .\the-digital-atlas-project-package.json
```

Optional output folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\Apply-WebsitePackage.ps1 -PackagePath .\the-digital-atlas-project-package.json -OutputDir .\rebuilt-site
```

## What it does

- reads `the-digital-atlas-project-package.json`
- applies saved text edits
- applies saved category title edits
- applies section hide/show state
- applies saved section order
- applies saved drag-and-drop order for supported grids
- injects the saved global style variables
- writes real `.html` files into the output folder
- copies shared assets like `styles.css`, `app.js`, and logo files

## Output

By default the script writes to:

```text
.\exported-site
```

It also writes:

- `the-digital-atlas-state.json`

inside the output folder for reuse later.

## Double-click option

If the package file is in the project root, you can also just run:

```text
Rebuild-WebsitePackage.bat
```

That will rebuild the website into:

```text
.\exported-site
```
