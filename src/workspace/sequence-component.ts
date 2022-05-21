import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';
import { Component, ComponentView, Placeholder, StepComponent } from './component';
import { JoinRenderer } from './join-renderer';
import { StepComponentFactory } from './step-component-factory';

const PH_WIDTH = 100;
const PH_HEIGHT = 24;

export class SequenceComponent implements Component {

	public static create(sequence: Sequence): SequenceComponent {
		const components = sequence.steps.map(s => StepComponentFactory.create(s, sequence));
		return SequenceComponent.createForComponents(components, sequence, false);
	}

	public static createForComponents(components: Component[], sequence: Sequence, skipFirstPadding: boolean): SequenceComponent {
		const view = SequenceComponentView.create(components, skipFirstPadding);
		return new SequenceComponent(view, sequence, components);
	}

	private constructor(
		public readonly view: SequenceComponentView,
		private readonly sequence: Sequence,
		private readonly components: Component[]) {
	}

	public findStepComponent(element: Element): StepComponent | null {
		for (let component of this.components) {
			const sc = component.findStepComponent(element);
			if (sc) {
				return sc;
			}
		}
		return null;
	}

	public getPlaceholders(result: Placeholder[]) {
		this.view.placeholders.forEach((ph, i) => {
			result.push(new SequencePlaceholder(ph, this.sequence, i));
		});
		this.components.forEach(c => c.getPlaceholders(result));
	}

	public setDropMode(isEnabled: boolean) {
		this.view.setDropMode(isEnabled);
		this.components.forEach(c => c.setDropMode(isEnabled));
	}
}

export class SequenceComponentView implements ComponentView {

	public static create(components: Component[], skipFirstPadding: boolean): SequenceComponentView {
		const g = Svg.element('g');

		if (components.length === 0) {
			JoinRenderer.appendStraightJoin(g, new Vector(PH_WIDTH / 2, 0), PH_HEIGHT);

			const placeholder = createPlaceholder(0, 0);
			g.appendChild(placeholder);

			return new SequenceComponentView(g, PH_WIDTH, PH_HEIGHT, PH_WIDTH / 2, [placeholder]);
		}

		const maxJoinX = Math.max(...components.map(c => c.view.joinX));
		const maxWidth = Math.max(...components.map(c => c.view.width));

		let offsetY = skipFirstPadding ? 0 : PH_HEIGHT;

		const placeholders: SVGElement[] = [];
		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			const offsetX = maxJoinX - component.view.joinX;

			if (i !== 0 || !skipFirstPadding) {
				JoinRenderer.appendStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);

				const placeholder = createPlaceholder(
					maxJoinX - PH_WIDTH / 2,
					offsetY - PH_HEIGHT);
				g.appendChild(placeholder);
				placeholders.push(placeholder);
			}

			Svg.attrs(component.view.g, {
				transform: `translate(${offsetX}, ${offsetY})`
			});
			g.appendChild(component.view.g);
			offsetY += component.view.height + PH_HEIGHT;
		}

		return new SequenceComponentView(g, maxWidth, offsetY - PH_HEIGHT, maxJoinX, placeholders);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly placeholders: SVGElement[]) {
	}

	public getPosition(): Vector {
		throw new Error('Not supported');
	}

	public setDropMode(isEnabled: boolean) {
		this.placeholders.forEach(p => {
			Svg.attrs(p, {
				visibility: isEnabled ? 'visible' : 'hidden'
			});
		});
	}
}

export class SequencePlaceholder implements Placeholder {

	public constructor(
		public readonly element: Element,
		private readonly sequence: Sequence,
		private readonly index: number) {
	}

	public append(step: Step) {
		this.sequence.steps.splice(this.index, 0, step);
	}

	public setIsHover(isHover: boolean) {
		if (isHover) {
			this.element.classList.add('sqd-hover');
		} else {
			this.element.classList.remove('sqd-hover');
		}
	}
}

function createPlaceholder(x: number, y: number) {
	return Svg.element('rect', {
		class: 'sqd-placeholder',
		width: PH_WIDTH,
		height: PH_HEIGHT,
		x,
		y,
		rx: 6,
		ry: 6,
		visibility: 'hidden'
	});
}
