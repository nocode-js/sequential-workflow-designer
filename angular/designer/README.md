![Sequential Workflow Designer for Angular](https://raw.githubusercontent.com/nocode-js/sequential-workflow-designer/main/.github/cover.png)

# Sequential Workflow Designer for Angular

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fb4rtaz%2Fsequential-workflow-designer%2Fbadge%3Fref%3Dmain&style=flat-square)](https://actions-badge.atrox.dev/b4rtaz/sequential-workflow-designer/goto?ref=main) [![License: MIT](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](/LICENSE) [![View this project on NPM](https://img.shields.io/npm/v/sequential-workflow-designer-angular.svg?style=flat-square)](https://npmjs.org/package/sequential-workflow-designer-angular)

Angular wrapper for the [Sequential Workflow Designer](https://github.com/nocode-js/sequential-workflow-designer) component.

## 🚀 Installation

Install the following packages by [NPM](https://www.npmjs.com/) command:

`npm i sequential-workflow-designer sequential-workflow-designer-angular`

Add CSS files to your `angular.json` file.

```json
{
  "projects": {
    "YOUR_APP": {
      "architect": {
        "build": {
          "styles": [
            "./node_modules/sequential-workflow-designer/css/designer.css",
            "./node_modules/sequential-workflow-designer/css/designer-light.css",
            "./node_modules/sequential-workflow-designer/css/designer-dark.css"
          ]
        }
      }
    }
  }
}
```

## 🎬 Usage

Import the module:

```ts
import { SequentialWorkflowDesignerModule } from 'sequential-workflow-designer-angular';

@NgModule({
  imports: [
    SequentialWorkflowDesignerModule,
    // ...
  ],
  // ...
})
export class AppModule {}
```

Define a definition and a configuration.

```ts
export class AppComponent {
  private designer?: Designer;
  public definition: Definition = { /* ... */ };
  public toolboxConfiguration: ToolboxConfiguration = { /* ... */ };
  public stepsConfiguration: StepsConfiguration = { /* ... */ };
  // ...
}
```

Define the following methods to handle the designer's events.

```ts
export class AppComponent {
  //...
  public onDesignerReady(designer: Designer) {
    this.designer = designer;
  }

  public onDefinitionChanged(definition: Definition) {
    this.definition = definition;
  }
}
```

Additionally we need to define a few utils methods to handle the editor's logic.

```ts
export class AppComponent {
  // ...
  public updateName(step: Step, event: Event, context: StepEditorContext) {
    step.name = (event.target as HTMLInputElement).value;
    context.notifyNameChanged();
  }

  public updateProperty(properties: Properties, name: string, event: Event, context: GlobalEditorContext | StepEditorContext) {
    properties[name] = (event.target as HTMLInputElement).value;
    context.notifyPropertiesChanged();
  }
}
```

Create a template for the global editor. The value of the `editor` variable implements the `GlobalEditorWrapper` interface.

```html
<ng-template #globalEditor let-editor>
  <h2>Global Editor</h2>

  <h3>Velocity</h3>
  <input type="number"
    [value]="editor.definition.properties.velocity"
    (input)="updateProperty(editor.definition.properties, 'velocity', $event, editor.context)" />
</ng-template>
```

```ts
interface GlobalEditorWrapper {
  definition: Definition;
  context: GlobalEditorContext;
}
```

Create a template for the step editor. The value of the `editor` variable implements the `StepEditorWrapper` interface.

```html
<ng-template #stepEditor let-editor>
  <h2>Step Editor</h2>

  <h3>Name</h3>
  <input type="text"
    [value]="editor.step.name"
    (input)="updateName(editor.step, $event, editor.context)" />

  <h3>Velocity</h3>
  <input type="number"
    [value]="editor.step.properties.velocity"
    (input)="updateProperty(editor.step.properties, 'velocity', $event, editor.context)" />
</ng-template>
```

```ts
interface StepEditorWrapper {
  step: Step;
  context: StepEditorContext;
}
```

At the end attach the designer:

```html
<sqd-designer
  theme="light"
  [undoStackSize]="10"
  [definition]="startDefinition"
  [toolboxConfiguration]="toolboxConfiguration"
  [stepsConfiguration]="stepsConfiguration"
  [controlBar]="true"
  [areEditorsHidden]="false"
  [globalEditor]="globalEditor"
  [stepEditor]="stepEditor"
  (onReady)="onDesignerReady($event)"
  (onDefinitionChanged)="onDefinitionChanged($event)">
</sqd-designer>
```

Check the [demo project](https://github.com/nocode-js/sequential-workflow-designer/tree/main/demos/angular-app).

## 💡 License

This project is released under the MIT license.
