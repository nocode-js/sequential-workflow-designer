import { BehaviorController } from './behaviors/behavior-controller';
import { SimpleEvent } from './core/simple-event';
import { Definition } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { Placeholder, StepComponent, StepComponentState } from './workspace/component';

export class DesignerContext {

	public readonly onSelectedStepComponentChanged = new SimpleEvent<StepComponent | null>();
	public readonly onIsMovingChanged = new SimpleEvent<boolean>();
	public readonly onIsMovingDisabledChanged = new SimpleEvent<boolean>();
	public readonly onViewPortChanged = new SimpleEvent<void>();
	public readonly onCenterViewPortRequested = new SimpleEvent<void>();
	public readonly onDefinitionChanged = new SimpleEvent<void>();

	public selectedStepComponent: StepComponent | null = null;
	public isMoving = false;
	public isMovingDisabled = false;

	private placeholdersProvider?: PlaceholdersProvider;

	public constructor(
		public readonly definition: Definition,
		public readonly behaviorController: BehaviorController,
		public readonly configuration: DesignerConfiguration) {
	}

	public setSelectedStepComponent(stepComponent: StepComponent | null) {
		if (this.selectedStepComponent) {
			this.selectedStepComponent.setState(StepComponentState.default);
		}
		const isChanged = (this.selectedStepComponent !== stepComponent);
		this.selectedStepComponent = stepComponent;
		if (stepComponent) {
			stepComponent.setState(StepComponentState.selected);
		}
		if (isChanged) {
			this.onSelectedStepComponentChanged.forward(stepComponent);
		}
	}

	public setIsMoving(isMoving: boolean) {
		this.isMoving = isMoving;
		this.onIsMovingChanged.forward(isMoving);
	}

	public toggleIsMovingDisabled() {
		this.isMovingDisabled = !this.isMovingDisabled;
		this.onIsMovingDisabledChanged.forward(this.isMovingDisabled);
	}

	public notifiyViewPortChanged() {
		this.onViewPortChanged.forward();
	}

	public centerViewPort() {
		this.onCenterViewPortRequested.forward();
	}

	public notifiyDefinitionChanged() {
		this.selectedStepComponent = null;
		this.onDefinitionChanged.forward();
	}

	public setPlaceholdersProvider(provider: PlaceholdersProvider) {
		this.placeholdersProvider = provider;
	}

	public getPlacehodlers(): Placeholder[] {
		if (!this.placeholdersProvider) {
			throw new Error('No provider');
		}
		return this.placeholdersProvider();
	}
}

export type PlaceholdersProvider = () => Placeholder[];
