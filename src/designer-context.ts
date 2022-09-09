import { BehaviorController } from './behaviors/behavior-controller';
import { animate, Animation } from './core/animation';
import { SequenceModifier } from './core/sequence-modifier';
import { SimpleEvent } from './core/simple-event';
import { Vector } from './core/vector';
import { Definition, Sequence, Step } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { LayoutController } from './layout-controller';
import { Placeholder, StepComponent } from './workspace/component';

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;

export interface DefinitionChangedEvent {
	rerender: boolean;
}

export class DesignerContext {
	public readonly onViewPortChanged = new SimpleEvent<ViewPort>();
	public readonly onSelectedStepChanged = new SimpleEvent<Step | null>();
	public readonly onIsReadonlyChanged = new SimpleEvent<boolean>();
	public readonly onIsDraggingChanged = new SimpleEvent<boolean>();
	public readonly onIsMoveModeEnabledChanged = new SimpleEvent<boolean>();
	public readonly onIsToolboxCollapsedChanged = new SimpleEvent<boolean>();
	public readonly onIsSmartEditorCollapsedChanged = new SimpleEvent<boolean>();
	public readonly onDefinitionChanged = new SimpleEvent<DefinitionChangedEvent>();

	public viewPort: ViewPort = {
		position: new Vector(0, 0),
		scale: 1
	};
	public selectedStep: Step | null = null;
	public isReadonly: boolean;
	public isDragging = false;
	public isMoveModeEnabled = false;

	private viewPortAnimation?: Animation;
	private provider?: DesignerComponentProvider;

	public constructor(
		public readonly definition: Definition,
		public readonly behaviorController: BehaviorController,
		public readonly layoutController: LayoutController,
		public readonly configuration: DesignerConfiguration,
		public isToolboxCollapsed: boolean,
		public isSmartEditorCollapsed: boolean
	) {
		this.isReadonly = !!configuration.isReadonly;
	}

	public setViewPort(position: Vector, scale: number) {
		this.viewPort = { position, scale };
		this.onViewPortChanged.forward(this.viewPort);
	}

	public resetViewPort() {
		this.getProvider().resetViewPort();
	}

	public animateViewPort(position: Vector, scale: number) {
		if (this.viewPortAnimation && this.viewPortAnimation.isAlive) {
			this.viewPortAnimation.stop();
		}

		const startPosition = this.viewPort.position;
		const startScale = this.viewPort.scale;
		const deltaPosition = startPosition.subtract(position);
		const deltaScale = startScale - scale;

		this.viewPortAnimation = animate(150, progress => {
			const newScale = startScale - deltaScale * progress;
			this.setViewPort(startPosition.subtract(deltaPosition.multiplyByScalar(progress)), newScale);
		});
	}

	public moveViewPortToStep(stepId: string) {
		const component = this.getProvider().getComponentByStepId(stepId);
		this.getProvider().moveViewPortToStep(component);
	}

	public limitScale(scale: number): number {
		return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
	}

	public zoom(direction: boolean) {
		this.getProvider().zoom(direction);
	}

	public setSelectedStep(step: Step | null) {
		if (this.selectedStep !== step) {
			this.selectedStep = step;
			this.onSelectedStepChanged.forward(step);
		}
	}

	public selectStepById(stepId: string) {
		const component = this.getProvider().getComponentByStepId(stepId);
		this.setSelectedStep(component.step);
	}

	public tryInsertStep(step: Step, targetSequence: Sequence, targetIndex: number): boolean {
		const canInsertStep = this.configuration.steps.canInsertStep
			? this.configuration.steps.canInsertStep(step, targetSequence, targetIndex)
			: true;
		if (!canInsertStep) {
			return false;
		}

		SequenceModifier.insertStep(step, targetSequence, targetIndex);
		this.notifiyDefinitionChanged(true);
		this.setSelectedStep(step);
		return true;
	}

	public tryMoveStep(sourceSequence: Sequence, step: Step, targetSequence: Sequence, targetIndex: number): boolean {
		const canMoveStep = this.configuration.steps.canMoveStep
			? this.configuration.steps.canMoveStep(sourceSequence, step, targetSequence, targetIndex)
			: true;
		if (!canMoveStep) {
			return false;
		}

		SequenceModifier.moveStep(sourceSequence, step, targetSequence, targetIndex);
		this.notifiyDefinitionChanged(true);
		this.setSelectedStep(step);
		return true;
	}

	public tryDeleteStep(step: Step): boolean {
		const component = this.getProvider().getComponentByStepId(step.id);
		const canDeleteStep = this.configuration.steps.canDeleteStep
			? this.configuration.steps.canDeleteStep(component.step, component.parentSequence)
			: true;
		if (!canDeleteStep) {
			return false;
		}

		SequenceModifier.deleteStep(component.step, component.parentSequence);
		this.notifiyDefinitionChanged(true);
		if (this.selectedStep?.id === step.id) {
			this.setSelectedStep(null);
		}
		return true;
	}

	public setIsReadonly(isReadonly: boolean) {
		this.isReadonly = isReadonly;
		this.onIsReadonlyChanged.forward(isReadonly);
	}

	public setIsDragging(isDragging: boolean) {
		this.isDragging = isDragging;
		this.onIsDraggingChanged.forward(isDragging);
	}

	public toggleIsMoveModeEnabled() {
		this.isMoveModeEnabled = !this.isMoveModeEnabled;
		this.onIsMoveModeEnabledChanged.forward(this.isMoveModeEnabled);
	}

	public toggleIsToolboxCollapsed() {
		this.isToolboxCollapsed = !this.isToolboxCollapsed;
		this.onIsToolboxCollapsedChanged.forward(this.isToolboxCollapsed);
	}

	public toggleIsSmartEditorCollapsed() {
		this.isSmartEditorCollapsed = !this.isSmartEditorCollapsed;
		this.onIsSmartEditorCollapsedChanged.forward(this.isSmartEditorCollapsed);
	}

	public notifiyDefinitionChanged(rerender: boolean) {
		this.onDefinitionChanged.forward({ rerender });
	}

	public getPlaceholders(): Placeholder[] {
		return this.getProvider().getPlaceholders();
	}

	public setProvider(provider: DesignerComponentProvider) {
		this.provider = provider;
	}

	private getProvider(): DesignerComponentProvider {
		if (!this.provider) {
			throw new Error('Provider is not set');
		}
		return this.provider;
	}
}

export interface ViewPort {
	position: Vector;
	scale: number;
}

export interface DesignerComponentProvider {
	getPlaceholders(): Placeholder[];
	getComponentByStepId(stepId: string): StepComponent;
	resetViewPort(): void;
	zoom(direction: boolean): void;
	moveViewPortToStep(stepComponent: StepComponent): void;
}
