import { Icons } from '../../core';
import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { Sequence } from '../../definition';
import { RectPlaceholderDirection, RectPlaceholderView } from '../common-views/rect-placeholder-view';
import { ComponentView } from '../component';
import { ComponentContext } from '../../component-context';
import { SequenceComponent } from '../sequence/sequence-component';

const SIZE = 30;
const DEFAULT_ICON_SIZE = 22;
const FOLDER_ICON_SIZE = 18;

export class StartStopRootComponentView implements ComponentView {
	public static create(
		parent: SVGElement,
		sequence: Sequence,
		isInsideFolder: boolean,
		context: ComponentContext
	): StartStopRootComponentView {
		const g = Dom.svg('g', {
			class: 'sqd-root-start-stop'
		});
		parent.appendChild(g);

		const sequenceComponent = SequenceComponent.create(
			g,
			{
				sequence,
				depth: 0,
				isInputConnected: true,
				isOutputConnected: true
			},
			context
		);
		const view = sequenceComponent.view;

		const x = view.joinX - SIZE / 2;
		const endY = SIZE + view.height;

		const iconSize = isInsideFolder ? FOLDER_ICON_SIZE : DEFAULT_ICON_SIZE;
		const startCircle = createCircle(isInsideFolder ? Icons.folder : Icons.play, iconSize);
		Dom.translate(startCircle, x, 0);
		g.appendChild(startCircle);

		Dom.translate(view.g, 0, SIZE);

		const endCircle = createCircle(isInsideFolder ? Icons.folder : Icons.stop, iconSize);
		Dom.translate(endCircle, x, endY);
		g.appendChild(endCircle);

		let startPlaceholderView: RectPlaceholderView | null = null;
		let endPlaceholderView: RectPlaceholderView | null = null;
		if (isInsideFolder) {
			startPlaceholderView = RectPlaceholderView.create(g, x, 0, SIZE, SIZE, RectPlaceholderDirection.out);
			endPlaceholderView = RectPlaceholderView.create(g, x, endY, SIZE, SIZE, RectPlaceholderDirection.out);
		}

		return new StartStopRootComponentView(
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

function createCircle(d: string, iconSize: number): SVGGElement {
	const r = SIZE / 2;
	const circle = Dom.svg('circle', {
		class: 'sqd-root-start-stop-circle',
		cx: r,
		cy: r,
		r: r
	});

	const g = Dom.svg('g');
	g.appendChild(circle);

	const offset = (SIZE - iconSize) / 2;
	const icon = Icons.appendPath(g, 'sqd-root-start-stop-icon', d, iconSize);
	Dom.translate(icon, offset, offset);
	return g;
}
