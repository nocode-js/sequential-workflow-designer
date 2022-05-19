import { Svg } from '../core/svg';
import { StepComponent, StepComponentState } from './component';

const SIZE = 30;

export class AnchorStepComponent implements StepComponent {

	public static create(isStart: boolean): AnchorStepComponent {
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
		return new AnchorStepComponent(g, SIZE, SIZE, SIZE / 2, circle);
	}

	public readonly canDrag = false;

	public constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly circle: SVGCircleElement) {
	}

	public findComponent(element: SVGElement): StepComponent | null {
		return Svg.isChildOf(this.g, element)
			? this
			: null;
	}

	public setDropMode() {
		// Nothing
	}

	public setState(state: StepComponentState) {
		switch (state) {
			case StepComponentState.default:
				this.circle.classList.remove('sqd-selected');
				break;
			case StepComponentState.selected:
				this.circle.classList.add('sqd-selected');
				break;
		}
	}
}
