![Sequential Workflow Designer](.github/cover.png)

# Sequential Workflow Designer

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fb4rtaz%2Fsequential-workflow-designer%2Fbadge%3Fref%3Dmain&style=flat-square)](https://actions-badge.atrox.dev/b4rtaz/sequential-workflow-designer/goto?ref=main) [![License: MIT](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](/LICENSE) [![View this project on NPM](https://img.shields.io/npm/v/sequential-workflow-designer.svg?style=flat-square)](https://npmjs.org/package/sequential-workflow-designer)

Sequential workflow designer with no dependencies for web. It's written in pure TypeScript and uses SVG for rendering. This designer is not associated with any workflow engine. It's full generic. You may create any kind application by this, from graphical programming languages to workflow designers.

Features:

* no dependencies,
* full generic & configurable,
* light/dark themes,
* works on modern browsers,
* works on mobile,
* the definition is stored as JSON,
* has support for [React](./react/) and [Angular](./angular/designer/).

🤩 Don't miss [the pro version](https://github.com/nocode-js/sequential-workflow-designer-pro-demo).

## 👀 Examples

* [⏩ Live Testing](https://nocode-js.github.io/sequential-workflow-designer/examples/live-testing.html)
* [❎ Fullscreen](https://nocode-js.github.io/sequential-workflow-designer/examples/fullscreen.html)
* [🌅 Image Filter](https://nocode-js.github.io/sequential-workflow-designer/examples/image-filter.html)
* [🔴 Particles](https://nocode-js.github.io/sequential-workflow-designer/examples/particles.html)
* [⛅ Light Dark](https://nocode-js.github.io/sequential-workflow-designer/examples/light-dark.html)
* [🤖 Code Generator](https://nocode-js.github.io/sequential-workflow-designer/examples/code-generator.html)
* [📐 Simple Flow](https://nocode-js.github.io/sequential-workflow-designer/examples/simple-flow.html)
* [🌻 Rendering Test](https://nocode-js.github.io/sequential-workflow-designer/examples/rendering-test.html)
* [🚄 Stress Test](https://nocode-js.github.io/sequential-workflow-designer/examples/stress-test.html)

Pro:

* [🤩 Pro Components](https://nocode-js.github.io/sequential-workflow-designer-pro-demo/examples/webpack/public/pro-components.html)
* [👈 Goto](https://nocode-js.github.io/sequential-workflow-designer-pro-demo/examples/webpack/public/goto.html)
* [📁 Folders](https://nocode-js.github.io/sequential-workflow-designer-pro-demo/examples/webpack/public/folders.html)
* [⭕ Wheel Mode](https://nocode-js.github.io/sequential-workflow-designer-pro-demo/examples/webpack/public/wheel-mode.html)

## 🚀 Installation

To use the designer you should add JS/TS files and CSS files to your project.

### NPM

Install this package by [NPM](https://www.npmjs.com/) command:

`npm i sequential-workflow-designer`

To import the package:

```ts
import { Designer } from 'sequential-workflow-designer';
```

If you use [css-loader](https://webpack.js.org/loaders/css-loader/) or similar, you can add CSS files to your bundle:

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
<link href="https://cdn.jsdelivr.net/npm/sequential-workflow-designer@0.6.0/css/designer.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/sequential-workflow-designer@0.6.0/css/designer-light.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/sequential-workflow-designer@0.6.0/css/designer-dark.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/sequential-workflow-designer@0.6.0/dist/index.umd.js"></script>
```

Call the designer by:

```js
sequentialWorkflowDesigner.Designer.create(placeholder, definition, configuration);
```

## 🎬 Usage

Check [examples](/examples) directory.

```ts
import { Designer } from 'sequential-workflow-designer';

const placeholder = document.getElementById('placeholder');

const definition = {
  properties: {
    'myProperty': 'my-value',
    // global properties...
  },
  sequence: [
    // root steps...
  ]
};

const configuration = {
  theme: 'light', // optional, default: 'light'
  isReadonly: false, // optional, default: false
  undoStackSize: 10, // optional, default: 0 - disabled, 1+ - enabled

  toolbox: {
    isHidden: false, // optional, default: false

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
      return /^[a-z]+$/.test(step.name);
    },
    canInsertStep: (step, targetSequence, targetIndex) => {
      return targetSequence.length < 5;
    },
    canMoveStep: (sourceSequence, step, targetSequence, targetIndex) => {
      return !step.properties['isLocked'];
    },
    canDeleteStep: (step, parentSequence) => {
      return step.name !== 'x';
    }
  },

  editors: {
    isHidden: false, // optional, default: false

    globalEditorProvider: (definition, globalContext) => {
      const editor = document.createElement('div');
      // ...
      return editor;
    },
    stepEditorProvider: (step, stepContext) => {
      const editor = document.createElement('div');
      // ...
      return editor;
    }
  }
};

const designer = Designer.create(placeholder, definition, configuration);
designer.onDefinitionChanged.subscribe((newDefinition) => {
  // ...
});
```

### 📝 Editors

The designer doesn't provide editors for steps. Why? Because this part usually is strongly dependent on a project type. So you must create editors by your own and set them in the start configuration.

The designer supports two types of editors.

* Global editor - it appears when no step is selected. This editor should configure a global settings of your definition. You should set your configuration to the `definition.properties` object.
* Step editor - it appears when some step is selected. This editor can change the step's name (`step.name`) and step's property values (`step.properties`). Also, it can change children, but you must be careful and don't mix responsibilities.

You need to notify the designer when your editor changes the definition. To do it you need to call one of the editor context methods.

```js
const editorsConfiguration = {
  globalEditorProvider: (definition, globalContext) => {
    // ...
    input.addEventListener('changed', () => {
      definition.properties['a'] = newA;
      globalContext.notifyPropertiesChanged();
    });
    // ...
  },

  stepEditorProvider: (step, stepContext) => {
    // ...
    input.addEventListener('changed', () => {
      step.name = newName;
      stepContext.notifyNameChanged();

      step.properties['x'] = newX;
      stepContext.notifyPropertiesChanged();

      step.branches['newBranch'] = [];
      stepContext.notifyChildrenChanged();
    });
    // ...
  }
}
```

## 🚧 Supported Components

### Task

Any atomic task.

```js
const taskStep = {
  componentType: 'task',
  id: 'my-unique-id',
  type: 'my-type', // e.g. 'save-file', 'send-email', ...
  name: 'my-name',
  properties: {
    'myProperty': 'my-value',
    // ...
  }
};
```

### Container

This component is mainly designed for `for/while/foreach` loops. It could be used as a context container too.

```ts
const containerStep = {
  componentType: 'container',
  id: 'my-unique-id',
  type: 'my-type', // e.g. 'for', 'while', 'foreach'...
  name: 'my-name',
  properties: {
    'myProperty': 'my-value',
    // ...
  },
  sequence: [
    // steps...
  ]
};
```

### Switch

This component is designed for `if/else` expressions, but you may use it for `switch/case` expressions too. This component must have minimum 2 branches.

```js
const switchStep = {
  componentType: 'switch',
  id: 'my-unique-id',
  type: 'my-type', // e.g. 'if', 'switch'...
  name: 'my-name',
  properties: {
    'myProperty': 'my-value',
    // ...
  },
  branches: {
    'true': [
      // steps...
    ],
    'false': [
      // steps...
    ],
    // ...
    'next': [
      // steps...
    ]
  }
};
```

## 💡 License

This project is released under the MIT license.
