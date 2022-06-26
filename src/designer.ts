import { BehaviorController } from './behaviors/behavior-controller';
import { ObjectCloner } from './core/object-cloner';
import { SimpleEvent } from './core/simple-event';
import { Definition } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { DesignerView } from './designer-view';

export default class Designer {
	public static create(parent: HTMLElement, startDefinition: Definition, configuration: DesignerConfiguration): Designer {
		const definition = ObjectCloner.deepClone(startDefinition);

		const behaviorController = new BehaviorController();
		const context = new DesignerContext(definition, behaviorController, configuration);

		const view = DesignerView.create(parent, context, configuration);
		const designer = new Designer(view, context);
		context.onDefinitionChanged.subscribe(() => designer.onDefinitionChanged.forward(context.definition));
		return designer;
	}

	private constructor(private readonly view: DesignerView, private readonly context: DesignerContext) {}

	public readonly onDefinitionChanged = new SimpleEvent<Definition>();

	public getDefinition(): Definition {
		return this.context.definition;
	}

	public revalidate() {
		this.view.workspace.revalidate();
	}

	public isValid(): boolean {
		return this.view.workspace.isValid;
	}

	public isReadonly(): boolean {
		return this.context.isReadonly;
	}

	public notifiyDefinitionChanged() {
		this.context.notifiyDefinitionChanged();
	}

	public setIsReadonly(isReadonly: boolean) {
		this.context.setIsReadonly(isReadonly);
	}

	public getSelectedStepId(): string | null {
		return this.context.selectedStep?.id || null;
	}

	public selectStepById(stepId: string) {
		this.context.selectStepById(stepId);
	}

	public clearSelectedStep() {
		this.context.setSelectedStep(null);
	}

	public moveViewPortToStep(stepId: string) {
		this.context.moveViewPortToStep(stepId);
	}

	public destroy() {
		this.view.destroy();
	}
}
