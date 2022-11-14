![Sequential Workflow Designer](.github/cover.png)

# Sequential Workflow Designer

[![Build Status](https://app.travis-ci.com/b4rtaz/sequential-workflow-designer.svg?branch=main)](https://app.travis-ci.com/b4rtaz/sequential-workflow-designer) [![License: MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](/LICENSE) [![View this project on NPM](https://img.shields.io/npm/v/sequential-workflow-designer.svg)](https://npmjs.org/package/sequential-workflow-designer) [![Twitter: b4rtaz](https://img.shields.io/twitter/follow/b4rtaz.svg?style=social)](https://twitter.com/b4rtaz)

Sequential workflow designer with no dependencies for web. It's written in pure TypeScript and uses SVG for rendering. This designer is not associated with any workflow engine. It's full generic. You may create any kind application by this, from graphical programming languages to workflow designers.

Features:

* no dependencies,
* full generic & configurable,
* light/dark themes,
* works on modern browsers,
* works on mobile.

## 👀 Examples

* [📐 Simple Flow](https://b4rtaz.github.io/sequential-workflow-designer/examples/simple-flow.html)
* [❎ Fullscreen](https://b4rtaz.github.io/sequential-workflow-designer/examples/fullscreen.html)
* [🌅 Image Filter](https://b4rtaz.github.io/sequential-workflow-designer/examples/image-filter.html)
* [⛅ Light Dark](https://b4rtaz.github.io/sequential-workflow-designer/examples/light-dark.html)
* [⏩ Live Testing](https://b4rtaz.github.io/sequential-workflow-designer/examples/live-testing.html)
* [🔴 Particles](https://b4rtaz.github.io/sequential-workflow-designer/examples/particles.html)
* [🤖 Code Generator](https://b4rtaz.github.io/sequential-workflow-designer/examples/code-generator.html)

## 🚀 Installation

To use the designer you should add JS/TS files and CSS files to your project.

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
<link href="https://cdn.jsdelivr.net/npm/sequential-workflow-designer@0.2.2/css/designer.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/sequential-workflow-designer@0.2.2/css/designer-light.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/sequential-workflow-designer@0.2.2/css/designer-dark.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/sequential-workflow-designer@0.2.2/lib/designer.js"></script>
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

const designer = Designer.create(placeholder, definition, configuration);
designer.onDefinitionChanged.subscribe((newDefinition) => {
  // ...
});
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
