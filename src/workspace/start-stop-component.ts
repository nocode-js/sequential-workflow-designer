import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { Component, ComponentView, Placeholder, StepComponent } from './component';
import { SequenceComponent } from './sequence-component';

const SIZE = 30;

export class StartStopComponent implements Component {

	public static create(parent: SVGElement, sequence: Sequence, configuration: StepsConfiguration): StartStopComponent {
		const view = AnchorStepComponentView.create(parent, sequence, configuration);
		return new StartStopComponent(view);
	}

	public readonly parentSequence: Sequence = null as any;
	public readonly step: Step = null as any;

	private constructor(
		public readonly view: AnchorStepComponentView) {
	}

	public findByElement(element: Element): StepComponent | null {
		return this.view.component.findByElement(element);
	}

	public findById(stepId: string): StepComponent | null {
		return this.view.component.findById(stepId);
	}

	public getPlaceholders(result: Placeholder[]) {
		this.view.component.getPlaceholders(result);
	}

	public setIsDragging(isDragging: boolean) {
		this.view.component.setIsDragging(isDragging);
	}

	public validate(): boolean {
		return this.view.component.validate();
	}
}

export class AnchorStepComponentView implements ComponentView {

	public static create(parent: SVGElement, sequence: Sequence, configuration: StepsConfiguration): AnchorStepComponentView {
		const g = Dom.svg('g');
		parent.appendChild(g);

		const sequenceComponent = SequenceComponent.create(g, sequence, configuration);
		const view = sequenceComponent.view;

		const startCircle = createCircle(true);
		Dom.translate(startCircle, view.joinX - SIZE / 2, 0);
		g.appendChild(startCircle);

		Dom.translate(view.g, 0, SIZE);

		const endCircle = createCircle(false);
		Dom.translate(endCircle, view.joinX - SIZE / 2, SIZE + view.height);
		g.appendChild(endCircle);

		return new AnchorStepComponentView(g, view.width, view.height + SIZE * 2, view.joinX, sequenceComponent);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly component: SequenceComponent) {
	}

	public getClientPosition(): Vector {
		throw new Error('Not supported');
	}

	public destroy() {
		this.g.parentNode?.removeChild(this.g);
	}
}

function createCircle(isStart: boolean): SVGGElement {
	const circle = Dom.svg('circle', {
		class: 'sqd-start-stop',
		cx: SIZE / 2,
		cy: SIZE / 2,
		r: SIZE / 2
	});

	const g = Dom.svg('g');
	g.appendChild(circle);

	const s = SIZE * 0.5;
	const m = (SIZE - s) / 2;

	if (isStart) {
		const start = Dom.svg('path', {
			class: 'sqd-start-stop-icon',
			transform: `translate(${m}, ${m})`,
			d: `M ${s * 0.2} 0 L ${s} ${s / 2} L ${s * 0.2} ${s} Z`
		});
		g.appendChild(start);
	} else {
		const stop = Dom.svg('rect', {
			class: 'sqd-start-stop-icon',
			x: m,
			y: m,
			width: s,
			height: s,
			rx: 4,
			ry: 4
		});
		g.appendChild(stop);
	}
	return g;
}
