import { BehaviorController } from './behaviors/behavior-controller';
import { ObjectCloner } from './core/object-cloner';
import { SimpleEvent } from './core/simple-event';
import { Definition } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { DesignerView } from './designer-view';
import { LayoutController } from './layout-controller';

export default class Designer {
	public static create(parent: HTMLElement, startDefinition: Definition, configuration: DesignerConfiguration): Designer {
		const definition = ObjectCloner.deepClone(startDefinition);

		const behaviorController = new BehaviorController();
		const layoutController = new LayoutController(parent);
		const isMobile = layoutController.isMobile();
		const context = new DesignerContext(definition, behaviorController, layoutController, configuration, isMobile, isMobile);

		const view = DesignerView.create(parent, context, configuration);
		const designer = new Designer(view, context);
		view.bindKeyUp(e => designer.onKeyUp(e));
		context.onDefinitionChanged.subscribe(d => designer.onDefinitionChanged.forward(d));
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

	private onKeyUp(e: KeyboardEvent) {
		const supportedKeys = ['Backspace', 'Delete'];
		if (!supportedKeys.includes(e.key)) {
			return;
		}
		const ignoreTagNames = ['input', 'textarea'];
		if (document.activeElement && ignoreTagNames.includes(document.activeElement.tagName.toLowerCase())) {
			return;
		}
		if (!this.context.selectedStep || this.context.isReadonly || this.context.isDragging) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
		this.context.deleteStepById(this.context.selectedStep.id);
	}
}
