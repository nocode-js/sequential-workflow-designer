import { Dom } from '../core/dom';
import { SequenceModifier } from '../core/sequence-modifier';
import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { Placeholder, StepComponent, StepComponentState } from '../workspace/component';
import { StepComponentFactory } from '../workspace/step-component-factory';
import { Behavior } from './behavior';
import { PlaceholderFinder } from './placeholder-finder';

const SAFE_OFFSET = 10;

export class DragStepBehavior implements Behavior {

	public static create(context: DesignerContext, step: Step, pressedStepComponent?: StepComponent): DragStepBehavior {
		const view = DragStepView.create(step, context.configuration);
		return new DragStepBehavior(
			view,
			context,
			step,
			pressedStepComponent);
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
		private readonly pressedStepComponent?: StepComponent) {
	}

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
		this.context.setIsDragging(false);

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

class DragStepView {

	public static create(step: Step, configuration: DesignerConfiguration): DragStepView {
		const theme = configuration.theme || 'light';
		const layer = Dom.element('div', {
			class: `sqd-drag sqd-theme-${theme}`
		});
		document.body.appendChild(layer);

		const svg = Dom.svg('svg');
		layer.appendChild(svg);

		const fakeSequence: Sequence = [];
		const stepComponent = StepComponentFactory.create(svg, step, fakeSequence, configuration.steps);

		Dom.attrs(svg, {
			width: stepComponent.view.width + SAFE_OFFSET * 2,
			height: stepComponent.view.height + SAFE_OFFSET * 2
		});

		Dom.translate(stepComponent.view.g, SAFE_OFFSET, SAFE_OFFSET);

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
