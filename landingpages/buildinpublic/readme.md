
**Github**: https://github.com/PaulleDemon/awesome-landing-pages

## Usage

* This template uses tailwind css every tailwind class are prefixed with `tw-`, to help differentiate
  between tailwind classes and other classes  

During development add the following to head tag

```html
<link rel="stylesheet" href="tailwind-runtime.css"><!--replace with path to your tailwind runtime-->
```
During production use

```html
<link rel="stylesheet" href="tailwind-build.css"><!--replace with path to your tailwind build-->
```

To start Tailwind during development use
```html
npm run start:tailwind
```

To create a build file use
```html
npm run build:tailwind
```