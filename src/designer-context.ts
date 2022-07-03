import { BehaviorController } from './behaviors/behavior-controller';
import { animate, Animation } from './core/animation';
import { SimpleEvent } from './core/simple-event';
import { Vector } from './core/vector';
import { Definition, Sequence, Step } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { LayoutController } from './layout-controller';
import { Placeholder, StepComponent } from './workspace/component';

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;

export class DesignerContext {
	public readonly onViewPortChanged = new SimpleEvent<ViewPort>();
	public readonly onSelectedStepChanged = new SimpleEvent<Step | null>();
	public readonly onIsReadonlyChanged = new SimpleEvent<boolean>();
	public readonly onIsDraggingChanged = new SimpleEvent<boolean>();
	public readonly onIsMoveModeEnabledChanged = new SimpleEvent<boolean>();
	public readonly onIsToolboxCollapsedChanged = new SimpleEvent<boolean>();
	public readonly onIsSmartEditorCollapsedChanged = new SimpleEvent<boolean>();
	public readonly onDefinitionChanged = new SimpleEvent<void>();

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
		const sc = this.getProvider().findStepComponentById(stepId);
		if (sc) {
			this.getProvider().moveViewPortToStep(sc);
		}
	}

	public limitScale(scale: number): number {
		return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
	}

	public zoom(direction: boolean) {
		this.getProvider().zoom(direction);
	}

	public setSelectedStep(step: Step | null) {
		const isChanged = this.selectedStep !== step;
		this.selectedStep = step;
		if (isChanged) {
			this.onSelectedStepChanged.forward(step);
		}
	}

	public selectStepById(stepId: string) {
		const sc = this.getProvider().findStepComponentById(stepId);
		if (sc) {
			this.setSelectedStep(sc.step);
		}
	}

	public getSelectedStepParentSequence(): Sequence {
		if (!this.selectedStep) {
			throw new Error('No selected step');
		}
		const component = this.getProvider().findStepComponentById(this.selectedStep.id);
		if (!component) {
			throw new Error('Cannot find component');
		}
		return component.parentSequence;
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

	public notifiyDefinitionChanged() {
		this.onDefinitionChanged.forward();
	}

	public getPlacehodlers(): Placeholder[] {
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
	findStepComponentById(stepId: string): StepComponent | null;
	resetViewPort(): void;
	zoom(direction: boolean): void;
	moveViewPortToStep(stepComponent: StepComponent): void;
}
