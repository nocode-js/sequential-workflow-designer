import { Icons, Vector } from '../../core';
import { Dom } from '../../core/dom';
import { Sequence } from '../../definition';
import { ComponentView, Placeholder, PlaceholderDirection } from '../component';
import { ComponentContext } from '../../component-context';
import { SequenceComponent } from '../sequence/sequence-component';
import { SequencePlaceIndicator } from '../../designer-extension';

const SIZE = 30;
const DEFAULT_ICON_SIZE = 22;
const FOLDER_ICON_SIZE = 18;

export class StartStopRootComponentView implements ComponentView {
	public static create(
		parent: SVGElement,
		sequence: Sequence,
		parentPlaceIndicator: SequencePlaceIndicator | null,
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

		const iconSize = parentPlaceIndicator ? FOLDER_ICON_SIZE : DEFAULT_ICON_SIZE;
		const startCircle = createCircle(parentPlaceIndicator ? Icons.folder : Icons.play, iconSize);
		Dom.translate(startCircle, x, 0);
		g.appendChild(startCircle);

		Dom.translate(view.g, 0, SIZE);

		const endCircle = createCircle(parentPlaceIndicator ? Icons.folder : Icons.stop, iconSize);
		Dom.translate(endCircle, x, endY);
		g.appendChild(endCircle);

		let startPlaceholder: Placeholder | null = null;
		let endPlaceholder: Placeholder | null = null;
		if (parentPlaceIndicator) {
			const size = new Vector(SIZE, SIZE);
			startPlaceholder = context.services.placeholder.createForArea(
				g,
				size,
				PlaceholderDirection.out,
				parentPlaceIndicator.sequence,
				parentPlaceIndicator.index
			);
			endPlaceholder = context.services.placeholder.createForArea(
				g,
				size,
				PlaceholderDirection.out,
				parentPlaceIndicator.sequence,
				parentPlaceIndicator.index
			);

			Dom.translate(startPlaceholder.view.g, x, 0);
			Dom.translate(endPlaceholder.view.g, x, endY);
		}

		return new StartStopRootComponentView(
			g,
			view.width,
			view.height + SIZE * 2,
			view.joinX,
			sequenceComponent,
			startPlaceholder,
			endPlaceholder
		);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly component: SequenceComponent,
		public readonly startPlaceholder: Placeholder | null,
		public readonly endPlaceholder: Placeholder | null
	) {}

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
