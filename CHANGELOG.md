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
