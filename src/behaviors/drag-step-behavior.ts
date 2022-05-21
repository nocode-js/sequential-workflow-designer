import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { StepComponent, StepComponentState } from '../workspace/component';
import { StepComponentFactory } from '../workspace/step-component-factory';
import { Workspace } from '../workspace/workspace';
import { Behavior } from './behavior';

const SAFE_OFFSET = 10;

export class DragStepBehavior implements Behavior {

	public static create(workspace: Workspace, step: Step, sourceStepComponent?: StepComponent): DragStepBehavior {
		return new DragStepBehavior(
			DragStepView.create(step),
			workspace,
			step,
			sourceStepComponent);
	}

	private startPosition?: Vector;
	private offset = new Vector(0, 0);

	private constructor(
		private readonly view: DragStepView,
		private readonly workspace: Workspace,
		private readonly step: Step,
		private readonly pressedStepComponent?: StepComponent) {
	}

	public onStart(position: Vector) {
		this.startPosition = position;

		if (this.pressedStepComponent) {
			this.pressedStepComponent.setState(StepComponentState.moving);

			const componentPosition = this.pressedStepComponent.view.getPosition();

			this.offset = position.subtract(componentPosition);
		} else {
			this.offset = new Vector(this.view.getWidth() / 2, 0);
		}

		this.view.setPosition(position.subtract(this.offset));
		this.workspace.setDropMode(true);
	}

	public onMove(delta: Vector) {
		if (this.startPosition) {
			const newPosition = this.startPosition.subtract(delta).subtract(this.offset);
			this.view.setPosition(newPosition);
		}
	}

	public onEnd(target: Element) {
		this.view.remove();

		const placeholder = this.workspace.findPlaceholder(target);
		if (placeholder) {
			if (this.pressedStepComponent) {
				const index = this.pressedStepComponent.parentSequence.steps.indexOf(this.step);
				this.pressedStepComponent.parentSequence.steps.splice(index, 1);
			}
			placeholder.append(this.step);
			this.workspace.render();
		} else {
			if (this.pressedStepComponent) {
				this.pressedStepComponent.setState(StepComponentState.default);
			}
			this.workspace.setDropMode(false);
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
		Svg.attrs(stepComponent.view.g, {
			transform: `translate(${SAFE_OFFSET}, ${SAFE_OFFSET})`
		});
		svg.appendChild(stepComponent.view.g);
		layer.appendChild(svg);

		document.body.appendChild(layer);
		return new DragStepView(layer, stepComponent);
	}

	private constructor(
		private readonly layer: HTMLElement,
		private readonly stepComponent: StepComponent) {
	}

	public getWidth(): number {
		return this.stepComponent.view.width;
	}

	public setPosition(position: Vector) {
		this.layer.style.top = (position.y - SAFE_OFFSET) + 'px';
		this.layer.style.left = (position.x - SAFE_OFFSET) + 'px';
	}

	public remove() {
		document.body.removeChild(this.layer);
	}
}
