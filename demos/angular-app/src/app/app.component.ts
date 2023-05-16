import { Component, OnInit } from '@angular/core';
import {
	Definition,
	Designer,
	GlobalEditorContext,
	Properties,
	Step,
	StepEditorContext,
	StepsConfiguration,
	ToolboxConfiguration,
	ValidatorConfiguration
} from 'sequential-workflow-designer';

function createDefinition() {
	return {
		properties: {
			velocity: 0
		},
		sequence: []
	};
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	private designer?: Designer;

	public definition: Definition = createDefinition();
	public definitionJSON?: string;
	public isValid?: boolean;

	public readonly toolboxConfiguration: ToolboxConfiguration = {
		groups: [
			{
				name: 'Step',
				steps: [
					{
						componentType: 'task',
						name: 'Step',
						properties: { velocity: 0 },
						type: 'task'
					}
				]
			}
		]
	};
	public readonly stepsConfiguration: StepsConfiguration = {
		iconUrlProvider: () => './assets/angular-icon.svg'
	};
	public readonly validatorConfiguration: ValidatorConfiguration = {
		step: (step: Step) => !!step.name && Number(step.properties['velocity']) >= 0,
		root: (definition: Definition) => Number(definition.properties['velocity']) >= 0
	};

	public ngOnInit() {
		this.updateDefinitionJSON();
	}

	public onDesignerReady(designer: Designer) {
		this.designer = designer;
		this.updateIsValid();
		console.log('designer ready', this.designer);
	}

	public onDefinitionChanged(definition: Definition) {
		this.definition = definition;
		this.updateIsValid();
		this.updateDefinitionJSON();
		console.log('definition changed');
	}

	public updateName(step: Step, event: Event, context: StepEditorContext) {
		step.name = (event.target as HTMLInputElement).value;
		context.notifyNameChanged();
	}

	public updateProperty(properties: Properties, name: string, event: Event, context: GlobalEditorContext | StepEditorContext) {
		properties[name] = (event.target as HTMLInputElement).value;
		context.notifyPropertiesChanged();
	}

	public reloadDefinitionClicked() {
		this.definition = createDefinition();
		this.updateDefinitionJSON();
	}

	private updateDefinitionJSON() {
		this.definitionJSON = JSON.stringify(this.definition, null, 2);
	}

	private updateIsValid() {
		this.isValid = this.designer?.isValid();
	}
}
