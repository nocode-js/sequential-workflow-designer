import { Vector } from '../core/vector';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { Placeholder, StepComponent, StepComponentState } from '../workspace/component';
import { Behavior } from './behavior';
import { DragStepView } from './drag-step-behavior-view';
import { PlaceholderFinder } from './placeholder-finder';

export class DragStepBehavior implements Behavior {
	public static create(context: DesignerContext, step: Step, movingStepComponent?: StepComponent): DragStepBehavior {
		const view = DragStepView.create(step, context.configuration);
		return new DragStepBehavior(view, context, step, movingStepComponent);
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
		private readonly movingStepComponent?: StepComponent
	) {}

	public onStart(position: Vector) {
		let offset: Vector;
		if (this.movingStepComponent) {
			this.movingStepComponent.setState(StepComponentState.dragging);

			const clientPosition = this.movingStepComponent.view.getClientPosition();
			offset = position.subtract(clientPosition);
		} else {
			offset = new Vector(this.view.width / 2, this.view.height / 2);
		}

		this.view.setPosition(position.subtract(offset));
		this.context.setIsDragging(true);

		this.state = {
			startPosition: position,
			finder: PlaceholderFinder.create(this.context.getPlaceholders(), this.context),
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

	public onEnd(interrupt: boolean) {
		if (!this.state) {
			throw new Error('Invalid state');
		}

		this.state.finder.destroy();
		this.state = undefined;

		this.view.remove();
		this.context.setIsDragging(false);

		let modified = false;

		if (!interrupt && this.currentPlaceholder) {
			if (this.movingStepComponent) {
				modified = this.context.tryMoveStep(
					this.movingStepComponent.parentSequence,
					this.movingStepComponent.step,
					this.currentPlaceholder.parentSequence,
					this.currentPlaceholder.index
				);
			} else {
				modified = this.context.tryInsertStep(this.step, this.currentPlaceholder.parentSequence, this.currentPlaceholder.index);
			}
		}
		if (!modified) {
			if (this.movingStepComponent) {
				this.movingStepComponent.setState(StepComponentState.default);
			}
			if (this.currentPlaceholder) {
				this.currentPlaceholder.setIsHover(false);
			}
		}
		this.currentPlaceholder = undefined;
	}
}
