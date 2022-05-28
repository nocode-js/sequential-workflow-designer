import { BehaviorController } from './behaviors/behavior-controller';
import { SimpleEvent } from './core/simple-event';
import { Definition, Step } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { Placeholder, StepComponent } from './workspace/component';

export class DesignerContext {

	public readonly onSelectedStepChanged = new SimpleEvent<Step | null>();
	public readonly onIsReadonlyChanged = new SimpleEvent<boolean>();
	public readonly onIsDraggingChanged = new SimpleEvent<boolean>();
	public readonly onIsMoveModeEnabledChanged = new SimpleEvent<boolean>();
	public readonly onViewPortChanged = new SimpleEvent<void>();
	public readonly onCenterViewPortRequested = new SimpleEvent<void>();
	public readonly onDefinitionChanged = new SimpleEvent<void>();

	public selectedStep: Step | null = null;
	public isReadonly: boolean;
	public isDragging = false;
	public isMoveModeEnabled = false;

	private provider?: DesignerComponentProvider;

	public constructor(
		public readonly definition: Definition,
		public readonly behaviorController: BehaviorController,
		public readonly configuration: DesignerConfiguration) {
		this.isReadonly = !!configuration.isReadonly;
	}

	public setSelectedStep(step: Step | null) {
		const isChanged = (this.selectedStep !== step);
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

	public getSelectedStepComponent(): StepComponent {
		return this.getProvider().getSelectedStepComponent();
	}

	public setIsReadonly(isReadonly: boolean) {
		this.isReadonly = isReadonly;
		this.onIsReadonlyChanged.forward(isReadonly);
	}

	public setIsDragging(isDragging: boolean) {
		this.isDragging = isDragging;
		this.onIsDraggingChanged.forward(isDragging);
	}

	public toggleIsDraggingDisabled() {
		this.isMoveModeEnabled = !this.isMoveModeEnabled;
		this.onIsMoveModeEnabledChanged.forward(this.isMoveModeEnabled);
	}

	public notifiyViewPortChanged() {
		this.onViewPortChanged.forward();
	}

	public centerViewPort() {
		this.onCenterViewPortRequested.forward();
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

export interface DesignerComponentProvider {
	getPlaceholders(): Placeholder[];
	getSelectedStepComponent(): StepComponent;
	findStepComponentById(stepId: string): StepComponent | null;
}
