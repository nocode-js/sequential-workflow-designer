import { Sequence } from '../definition';
import { Svg } from '../svg';
import { Vector } from '../vector';
import { Component, StepComponent } from './component';
import { JoinRenderer } from './join-renderer';
import { StepComponentFactory } from './step-component-factory';

const PH_WIDTH = 80;
const PH_HEIGHT = 20;

export class SequenceComponent implements Component {

	public static create(sequence: Sequence): SequenceComponent {
		const components = sequence.steps.map(StepComponentFactory.create);
		return SequenceComponent.createForComponents(components, false);
	}

	public static createForComponents(components: Component[], skipFirstPadding: boolean): SequenceComponent {
		const g = Svg.element('g');

		if (components.length === 0) {
			JoinRenderer.appendStraightJoin(g, new Vector(PH_WIDTH / 2, 0), PH_HEIGHT);

			const placeholder = createPlaceholder(0, 0);
			g.appendChild(placeholder);

			return new SequenceComponent(g, PH_WIDTH, PH_HEIGHT, PH_WIDTH / 2, components, [placeholder]);
		}

		const maxJoinX = Math.max(...components.map(c => c.joinX));
		const maxWidth = Math.max(...components.map(c => c.width));

		let offsetY = skipFirstPadding ? 0 : PH_HEIGHT;

		const placeholders: SVGElement[] = [];
		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			const offsetX = maxJoinX - component.joinX;

			if (i !== 0 || !skipFirstPadding) {
				JoinRenderer.appendStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);

				const placeholder = createPlaceholder(
					maxJoinX - PH_WIDTH / 2,
					offsetY - PH_HEIGHT);
				g.appendChild(placeholder);
				placeholders.push(placeholder);
			}

			Svg.attrs(component.g, {
				transform: `translate(${offsetX}, ${offsetY})`
			});
			g.appendChild(component.g);
			offsetY += component.height + PH_HEIGHT;
		}

		return new SequenceComponent(g, maxWidth, offsetY - PH_HEIGHT, maxJoinX, components, placeholders);
	}

	public constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly components: Component[],
		private readonly placeholders: SVGElement[]) {
	}

	public findComponent(element: SVGElement): StepComponent | null {
		for (let component of this.components) {
			const comp = component.findComponent(element);
			if (comp) {
				return comp;
			}
		}
		return null;
	}

	public setDropMode(isEnabled: boolean) {
		this.placeholders.forEach(p => Svg.attrs(p, {
			visibility: isEnabled ? 'visible' : 'hidden'
		}));
		this.components.forEach(c => c.setDropMode(isEnabled));
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
