![Sequential Workflow Designer for React](https://raw.githubusercontent.com/nocode-js/sequential-workflow-designer/main/.github/cover.png)

# Sequential Workflow Designer for React

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fb4rtaz%2Fsequential-workflow-designer%2Fbadge%3Fref%3Dmain&style=flat-square)](https://actions-badge.atrox.dev/b4rtaz/sequential-workflow-designer/goto?ref=main) [![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](/LICENSE) [![View this project on NPM](https://img.shields.io/npm/v/sequential-workflow-designer-react.svg?style=flat-square)](https://npmjs.org/package/sequential-workflow-designer-react)

React wrapper for the [Sequential Workflow Designer](https://github.com/nocode-js/sequential-workflow-designer) component.

## 🚀 Installation

Install the following packages by [NPM](https://www.npmjs.com/) command:

`npm i sequential-workflow-designer sequential-workflow-designer-react`

Add CSS files to your app:

```tsx
import 'sequential-workflow-designer/css/designer.css';
import 'sequential-workflow-designer/css/designer-light.css';
import 'sequential-workflow-designer/css/designer-dark.css';
```

## 🎬 Usage

Import types:

```tsx
import {
  Definition,
  ToolboxConfiguration,
  StepsConfiguration,
  ValidatorConfiguration
} from 'sequential-workflow-designer';
import {
  SequentialWorkflowDesigner,
  wrapDefinition,
  useRootEditor,
  useStepEditor
} from 'sequential-workflow-designer-react';
```

Create or load your definition of a workflow.

```ts
const startDefinition: Definition = { /* ... */ };
```

Wrap the start definition and memorize it.

```tsx
const [definition, setDefinition] = useState(() => wrapDefinition(startDefinition));
```

Configure the designer.

```ts
const toolboxConfiguration: ToolboxConfiguration = useMemo(() => ({ /* ... */ }), []);
const stepsConfiguration: StepsConfiguration = useMemo(() => ({ /* ... */ }), []);
const validatorConfiguration: ValidatorConfiguration = useMemo(() => ({ /* ... */ }), []);
```

Create the root editor component:

```tsx
function RootEditor() {
  const { properties, setProperty, definition, isReadonly } = useRootEditor();

  function onSpeedChanged(e) {
    setProperty('speed', e.target.value);
  }

  return (
    <>
      <h3>Speed</h3>
      <input value={properties['speed'] || ''} onChange={onSpeedChanged} />
    </>
  );
}
```

Create the step editor component:

```tsx
function StepEditor() {
  const { type, componentType, name, setName, properties, setProperty, definition, isReadonly } = useStepEditor();

  function onNameChanged(e) {
    setName(e.target.value);
  }

  return (
    <>
      <h3>Name</h3>
      <input value={name} onChange={onNameChanged} />
    </>
  );
}
```

At the end attach the designer.

```tsx
<SequentialWorkflowDesigner
  definition={definition}
  onDefinitionChange={setDefinition}
  stepsConfiguration={stepsConfiguration}
  validatorConfiguration={validatorConfiguration}
  toolboxConfiguration={toolboxConfiguration}
  controlBar={true}
  contextMenu={true}
  rootEditor={<RootEditor />}
  stepEditor={<StepEditor />}>
  />
```

You can hide any UI component.

```tsx
<SequentialWorkflowDesigner
  // ...
  toolboxConfiguration={false}
  controlBar={false}
  contextMenu={false}
  rootEditor={false}
  stepEditor={false}>
  />
```

Check the [demo project](https://github.com/nocode-js/sequential-workflow-designer/tree/main/demos/react-app).

## 💡 License

This project is released under the MIT license.
