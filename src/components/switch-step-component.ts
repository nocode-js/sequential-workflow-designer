import { createSvgCenteredText, createSvgElement, setAttrs } from "../svg";
import { Vector } from "../vector";
import { ConnectionRenderer } from "./connection-renderer";
import { Component } from "./component";
import { SwitchStep } from "../definition";
import { SequenceComponent } from "./sequence-component";

const DIAMOND_SIZE = 18;
const MIN_CHILDREN_WIDTH = 50;
const PADDING_X = 20;
const PADDING_TOP = 18;
const PADDING_BOTTOM = 6;
const LABEL_HEIGHT = 26;
const CONNECTION_HEIGHT = 16;

export class SwitchStepComponent implements Component {

	public static create(step: SwitchStep): SwitchStepComponent {
		const branchNames = Object.keys(step.branches);
		const n = branchNames.length;

		const g = createSvgElement('g');

		const sequences = branchNames.map(bn => SequenceComponent.create(step.branches[bn]));

		const maxChildHeight = Math.max(...sequences.map(s => s.height));
		const containerWidths = sequences.map(s => Math.max(s.width, MIN_CHILDREN_WIDTH) + PADDING_X * 2);
		const containersWidth = containerWidths.reduce((p, c) => p + c, 0);
		const containerHeight = maxChildHeight + PADDING_TOP + PADDING_BOTTOM + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT * 2;
		const containerOffsets = [];

		const connectorXs = sequences.map(s => Math.max(s.connectorX, MIN_CHILDREN_WIDTH / 2));

		let totalX = 0;
		for (let i = 0; i < n; i++) {
			containerOffsets.push(totalX);
			totalX += containerWidths[i];
		}

		for (let i = 0; i < n; i++) {
			const sequence = sequences[i];
			const offsetX = containerOffsets[i];
			const border = createSvgElement('rect', {
				width: containerWidths[i],
				height: containerHeight,
				x: offsetX,
				fill: 'transparent',
				'stroke-width': 2,
				stroke: '#CECECE',
				'stroke-dasharray': 3
			});

			const branchWidth = 50;
			const branchRect = createSvgElement('rect', {
				fill: '#000',
				x: offsetX + connectorXs[i] + PADDING_X - branchWidth / 2,
				y: PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT,
				width: branchWidth,
				height: LABEL_HEIGHT,
				rx: 10,
				ry: 10
			});

			const branchText = createSvgCenteredText({
				fill: '#FFF',
				x: offsetX + connectorXs[i]+ PADDING_X,
				y: PADDING_TOP + LABEL_HEIGHT * 1.5 + CONNECTION_HEIGHT
			});
			branchText.textContent = branchNames[i];

			g.appendChild(border);
			g.appendChild(branchRect);
			g.appendChild(branchText);

			const sequenceX = offsetX + PADDING_X + Math.max((MIN_CHILDREN_WIDTH - sequence.width) / 2, 0);
			const sequenceY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT;
			setAttrs(sequence.g, {
				transform: `translate(${sequenceX}, ${sequenceY})`,
			});
			g.appendChild(sequence.g);

			const childEndY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT + sequence.height;
			ConnectionRenderer.createLine(g, new Vector(containerOffsets[i] + connectorXs[i] + PADDING_X, childEndY),
				containerHeight - childEndY - CONNECTION_HEIGHT);
		}

		const nameWidth = 70;
		const nameRect = createSvgElement('rect', {
			fill: '#2411DB',
			width: nameWidth,
			height: LABEL_HEIGHT,
			x: containerWidths[0] - nameWidth / 2,
			y: PADDING_TOP,
			rx: 10,
			ry: 10
		});

		const nameText = createSvgCenteredText({
			fill: '#FFF',
			x: containerWidths[0],
			y: PADDING_TOP + LABEL_HEIGHT / 2
		});
		nameText.textContent = step.name;

		g.appendChild(nameRect);
		g.appendChild(nameText);

		ConnectionRenderer.createLine(g, new Vector(containerWidths[0], 0), PADDING_TOP);

		const diamondG = createSvgElement('g', {
			transform: `translate(${containerWidths[0] - DIAMOND_SIZE / 2} ${-DIAMOND_SIZE / 2})`,
		});
		const ds2 = DIAMOND_SIZE / 2;
		const diamond = createSvgElement('path', {
			d: `M ${ds2} 0 L ${DIAMOND_SIZE} ${ds2} L ${ds2} ${DIAMOND_SIZE} L 0 ${ds2} Z`,
			fill: '#FFF',
			'stroke-width': 2,
			stroke: '#000'
		});
		diamondG.appendChild(diamond);
		g.appendChild(diamondG);

		ConnectionRenderer.createJoin(g,
			new Vector(containerWidths[0], PADDING_TOP + LABEL_HEIGHT),
			containerOffsets.map((o, i) => new Vector(o + connectorXs[i] + PADDING_X, PADDING_TOP + LABEL_HEIGHT + CONNECTION_HEIGHT)));

		ConnectionRenderer.createJoin(g,
			new Vector(containerWidths[0], containerHeight),
			containerOffsets.map((o, i) => new Vector(o + connectorXs[i] + PADDING_X, PADDING_TOP + PADDING_BOTTOM + CONNECTION_HEIGHT + LABEL_HEIGHT * 2 + maxChildHeight)));

		return new SwitchStepComponent(g, containersWidth, containerHeight, containerWidths[0]);
	}

	public constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly connectorX: number) {
	}
}
