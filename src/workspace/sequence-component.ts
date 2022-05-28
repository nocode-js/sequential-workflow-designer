import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { Component, ComponentView, Placeholder, StepComponent } from './component';
import { JoinRenderer } from './join-renderer';
import { SequencePlaceholder } from './sequence-placeholder';
import { StepComponentFactory } from './step-component-factory';

const PH_WIDTH = 100;
const PH_HEIGHT = 24;

export class SequenceComponent implements Component {

	public static create(parent: SVGElement, sequence: Sequence, configuration: StepsConfiguration): SequenceComponent {
		const view = SequenceComponentView.create(parent, sequence, configuration);
		return new SequenceComponent(view, sequence);
	}

	private constructor(
		public readonly view: SequenceComponentView,
		private readonly sequence: Sequence) {
	}

	public findByElement(element: Element): StepComponent | null {
		for (let component of this.view.components) {
			const sc = component.findByElement(element);
			if (sc) {
				return sc;
			}
		}
		return null;
	}

	public findById(stepId: string): StepComponent | null {
		for (let component of this.view.components) {
			const sc = component.findById(stepId);
			if (sc) {
				return sc;
			}
		}
		return null;
	}

	public getPlaceholders(result: Placeholder[]) {
		this.view.placeholders.forEach((ph, index) => {
			result.push(new SequencePlaceholder(ph, this.sequence, index));
		});
		this.view.components.forEach(c => c.getPlaceholders(result));
	}

	public setIsDragging(isDragging: boolean) {
		this.view.setIsDragging(isDragging);
		this.view.components.forEach(c => c.setIsDragging(isDragging));
	}

	public validate(): boolean {
		return this.view.components.every(c => c.validate());
	}
}

export class SequenceComponentView implements ComponentView {

	public static create(parent: SVGElement, sequence: Sequence, configuration: StepsConfiguration): SequenceComponentView {
		const g = Dom.svg('g');
		parent.appendChild(g);

		const components = sequence.steps.map(s => StepComponentFactory.create(g, s, sequence, configuration));

		const maxJoinX = (components.length > 0)
			? Math.max(...components.map(c => c.view.joinX))
			: (PH_WIDTH / 2);
		const maxWidth = (components.length > 0)
			? Math.max(...components.map(c => c.view.width))
			: PH_WIDTH;

		let offsetY = PH_HEIGHT;

		const placeholders: SVGElement[] = [];
		for (let i = 0; i < components.length; i++) {
			const component = components[i];
			const offsetX = maxJoinX - component.view.joinX;

			JoinRenderer.createStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);

			placeholders.push(appendPlaceholder(g,
				maxJoinX - PH_WIDTH / 2,
				offsetY - PH_HEIGHT));

			Dom.translate(component.view.g, offsetX, offsetY);
			offsetY += component.view.height + PH_HEIGHT;
		}

		JoinRenderer.createStraightJoin(g, new Vector(maxJoinX, offsetY - PH_HEIGHT), PH_HEIGHT);
		placeholders.push(appendPlaceholder(g, maxJoinX - PH_WIDTH / 2, offsetY - PH_HEIGHT));

		return new SequenceComponentView(g, maxWidth, offsetY, maxJoinX, placeholders, components);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly placeholders: SVGElement[],
		public readonly components: Component[]) {
	}

	public getClientPosition(): Vector {
		throw new Error('Not supported');
	}

	public setIsDragging(isDragging: boolean) {
		this.placeholders.forEach(p => {
			Dom.attrs(p, {
				visibility: isDragging ? 'visible' : 'hidden'
			});
		});
	}
}

function appendPlaceholder(g: SVGGElement, x: number, y: number): SVGElement {
	const rect = Dom.svg('rect', {
		class: 'sqd-placeholder',
		width: PH_WIDTH,
		height: PH_HEIGHT,
		x,
		y,
		rx: 6,
		ry: 6,
		visibility: 'hidden'
	});
	g.appendChild(rect);
	return rect;
}
