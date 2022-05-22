import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { Placeholder, StepComponent, StepComponentState } from '../workspace/component';
import { SequenceModifier } from '../workspace/sequence-modifier';
import { StepComponentFactory } from '../workspace/step-component-factory';
import { Workspace } from '../workspace/workspace';
import { Behavior } from './behavior';
import { PlaceholderFinder } from './placeholder-finder';

const SAFE_OFFSET = 10;

export class DragStepBehavior implements Behavior {

	public static create(workspace: Workspace, step: Step, sourceStepComponent?: StepComponent): DragStepBehavior {
		return new DragStepBehavior(
			DragStepView.create(step),
			workspace,
			step,
			sourceStepComponent);
	}

	private state?: {
		finder: PlaceholderFinder;
		startPosition: Vector;
		offset: Vector;
	};
	private currentPlaceholder?: Placeholder;

	private constructor(
		private readonly view: DragStepView,
		private readonly workspace: Workspace,
		private readonly step: Step,
		private readonly pressedStepComponent?: StepComponent) {
	}

	public onStart(position: Vector) {
		let offset: Vector;
		if (this.pressedStepComponent) {
			this.pressedStepComponent.setState(StepComponentState.moving);

			const componentPosition = this.pressedStepComponent.view.getPosition();

			offset = position.subtract(componentPosition);
		} else {
			offset = new Vector(this.view.width / 2, this.view.height / 2);
		}

		this.view.setPosition(position.subtract(offset));
		this.workspace.setDropMode(true);

		this.state = {
			startPosition: position,
			finder: PlaceholderFinder.create(this.workspace.getPlaceholders(), this.workspace),
			offset
		};
	}

	public onMove(delta: Vector) {
		if (this.state) {
			const newPosition = this.state.startPosition
				.subtract(delta)
				.subtract(this.state.offset);
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

		if (this.currentPlaceholder) {
			if (this.pressedStepComponent) {
				SequenceModifier.moveStep(
					this.pressedStepComponent.parentSequence,
					this.pressedStepComponent.step,
					this.currentPlaceholder.parentSequence,
					this.currentPlaceholder.index);
			} else {
				SequenceModifier.insertStep(
					this.step,
					this.currentPlaceholder.parentSequence,
					this.currentPlaceholder.index);
			}
			this.workspace.notifyChanged();
		} else {
			if (this.pressedStepComponent) {
				this.pressedStepComponent.setState(StepComponentState.default);
			}
			this.workspace.setDropMode(false);
		}
		this.currentPlaceholder = undefined;

		if (this.state) {
			this.state.finder.destroy();
			this.state = undefined;
		}
	}
}

class DragStepView {

	public static create(step: Step): DragStepView {
		const layer = document.createElement('div');
		layer.className = 'sqd-drag';

		const fakeSequence = { steps: [] };
		const stepComponent = StepComponentFactory.create(step, fakeSequence);

		const svg = Svg.element('svg', {
			width: stepComponent.view.width + SAFE_OFFSET * 2,
			height: stepComponent.view.height + SAFE_OFFSET * 2
		});
		Svg.translate(stepComponent.view.g, SAFE_OFFSET, SAFE_OFFSET);
		svg.appendChild(stepComponent.view.g);
		layer.appendChild(svg);

		document.body.appendChild(layer);
		return new DragStepView(stepComponent.view.width, stepComponent.view.height, layer);
	}

	private constructor(
		public readonly width: number,
		public readonly height: number,
		private readonly layer: HTMLElement) {
	}

	public setPosition(position: Vector) {
		this.layer.style.top = (position.y - SAFE_OFFSET) + 'px';
		this.layer.style.left = (position.x - SAFE_OFFSET) + 'px';
	}

	public remove() {
		document.body.removeChild(this.layer);
	}
}
