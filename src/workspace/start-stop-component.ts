import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';
import { Component, ComponentView, Placeholder, StepComponent } from './component';
import { SequenceComponent, SequenceComponentView } from './sequence-component';

const SIZE = 30;

export class StartStopComponent implements Component {

	public static create(sequence: Sequence): StartStopComponent {
		const sequenceComponent = SequenceComponent.create(sequence);
		const view = AnchorStepComponentView.create(sequenceComponent.view);
		return new StartStopComponent(
			view,
			sequenceComponent);
	}

	public readonly parentSequence: Sequence = null as any;
	public readonly step: Step = null as any;

	private constructor(
		public readonly view: AnchorStepComponentView,
		private readonly sequenceComponent: SequenceComponent) {
	}

	public findStepComponent(element: Element): StepComponent | null {
		return this.sequenceComponent.findStepComponent(element);
	}

	public getPlaceholders(result: Placeholder[]) {
		this.sequenceComponent.getPlaceholders(result);
	}

	public setDropMode(isEnabled: boolean) {
		this.sequenceComponent.setDropMode(isEnabled);
	}
}

export class AnchorStepComponentView implements ComponentView {

	public static create(view: SequenceComponentView): AnchorStepComponentView {
		const g = Svg.element('g');

		const startCircle = createCircle(true);
		Svg.translate(startCircle, view.joinX - SIZE / 2, 0);
		g.appendChild(startCircle);

		Svg.translate(view.g, 0, SIZE);
		g.appendChild(view.g);

		const endCircle = createCircle(false);
		Svg.translate(endCircle, view.joinX - SIZE / 2, SIZE + view.height);
		g.appendChild(endCircle);

		return new AnchorStepComponentView(g, view.width, view.height + SIZE * 2, view.joinX);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number) {
	}

	public getPosition(): Vector {
		throw new Error('Not supported');
	}
}

function createCircle(isStart: boolean): SVGGElement {
	const circle = Svg.element('circle', {
		class: 'sqd-start-stop',
		cx: SIZE / 2,
		cy: SIZE / 2,
		r: SIZE / 2
	});

	const g = Svg.element('g');
	g.appendChild(circle);

	const s = SIZE * 0.5;
	const m = (SIZE - s) / 2;

	if (isStart) {
		const start = Svg.element('path', {
			class: 'sqd-start-stop-icon',
			transform: `translate(${m}, ${m})`,
			d: `M ${s * 0.2} 0 L ${s} ${s / 2} L ${s * 0.2} ${s} Z`
		});
		g.appendChild(start);
	} else {
		const stop = Svg.element('rect', {
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
