import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';
import { ComponentView, StepComponent, StepComponentState } from './component';

const SIZE = 30;

export class AnchorStepComponent implements StepComponent {

	public static create(isStart: boolean): AnchorStepComponent {
		return new AnchorStepComponent(
			AnchorStepComponentView.create(isStart));
	}

	public readonly parentSequence: Sequence = null as any;
	public readonly step: Step = null as any;
	public readonly canDrag = false;

	private constructor(
		public readonly view: AnchorStepComponentView) {
	}

	public findStepComponent(element: Element): StepComponent | null {
		return this.view.containsElement(element)
			? this
			: null;
	}

	public findPlaceholder(): null {
		return null;
	}

	public setDropMode() {
		// Nothing
	}

	public setState(state: StepComponentState) {
		switch (state) {
			case StepComponentState.default:
				this.view.setIsSelected(false);
				break;
			case StepComponentState.selected:
				this.view.setIsSelected(true);
				break;
		}
	}
}

export class AnchorStepComponentView implements ComponentView {

	public static create(isStart: boolean): AnchorStepComponentView {
		const circle = Svg.element('circle', {
			class: 'sqd-anchor',
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
				class: 'sqd-anchor-icon',
				transform: `translate(${m}, ${m})`,
				d: `M ${s * 0.2} 0 L ${s} ${s / 2} L ${s * 0.2} ${s} Z`
			});
			g.appendChild(start);
		} else {
			const stop = Svg.element('rect', {
				class: 'sqd-anchor-icon',
				x: m,
				y: m,
				width: s,
				height: s,
				rx: 4,
				ry: 4
			});
			g.appendChild(stop);
		}
		return new AnchorStepComponentView(g, SIZE, SIZE, SIZE / 2, circle);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly circle: SVGCircleElement) {
	}

	public getPosition(): Vector {
		throw new Error('Not supported');
	}

	public containsElement(element: Element): boolean {
		return this.g.contains(element);
	}

	public setIsSelected(isSelected: boolean) {
		if (isSelected) {
			this.circle.classList.add('sqd-selected');
		} else {
			this.circle.classList.remove('sqd-selected');
		}
	}
}
