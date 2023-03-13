## 0.9.0

#### Breaking Changes

This version changes the main configuration. The "isHidden" properties are depreciated now and will be removed. Also we added a possibility to hide the control bar. To hide the control bar or other UI component you need to set `false` in the corresponding configuration property.

```js
const configuration = {
  toolbox: false,
  editors: false,
  controlBar: false,
  // ...
};
```

To display components you need to set a proper value.

```js
const configuration = {
  toolbox: {
    groups: [ /* ... */ ]
  },
  editors: {
    globalEditorProvider: () => { /* ... */ },
    stepEditorProvider: () => { /* ... */ },
  },
  controlBar: true,
  // ...
};
```

## React & Angular

The `controlBar` property is required from now. This change applies for the `sequential-workflow-designer-angular` and `sequential-workflow-designer-react` packages as well.

## 0.8.1

Changed format of bundles:

* `sequential-workflow-designer` to UMD, ESM and CommonJS,
* `sequential-workflow-designer-react` to ESM and CommonJS.

## 0.8.0

* This release introduces a better support for TypeScript.
* The model of the workflow definition is moved from the `sequential-workflow-designer` package to the `sequential-workflow-model` package. By this it's possible to create a common package with your workflow model and use it for the front-end and back-end applications at the same time. The `sequential-workflow-designer` package exports definition types as before, but these types come from the `sequential-workflow-model` package. You don't have to include the `sequential-workflow-model` package to your project if you don't need it. You can read more about this approach [here](https://nocode-js.com/docs/sequential-workflow-designer/sharing-types-between-frontend-and-backend).

#### Breaking Changes

`TaskStep`, `SwitchStep`, `ContainerStep` interfaces are depreciated now. Those types will be removed in the future.

🤩 We launched a new project: [Sequential Workflow Machine](https://github.com/nocode-js/sequential-workflow-machine). It's a JavaScript workflow engine for the frontend and the backend. The engine uses exactly the same data model as the Sequential Workflow Designer. It means you can use the same workflow definition for the designer and the engine. The new package is powered by the `xstate` library.

## 0.7.0

* The step validator has two parameters from now: `step` and `parentSequence`.
* Added new editing restrictions: `isDraggable` and `isDeletable`.

#### Breaking Changes

* Refactored step components by introducing the `StepContext` interface.
* Renamed `.sqd-step-start-stop*` CSS selectors to `.sqd-root-start-stop*`.

## 0.6.0

Fixed support for touchpad.

#### Breaking Changes

* Redesigned the `DesignerExtension` interface. This change increases the extensibility of the designer.

## 0.5.4

This version introduces the first release of the [Sequential Workflow Designer for Angular](./angular/designer/) package.

## 0.5.3

* The disabled drag mode doesn't block the step selecting anymore.
* Replaced custom shapes by icons from the `Icons` class for `StartStopComponentView`.

## 0.5.2

This version introduces the first release of the [Sequential Workflow Designer for React](./react/) package.

## 0.5.1

* Fixed calculation of label width in the switch step.
* Added an exclamation mark to the warning icon.

## 0.5.0

* Fixed losing the disabled state during dragging.
* Fixed steps rendering with long labels.
* Added to the global editor and the step editor the common class: `sqd-editor`.

#### Breaking Changes

* Changed a behavior of the default zoom. From now the designer shows a whole flow at the start.
* Zoom is aligned to the predefined constants.

## 0.4.0

This version brings rendering speed improvements. Check the `stress-test.html` example. This version contains many internal changes to support the `folder` component in the pro version.

#### Breaking Changes

* Replaced all icons to material icons.
* Normalized step CSS classes. All components have the `sqd-step-<componentType>-` prefix from now.

## 0.3.0

This version introduces new build formats (ESM, UMD) of the package.

🤩 For more advanced use cases we prepared **the paid pro package**. The package is in the early stage. Currently it contains advanced components for steps. [Here](https://github.com/nocode-js/sequential-workflow-designer-pro-demo) you can find more information and examples.

#### Breaking Changes

* Default export of the `Designer` class is removed. Now you should import directly the `Designer` class.
  ```ts
  import { Designer } from 'sequential-workflow-designer';
  Designer.create(/* ... */);
  ```

  This affects CDN usage too.

  ```html
  <script src="https://cdn.jsdelivr.net/..."></script>
  <script>
  sequentialWorkflowDesigner.Designer.create(/* ... */);
  </script>
  ```
* The package now contains two type of build: ESM and UMD. ESM build is located in the `lib` folder. UMD build is located in the `dist` folder. That means the URL to the CDN is also changed.
  
  ```html
  <script src="https://cdn.jsdelivr.net/.../dist/index.umd.js"></script>
  ```
* Static method `Designer.utils.nextId()` is deleted. You should use the `next()` from the `Uid` class. Example: 

  ```ts
  import { Uid } from 'sequential-workflow-designer';
  Uid.next();
  ```

* Static method `Designer.utils.getParents()` is deleted. You should use the `getStepParents()` method from the `Designer` class. Example: 

  ```ts
  designer.getStepParents(needleStep);
  ```
* The `ComponentType` is not an enum anymore. It's a type (`string`). This change doesn't affect serialized JSONs.

## 0.2.3

Improved rendering of the switch step for 3 and more branches.

## 0.2.2

Added the `notifyChildrenChanged()` method to the `StepEditorContext` interface.

## 0.2.1

Support undo and redo. This feature is disabled by default. To enable it add the below config.

```js
const config = {
  undoStackSize: 10,
  // ...
};
```

## 0.2.0

#### Editor's Context

We've changed an approach how the editors should notify the designer about changes in the definition. We've deleted `revalidate()` and `notifyDefinitionChanged()` methods from the `Designer` class. Instead of this, now editors receive an editor's context.

```ts
interface StepEditorContext {
  notifyNameChanged(): void;
  notifyPropertiesChanged(): void;
}

interface GlobalEditorContext {
  notifyPropertiesChanged(): void;
}

const config = {
  // ...
  editors: {
    stepEditorProvider: (step: Step, context: StepEditorContext) => {
      // ...
      context.notifyPropertiesChanged();
      // ...
    },
    globalEditorProvider: (definition: Definition, context: GlobalEditorContext) => {
      // ...
      context.notifyPropertiesChanged();
      // ...
    }
  }
};
```

#### Type Requirements

The `type` of a step cannot contain special characters from now. Check [the type validator](src/core/type-validator.ts).

* ✅ `someType`
* ✅ `some-type`
* ✅ `some_type`
* ❌ `some type`
* ❌ `someType!`

By this, we could add the `type` to an element's class on the SVG canvas. That allows to customize components by CSS. Check [this example](examples/code-generator.html).

#### Restrictions

We added `canInsertStep`, `canMoveStep` and `canDeleteStep` callbacks to the `StepsConfiguration`. You may restrict some activity in the designer by this.

```js
const config = {
  // ...
  steps: {
    canInsertStep: (step, targetSequence, targetIndex) => {
      return targetSequence.length < 5;
    },
    canMoveStep: (sourceSequence, step, targetSequence, targetIndex) => {
      return !step.properties['isLocked'];
    },
    canDeleteStep: (step, parentSequence) => {
      return step.name !== 'x';
    }
    // ...
  }
};
```

## 0.1.x

The designer released.
