![Sequential Workflow Designer](.github/cover.png)

# Sequential Workflow Designer

Sequential workflow designer with no dependencies for web. It's written in pure TypeScript and uses SVG for rendering. This designer is not associated with any workflow engine. It's full generic. You may create any kind application by this, from graphical programming languages to workflow designers.

Features:

* no dependencies,
* full generic & configurable,
* light/dark themes,
* modern browsers support,
* ~~mobile support~~ (TODO).

## 👀 Examples

* [❎ Fullscreen](https://b4rtaz.github.io/sequential-workflow-designer/examples/fullscreen.html)
* [🌅 Image Filter](https://b4rtaz.github.io/sequential-workflow-designer/examples/image-filter.html)
* [⛅ Light Dark](https://b4rtaz.github.io/sequential-workflow-designer/examples/fullscreen.html)
* [⏩ Live Testing](https://b4rtaz.github.io/sequential-workflow-designer/examples/live-testing.html)
* [🔴 Particles](https://b4rtaz.github.io/sequential-workflow-designer/examples/particles.html)

## 🚀 Installation

To use the designer you should add JS/TS files and CSS-files to your project.

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

To create the designer write the below code:

```ts
// ...
Designer.create(placeholder, definition, configuration);
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
sequentialWorkflowDesigner.create(placeholder, definition, configuration);
```

## 🎬 Usage

Check [examples](/examples) directory.

```ts
import Designer from 'sequential-workflow-designer';

const placeholder = document.getElementById('placeholder');

const definition = {
  properties: {
    // global properties
  },
  sequence: [
    // root steps
  ]
};

const configuration = {
  theme: 'light',
  isReadonly: false,

  toolbox: {
    isHidden: false,
    groups: [
      {
        name: 'Files',
        steps: [
          // steps for the toolbox's group
        ]
      },
      {
        name: 'Notification',
        steps: [
          // steps for the toolbox's group
        ]
      }
    ]
  },

  steps: {
    iconUrlProvider: (componentType, type) => {
      return `icon-${componentType}-${type}.svg`;
    },
    validator: (step) => {
      return step.name.toLowerCase() === step.name;
    }
  },

  editors: {
    isHidden: false,
    globalEditorProvider: (definition) => {
      const container = document.createElement('div');
      // ...
      return container;
    },
    stepEditorProvider: (step) => {
      const container = document.createElement('div');
      // ...
      return container;
    }
  }
};

Designer.create(placeholder, definition, configuration);
```

## 💡 License

This project is released under the MIT license.
