import { SwitchStep } from '../definition';
import { Svg } from '../svg';
import { Vector } from '../vector';
import { StepComponent, StepComponentState } from './component';
import { JoinRenderer } from './join-renderer';
import { SequenceComponent } from './sequence-component';

const DIAMOND_SIZE = 18;
const MIN_CHILDREN_WIDTH = 50;
const PADDING_X = 20;
const PADDING_TOP = 18;
const PADDING_BOTTOM = 6;
const LABEL_HEIGHT = 22;
const CONNECTION_HEIGHT = 16;

export class SwitchStepComponent implements StepComponent {

	public static create(step: SwitchStep): SwitchStepComponent {
		const branchNames = Object.keys(step.branches);
		const n = branchNames.length;

		const g = Svg.element('g', {
			class: 'sqd-switch-group'
		});

		const sequences = branchNames.map(bn => SequenceComponent.create(step.branches[bn]));

		const maxChildHeight = Math.max(...sequences.map(s => s.height));
		const containerWidths = sequences.map(s => Math.max(s.width, MIN_CHILDREN_WIDTH) + PADDING_X * 2);
		const containersWidth = containerWidths.reduce((p, c) => p + c, 0);
		const containerHeight = maxChildHeight + PADDING_TOP + PADDING_BOTTOM + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT * 2;
		const containerOffsets: number[] = [];

		const connectorXs = sequences.map(s => Math.max(s.joinX, MIN_CHILDREN_WIDTH / 2));

		let totalX = 0;
		for (let i = 0; i < n; i++) {
			containerOffsets.push(totalX);
			totalX += containerWidths[i];
		}

		const regions = branchNames.map((_, i) => {
			const sequence = sequences[i];
			const offsetX = containerOffsets[i];
			const region = Svg.element('rect', {
				class: 'sqd-switch-region',
				width: containerWidths[i],
				height: containerHeight,
				x: offsetX,
				fill: 'transparent'
			});

			const branchWidth = 50;
			const branchRect = Svg.element('rect', {
				class: 'sqd-switch-branch-rect',
				x: offsetX + connectorXs[i] + PADDING_X - branchWidth / 2,
				y: PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT,
				width: branchWidth,
				height: LABEL_HEIGHT,
				rx: 10,
				ry: 10
			});

			const branchText = Svg.centralText({
				class: 'sqd-switch-branch-text',
				x: offsetX + connectorXs[i]+ PADDING_X,
				y: PADDING_TOP + LABEL_HEIGHT * 1.5 + CONNECTION_HEIGHT
			});
			branchText.textContent = branchNames[i];

			g.appendChild(region);
			g.appendChild(branchRect);
			g.appendChild(branchText);

			const sequenceX = offsetX + PADDING_X + Math.max((MIN_CHILDREN_WIDTH - sequence.width) / 2, 0);
			const sequenceY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT;
			Svg.attrs(sequence.g, {
				transform: `translate(${sequenceX}, ${sequenceY})`,
			});
			g.appendChild(sequence.g);

			const childEndY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT + sequence.height;
			JoinRenderer.appendStraightJoin(g, new Vector(containerOffsets[i] + connectorXs[i] + PADDING_X, childEndY),
				containerHeight - childEndY - CONNECTION_HEIGHT);

			return region;
		});

		const nameWidth = 70;
		const nameRect = Svg.element('rect', {
			class: 'sqd-switch-name-rect',
			width: nameWidth,
			height: LABEL_HEIGHT,
			x: containerWidths[0] - nameWidth / 2,
			y: PADDING_TOP,
			rx: 10,
			ry: 10
		});

		const nameText = Svg.centralText({
			class: 'sqd-switch-name-text',
			x: containerWidths[0],
			y: PADDING_TOP + LABEL_HEIGHT / 2
		});
		nameText.textContent = step.name;

		g.appendChild(nameRect);
		g.appendChild(nameText);

		JoinRenderer.appendStraightJoin(g, new Vector(containerWidths[0], 0), PADDING_TOP);

		const ds2 = DIAMOND_SIZE / 2;
		const input = Svg.element('path', {
			d: `M ${ds2} 0 L ${DIAMOND_SIZE} ${ds2} L ${ds2} ${DIAMOND_SIZE} L 0 ${ds2} Z`,
			transform: `translate(${containerWidths[0] - DIAMOND_SIZE / 2} ${-DIAMOND_SIZE / 2})`,
			fill: '#FFF',
			'stroke-width': 2,
			stroke: '#000'
		});
		g.appendChild(input);

		JoinRenderer.appendJoins(g,
			new Vector(containerWidths[0], PADDING_TOP + LABEL_HEIGHT),
			containerOffsets.map((o, i) => new Vector(o + connectorXs[i] + PADDING_X, PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT)));

		JoinRenderer.appendJoins(g,
			new Vector(containerWidths[0], containerHeight),
			containerOffsets.map((o, i) => new Vector(o + connectorXs[i] + PADDING_X, PADDING_TOP + PADDING_BOTTOM + CONNECTION_HEIGHT + LABEL_HEIGHT * 2 + maxChildHeight)));

		return new SwitchStepComponent(g, containersWidth, containerHeight, containerWidths[0], sequences, regions, input);
	}

	private currentState = StepComponentState.default;

	public constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly sequences: SequenceComponent[],
		private readonly regions: SVGRectElement[],
		private readonly input: SVGPathElement) {
	}

	public findComponent(element: SVGElement): StepComponent | null {
		for (const sequence of this.sequences) {
			const component = sequence.findComponent(element);
			if (component) {
				return component;
			}
		}
		if (Svg.isChildOf(this.g, element)) {
			return this;
		}
		return null;
	}

	public setDropMode(isEnabled: boolean) {
		if (this.currentState === StepComponentState.default) {
			this.sequences.forEach(s => s.setDropMode(isEnabled));
		}
		Svg.attrs(this.input, {
			visibility: isEnabled ? 'hidden' : 'visible'
		});
	}

	public setState(state: StepComponentState) {
		this.currentState = state;
		switch (state) {
			case StepComponentState.default:
				this.regions.forEach(r => r.classList.remove('sqd-selected'));
				this.g.classList.remove('sqd-moving');
				break;
			case StepComponentState.selected:
				this.regions.forEach(r => r.classList.add('sqd-selected'));
				this.g.classList.remove('sqd-moving');
				break;
			case StepComponentState.moving:
				this.regions.forEach(r => r.classList.remove('sqd-selected'));
				this.g.classList.add('sqd-moving');
				break;
		}
	}
}
