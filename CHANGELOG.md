## 0.3.0

This version introduces new build formats (ESM, UMD) of the package.

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

We've changed an approach how the editors should notify the designer about changes in the definition. We've deleted `revalidate()` and `notifiyDefinitionChanged()` methods from the `Designer` class. Instead of this, now editors receive an editor's context.

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

#### Type Requirments

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
