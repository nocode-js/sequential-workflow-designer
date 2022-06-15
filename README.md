![Sequential Workflow Designer](.github/cover.png)

# Sequential Workflow Designer

Sequential workflow designer with no dependencies.

TODO

## 👀 Examples

* [❎ Fullscreen](https://b4rtaz.github.io/sequential-workflow-designer/examples/fullscreen.html)
* [🌅 Image Filter](https://b4rtaz.github.io/sequential-workflow-designer/examples/image-filter.html)
* [⛅ Light Dark](https://b4rtaz.github.io/sequential-workflow-designer/examples/fullscreen.html)
* [⏩ Live Testing](https://b4rtaz.github.io/sequential-workflow-designer/examples/live-testing.html)
* [🔴 Particles](https://b4rtaz.github.io/sequential-workflow-designer/examples/particles.html)

## 🚀 Installation

### NPM

Install this package by [NPM](https://www.npmjs.com/) command:

`npm i sequential-workflow-designer`

To import the package:

```ts
import Designer from 'sequential-workflow-designer';
```

If you use [css-loader](https://webpack.js.org/loaders/css-loader/) or similar, you can add CSS files to your boundle:

```ts
import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-designer/css/designer-dark.css';
```

### CDN

Add the below code to your head section in HTML document.

```html
<head>
...
<link href="//cdn.jsdelivr.net/npm/sequential-workflow-designer/css/designer.css" rel="stylesheet">
<link href="//cdn.jsdelivr.net/npm/sequential-workflow-designer/css/designer-light.css" rel="stylesheet">
<link href="//cdn.jsdelivr.net/npm/sequential-workflow-designer/css/designer-dark.css" rel="stylesheet">
<script src="//cdn.jsdelivr.net/npm/sequential-workflow-designer/lib/designer.js"></script>
```

Call the designer by:

```js
sequentialWorkflowDesigner.create(...);
```
