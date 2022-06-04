import { SequenceModifier } from '../core/sequence-modifier';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { Placeholder, StepComponent, StepComponentState } from '../workspace/component';
import { Behavior } from './behavior';
import { DragStepView } from './drag-step-behavior-view';
import { PlaceholderFinder } from './placeholder-finder';

export class DragStepBehavior implements Behavior {
	public static create(context: DesignerContext, step: Step, pressedStepComponent?: StepComponent): DragStepBehavior {
		const view = DragStepView.create(step, context.configuration);
		return new DragStepBehavior(view, context, step, pressedStepComponent);
	}

	private state?: {
		finder: PlaceholderFinder;
		startPosition: Vector;
		offset: Vector;
	};
	private currentPlaceholder?: Placeholder;

	private constructor(
		private readonly view: DragStepView,
		private readonly context: DesignerContext,
		private readonly step: Step,
		private readonly pressedStepComponent?: StepComponent
	) {}

	public onStart(position: Vector) {
		let offset: Vector;
		if (this.pressedStepComponent) {
			this.pressedStepComponent.setState(StepComponentState.dragging);

			const clientPosition = this.pressedStepComponent.view.getClientPosition();
			offset = position.subtract(clientPosition);
		} else {
			offset = new Vector(this.view.width / 2, this.view.height / 2);
		}

		this.view.setPosition(position.subtract(offset));
		this.context.setIsDragging(true);

		this.state = {
			startPosition: position,
			finder: PlaceholderFinder.create(this.context.getPlacehodlers(), this.context),
			offset
		};
	}

	public onMove(delta: Vector) {
		if (this.state) {
			const newPosition = this.state.startPosition.subtract(delta).subtract(this.state.offset);
			this.view.setPosition(newPosition);

			const placeholder = this.state.finder.find(newPosition, this.view.width, this.view.height);

			if (this.currentPlaceholder !== placeholder) {
				if (this.currentPlaceholder) {
					this.currentPlaceholder.setIsHover(false);
				}
				if (placeholder) {
					placeholder.setIsHover(true);
				}
				this.currentPlaceholder = placeholder;
			}
		}
	}

	public onEnd() {
		this.view.remove();
		this.context.setIsDragging(false);

		if (this.currentPlaceholder) {
			if (this.pressedStepComponent) {
				SequenceModifier.moveStep(
					this.pressedStepComponent.parentSequence,
					this.pressedStepComponent.step,
					this.currentPlaceholder.parentSequence,
					this.currentPlaceholder.index
				);
			} else {
				SequenceModifier.insertStep(this.step, this.currentPlaceholder.parentSequence, this.currentPlaceholder.index);
			}
			this.context.notifiyDefinitionChanged();
		} else {
			if (this.pressedStepComponent) {
				this.pressedStepComponent.setState(StepComponentState.default);
			}
		}
		this.currentPlaceholder = undefined;

		if (this.state) {
			this.state.finder.destroy();
			this.state = undefined;
		}
	}
}
