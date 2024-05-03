## 0.20.0

This version introduces the localization feature. Now you can localize the designer to any language you want.

```js
const configuration = {
  i18n: (key, defaultValue) => {
    if (currentLang === 'pl') {
      if (key === 'controlBar.undo') {
        return 'Cofnij';
      }
    }
    return defaultValue;
  }
  // ...
};
```

## 0.19.4

This version adds the data-step-id attribute to the root `<g>` elements of step components on the canvas. This attribute contains the ID of the step, enabling the use of CSS selectors to style step components [#135](https://github.com/nocode-js/sequential-workflow-designer/issues/135).

## 0.19.3

This version improves the experience of scrolling in the toolbox via the touchpad.

## 0.19.2

This version adds the `alt` key support. Now when you hold the `alt` key and click on the canvas, the drag and drop is disabled [#126](https://github.com/nocode-js/sequential-workflow-designer/issues/126).

## 0.19.1

Fixed the bug with refreshing the state modifier dependencies.

## 0.19.0

* Added the `isSelectable` callback to the `StepsConfiguration` interface. Now it's possible to disable the selection of steps.
* Deleted deprecated methods and interfaces.

## 0.18.5

This version fixes a bug with unintended selection of HTML elements in Apple Vision Pro.

## 0.18.4

This version removes the features introduced in the previous release. We noticed that the proposed solution did not update the undo stack. As a result, we removed that feature in this version. Instead, we added a new method to the Designer class called `replaceDefinition`, which allows for the replacement of the entire definition and updates the undo stack.

```ts
function appendStep() {
  const newStep: Step = { /* ... */ };

  const newDefinition = ObjectCloner.deepClone(designer.getDefinition());
  newDefinition.sequence.push(newStep);
  await designer.replaceDefinition(newDefinition);
}
```

## 0.18.3

Edited: changes are reverted in the 0.18.4 version.

## 0.18.2

This version corrects a bug in the `moveViewportToStep` method that caused the viewport to move to the incorrect position.

## 0.18.1

This version exposes the definition walker from the `Designer` class [#109](https://github.com/nocode-js/sequential-workflow-designer/issues/109).

```js
const walker = designer.getWalker();
```

## 0.18.0

This version fixes the problem with scrolling [#105](https://github.com/nocode-js/sequential-workflow-designer/issues/105).

## 0.17.0

This version introduces a new argument for editor providers: `isReadonly`. Now when the designer is in the read-only mode, the editor providers can render the read-only version of the editor.

### Breaking Changes

This version finally renames the "global editor" into the "root editor". This change is made in the designer package and all wrappers, except the Svelte package. The Svelte package uses a new name from the beginning.

```js
const configuration = {
  editors: {
    // globalEditorProvider: () => {}, is not supported anymore, use `rootEditorProvider` instead.
    rootEditorProvider: (definition, rootContext, isReadonly) => { /* ... */ },
    // ...
  }
};
```

This version also renames the `sqd-global-editor` class of the root editor into the `sqd-root-editor` class.

### React

```tsx
// globalEditor={} is not supported anymore, use `rootEditor={}` instead.
<SequentialWorkflowDesigner
  rootEditor={<RootEditor />} ... />
```

### Angular

```html
<!-- [globalEditor]="" is not supported anymore, use [rootEditor]="" instead. -->
<sqd-designer ...
  [rootEditor]="rootEditor"></sqd-designer>
```

## 0.16.10

This version fixes the error: `Failed to execute 'removeChild' on 'Node'` when a user uses the undo feature [#100](https://github.com/nocode-js/sequential-workflow-designer/issues/100).

Additionally, this version introduces `getViewport`, `setViewport` methods and `onViewportChanged` event in the `Designer` class.

## 0.16.9

This version adds a possibility to disable keyboard shortcuts. Additionally you may filter keyboard events handled by the designer.

```js
// Disabled shortcuts
const configuration = {
  keyboard: false,
  // ...
};
```

## 0.16.8

Svelte package supports now native editors. If you want to use JavaScript/TypeScript code to create editors, you can do it now. Of course, you can still use Svelte components as editors.

```svelte
<SequentialWorkflowDesigner ...
  stepEditor={StepEditor}
  rootEditor={RootEditor} />

<SequentialWorkflowDesigner ...
  nativeStepEditor={nativeStepEditor}
  nativeRootEditor={nativeRootEditor} />
```

## 0.16.7

Added two events to the Svelte package: `on:isToolboxCollapsedChanged` and `on:isEditorCollapsedChanged`.

## 0.16.6

This version introduces a wrapper for Svelte framework! 🎉

## 0.16.5

This version fixes the bug with scrolling in the toolbox [#92](https://github.com/nocode-js/sequential-workflow-designer/issues/92).

## 0.16.4

This version introduces the `isAutoSelectDisabled` option. Now it's possible to disable the auto-select feature.

```js
const configuration = {
  steps: {
    isAutoSelectDisabled: true,
    // ...
  }
};
```

Additionally, this version introduces possibility to initialize the designer with the undo stack from the previous session.

```js
const configuration = {
  undoStackSize: 10,
  undoStack: myUndoStack,
  // ...
};
```

To read the current stack you should use the `dumpUndoStack()` method.

```js
const myUndoStack = designer.dumpUndoStack();
```

## 0.16.3

This version adds: `isReadonly`, `selectedStepId`, `uidGenerator`, `isToolboxCollapsed` and `isEditorCollapsed` properties and `onIsToolboxCollapsedChanged` and `onIsEditorCollapsedChanged` events to the Angular package.

## 0.16.2

This version adds the `onSelectedStepIdChanged` event to the Angular package.

```html
<sqd-designer ...
  (onSelectedStepIdChanged)="onSelectedStepIdChanged($event)">
</sqd-designer>
```

## 0.16.1

This version addresses the bug related to deselecting a step when a click is made using the middle mouse button.

## 0.16.0

This version fixes the bug with search in the toolbox. The search now includes custom labels provided by the `labelProvider` callback.

Additionally, this version adds the `descriptionProvider` to the configuration of the toolbox. The description is visible when you put a mouse cursor on a step in the toolbox for a while.

## 0.15.4

This version adds rounding configuration to the `designer-theme.scss` file.

## 0.15.3

This is a re-release of the 0.15.2 version.

## 0.15.2

This version introduces a new approach to customizing the designer. Prior to this version, customization was challenging and required numerous CSS overrides. Now, the designer provides SCSS files with mixins, simplifying the customization process.

We have prepared a [tutorial on creating a custom theme](https://nocode-js.com/docs/sequential-workflow-designer/features/custom-theme), which is exclusively available for pro version clients.

Please note that the `designer.css`, `designer-light.css`, and `designer-dark.css` files are still available as they were before. If you have been using these files without any overrides, you don't need to make any changes.

### Breaking Changes

* The `sqd-grid-path` class of the line grid is renamed to `sqd-line-grid-path`.
* Selectors in the `designer.css`, `designer-light.css` and `designer-dark.css` files have been changed.

## 0.14.2

This is a re-release of the 0.14.1 version.

## 0.14.1

This version includes the ability to hide the context menu for Angular and React packages.

```tsx
// React
<SequentialWorkflowDesigner contextMenu={false} ... />
```

```html
<!-- Angular -->
<sqd-designer [contextMenu]="false" ...></sqd-designer>
```

🌟 The pro version introduces the loading badge. Check the [badges example](https://nocode-js.github.io/sequential-workflow-designer-pro-demo/demos/webpack-pro-app/public/badges.html).

## 0.14.0

This version introduces the context menu, providing a new and interactive way to engage with the designer. If you want, you can disable this feature using the `contextMenu` property in the configuration.

```ts
const configuration = {
  contextMenu: false,
  // ...
};
```

Introducing a new feature: step duplication! Now, you have the ability to duplicate any step in your definition along with its children. This convenient option can be accessed from the context menu. Please note that the feature is disabled by default. To enable it, you must set your own callback for the isDuplicable property.

```ts
const configuration = {
  steps: {
    isDuplicable: (step, parentSequence) => {
      return true;
    },
  },
  // ...
};
```

## 0.13.7

This version fixes change detections in the Angular package. Thanks @wildercarrot!

## 0.13.6

Now it's possible to configure the size of grid cells. The default size is `48` as before.

🌟 In the pro version you can change the pattern of the grid from now. The pro version supports two new patterns: `dot` and `cross`.

## 0.13.5

We have added a third parameter, `definition`, to the step editor provider.

```js
function stepEditorProvider(step, stepContext, definition) { /* ... */ }
```

## 0.13.4

The `getStepParents` method of the `Designer` class supports now a step id as an argument. It is possible to get parents of a step by its id. The method still supports a step object or a sequence as an argument.

```js
designer.getStepParents('eb4f481ee1b90c6e3fc9b42dd010d2a5');
```

## 0.13.3

This version introduces 4 new features:

* The custom label provider for the toolbox. By default, the toolbox displays a label of a step from the `name` field. You may override this behaviour and pass own label provider now.

```js
const configuration = {
  toolbox: {
    labelProvider: (step) => `** ${step.name} **`,
    // ...
  },
  // ...
};
```

* Control the collapse of the toolbox.

```js
const configuration = {
  toolbox: {
    isCollapsed: true, // or false
    // ...
  },
  // ...
};

designer.isToolboxCollapsed(); // returns true or false
designer.setIsToolboxCollapsed(true);
```

* Control the collapse of the editor.

```js
const configuration = {
  editors: {
    isCollapsed: true, // or false
    // ...
  },
  // ...
};

designer.isEditorCollapsed(); // returns true or false
designer.setIsEditorCollapsed(true);
```

* It's possible now to replace the default unique identifier generator by a custom one.

```js
const configuration = {
  uidGenerator: () => Math.random().toString(),
  // ...
};
```

## 0.13.2

The react package supports two types of editor providers. Now it's possible to use a provider that returns native DOM elements. We don't want to depreciate the previous approach, this change increases flexibility of the react package.

```tsx
// 1. custom react component
<SequentialWorkflowDesigner stepEditor={<StepEditor />} ... />

// 2. native editor provider
function stepEditorProvider(step) {
  const editor = document.createElement('div'); /* ... */
  return editor;
}
<SequentialWorkflowDesigner stepEditor={stepEditorProvider}> ... />
```

## 0.13.1

The `canMoveStep` callback is not called when the step is moved to the same position.

🤩 We launched a new project: [Sequential Workflow Editor](https://github.com/nocode-js/sequential-workflow-editor). Don't write step editors manually, build them.

## 0.13.0

The `StepTraverser` is not a part of the designer package anymore. This class is moved into the model package and it's called `DefinitionWalker` now. The responsibility of determining children of a step is not part of the `StepExtension` interface anymore.

## 0.12.0

The designer has allowed only the validation of the steps so far. The root of the definition could be edited by the global editor, but the validation was not possible. This version adds a new type of the validator: the root validator. The new validator affects on the result of the definition validation (`designer.isValid()`).

### Breaking Changes

* The `validator` property in the `steps` group of the configuration is deleted. Use the `step` property in the `validator` group instead. 
* The step validator has a new parameter: `definition`.
* Added the root validator.

```js
const configuration = {
  steps: {
    validator: /* DEPRECIATED */,
  },
  validator: {
    step: (step, parentSequence, definition) => { /* ... */ },
    root: (definition) => { /* ... */ }
  },
  // ...
};
```

## 0.11.0

### Breaking Changes

* This version introduces a few changes in the `customActionHandler` handler:
  * the first parameter is an object now, previously it was a string. To read action type you need to read the `type` property from the object.
  * the `step` parameter is nullable now,
  * we added a `context` parameter that allows to notify about changes in the definition.
* Added new classes for label components: `sqd-label-primary` and `sqd-label-secondary`.

## 0.10.2

* Fixed the bug with moving the viewport by the scroll wheel button.
* Added a simple animation to placeholders during dragging.

## 0.10.1

* Fixed the bug with the auto-hide feature in the smart editor.
* Fixed the bug with rendering wide components in the sequence component.
* Fixed the bug with dragging when the designer is attached to a scrolled page.

## 0.10.0

Refactored the step component interface. Extracted the logic of the step validation to a separated layer called badges. This allowed to create a new type of badge: `counter`. The counter badge is available in the pro version.

Additionally, now it's possible manually refreshing the validation from outside of the designer. The validation is a special case of a badge. To refresh the validation you need to call the `updateBadges` method.

```ts
designer.updateBadges(); 
```

## 0.9.2

The `sequential-workflow-designer-angular` package supports Angular 12 - 15 now.

## 0.9.1

Fixed the bug with displaying nested placeholders in folders.

## 0.9.0

#### Breaking Changes

This version changes the main configuration. The "isHidden" properties are prohibited. Also we added a possibility to hide the control bar. To hide the control bar or other UI component you need to set `false` in the corresponding configuration property.

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
