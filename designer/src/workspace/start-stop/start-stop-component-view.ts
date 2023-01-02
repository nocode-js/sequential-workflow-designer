import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { Sequence } from '../../definition';
import { RectPlaceholderDirection, RectPlaceholderView } from '../common-views/rect-placeholder-view';
import { ComponentView } from '../component';
import { ComponentContext } from '../component-context';
import { SequenceComponent } from '../sequence/sequence-component';

const SIZE = 30;

export class StartStopComponentView implements ComponentView {
	public static create(parent: SVGElement, sequence: Sequence, placeholders: boolean, context: ComponentContext): StartStopComponentView {
		const g = Dom.svg('g', {
			class: 'sqd-step-start-stop'
		});
		parent.appendChild(g);

		const sequenceComponent = SequenceComponent.create(g, sequence, context);
		const view = sequenceComponent.view;

		const x = view.joinX - SIZE / 2;
		const endY = SIZE + view.height;

		const startCircle = createCircle(true);
		Dom.translate(startCircle, x, 0);
		g.appendChild(startCircle);

		Dom.translate(view.g, 0, SIZE);

		const endCircle = createCircle(false);
		Dom.translate(endCircle, x, endY);
		g.appendChild(endCircle);

		let startPlaceholderView: RectPlaceholderView | null = null;
		let endPlaceholderView: RectPlaceholderView | null = null;
		if (placeholders) {
			startPlaceholderView = RectPlaceholderView.create(g, x, 0, SIZE, SIZE, RectPlaceholderDirection.out);
			endPlaceholderView = RectPlaceholderView.create(g, x, endY, SIZE, SIZE, RectPlaceholderDirection.out);
		}

		return new StartStopComponentView(
			g,
			view.width,
			view.height + SIZE * 2,
			view.joinX,
			sequenceComponent,
			startPlaceholderView,
			endPlaceholderView
		);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly component: SequenceComponent,
		public readonly startPlaceholderView: RectPlaceholderView | null,
		public readonly endPlaceholderView: RectPlaceholderView | null
	) {}

	public getClientPosition(): Vector {
		throw new Error('Not supported');
	}

	public destroy() {
		this.g.parentNode?.removeChild(this.g);
	}
}

function createCircle(isStart: boolean): SVGGElement {
	const circle = Dom.svg('circle', {
		class: 'sqd-step-start-stop-circle',
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
			class: 'sqd-step-start-stop-icon',
			transform: `translate(${m}, ${m})`,
			d: `M ${s * 0.2} 0 L ${s} ${s / 2} L ${s * 0.2} ${s} Z`
		});
		g.appendChild(start);
	} else {
		const stop = Dom.svg('rect', {
			class: 'sqd-step-start-stop-icon',
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
