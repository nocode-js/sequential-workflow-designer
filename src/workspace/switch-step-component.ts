import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Sequence, Step, SwitchStep } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { ComponentView, Placeholder, StepComponent, StepComponentState } from './component';
import { JoinRenderer } from './join-renderer';
import { SequenceComponent } from './sequence-component';

const INPUT_SIZE = 18;
const MIN_CHILDREN_WIDTH = 50;
const PADDING_X = 20;
const PADDING_TOP = 20;
const LABEL_HEIGHT = 22;
const CONNECTION_HEIGHT = 16;

export class SwitchStepComponent implements StepComponent {

	public static create(step: SwitchStep, parentSequence: Sequence, configuration: DesignerConfiguration): SwitchStepComponent {
		const sequenceComponents = Object.keys(step.branches).map(bn => SequenceComponent.create(step.branches[bn], configuration));
		const view = SwitchStepComponentView.create(step, sequenceComponents);
		return new SwitchStepComponent(view, step, parentSequence, sequenceComponents);
	}

	private currentState = StepComponentState.default;

	private constructor(
		public readonly view: SwitchStepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence,
		private readonly sequenceComponents: SequenceComponent[]) {
	}

	public findStepComponent(element: Element): StepComponent | null {
		for (const sequence of this.sequenceComponents) {
			const component = sequence.findStepComponent(element);
			if (component) {
				return component;
			}
		}
		if (this.view.containsElement(element)) {
			return this;
		}
		return null;
	}

	public getPlaceholders(result: Placeholder[]) {
		if (this.currentState !== StepComponentState.moving) {
			this.sequenceComponents.forEach(sc => sc.getPlaceholders(result));
		}
	}

	public setIsMoving(isEnabled: boolean) {
		if (this.currentState !== StepComponentState.moving) {
			this.sequenceComponents.forEach(s => s.setIsMoving(isEnabled));
		}
		this.view.setIsMoving(isEnabled);
	}

	public setState(state: StepComponentState) {
		this.currentState = state;
		switch (state) {
			case StepComponentState.default:
				this.view.setIsSelected(false);
				this.view.setIsDisabled(false);
				break;
			case StepComponentState.selected:
				this.view.setIsSelected(true);
				this.view.setIsDisabled(false);
				break;
			case StepComponentState.moving:
				this.view.setIsSelected(false);
				this.view.setIsDisabled(true);
				break;
		}
	}
}

export class SwitchStepComponentView implements ComponentView {

	public static create(step: SwitchStep, sequenceComponents: SequenceComponent[]): SwitchStepComponentView {
		const branchNames = Object.keys(step.branches);
		const n = branchNames.length;

		const g = Svg.element('g', {
			class: 'sqd-switch-group'
		});

		const maxChildHeight = Math.max(...sequenceComponents.map(s => s.view.height));
		const containerWidths = sequenceComponents.map(s => Math.max(s.view.width, MIN_CHILDREN_WIDTH) + PADDING_X * 2);
		const containersWidth = containerWidths.reduce((p, c) => p + c, 0);
		const containerHeight = maxChildHeight + PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT * 2;
		const containerOffsets: number[] = [];

		const connectorXs = sequenceComponents.map(s => Math.max(s.view.joinX, MIN_CHILDREN_WIDTH / 2));

		let totalX = 0;
		for (let i = 0; i < n; i++) {
			containerOffsets.push(totalX);
			totalX += containerWidths[i];
		}

		const regions = branchNames.map((_, i) => {
			const sequence = sequenceComponents[i];
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

			const branchText = Svg.element('text', {
				class: 'sqd-switch-branch-text',
				x: offsetX + connectorXs[i]+ PADDING_X,
				y: PADDING_TOP + LABEL_HEIGHT * 1.5 + CONNECTION_HEIGHT
			});
			branchText.textContent = branchNames[i];

			g.appendChild(region);
			g.appendChild(branchRect);
			g.appendChild(branchText);

			const sequenceX = offsetX + PADDING_X + Math.max((MIN_CHILDREN_WIDTH - sequence.view.width) / 2, 0);
			const sequenceY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT;
			Svg.translate(sequence.view.g, sequenceX, sequenceY);
			g.appendChild(sequence.view.g);

			const childEndY = PADDING_TOP + LABEL_HEIGHT * 2 + CONNECTION_HEIGHT + sequence.view.height;

			const fillingHeight = containerHeight - childEndY - CONNECTION_HEIGHT;
			if (fillingHeight > 0) {
				JoinRenderer.appendStraightJoin(g, new Vector(containerOffsets[i] + connectorXs[i] + PADDING_X, childEndY), fillingHeight);
			}
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

		const nameText = Svg.element('text', {
			class: 'sqd-switch-name-text',
			x: containerWidths[0],
			y: PADDING_TOP + LABEL_HEIGHT / 2
		});
		nameText.textContent = step.name;

		g.appendChild(nameRect);
		g.appendChild(nameText);

		JoinRenderer.appendStraightJoin(g, new Vector(containerWidths[0], 0), PADDING_TOP);

		const ds2 = INPUT_SIZE / 2;
		const input = Svg.element('path', {
			d: `M ${ds2} 0 L ${INPUT_SIZE} ${ds2} L ${ds2} ${INPUT_SIZE} L 0 ${ds2} Z`,
			transform: `translate(${containerWidths[0] - INPUT_SIZE / 2} ${-INPUT_SIZE / 2})`,
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
			containerOffsets.map((o, i) => new Vector(o + connectorXs[i] + PADDING_X, PADDING_TOP + CONNECTION_HEIGHT + LABEL_HEIGHT * 2 + maxChildHeight)));

		return new SwitchStepComponentView(g, containersWidth, containerHeight, containerWidths[0], regions, input);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly regions: SVGRectElement[],
		private readonly input: SVGPathElement) {
	}

	public getPosition(): Vector {
		const rect = this.regions[0].getBoundingClientRect();
		return new Vector(rect.x, rect.y);
	}

	public containsElement(element: Element): boolean {
		return this.g.contains(element);
	}

	public setIsMoving(isEnabled: boolean) {
		Svg.attrs(this.input, {
			visibility: isEnabled ? 'hidden' : 'visible'
		});
	}

	public setIsSelected(isSelected: boolean) {
		if (isSelected) {
			this.regions.forEach(r => r.classList.add('sqd-selected'));
		} else {
			this.regions.forEach(r => r.classList.remove('sqd-selected'));
		}
	}

	public setIsDisabled(isDisabled: boolean) {
		if (isDisabled) {
			this.g.classList.add('sqd-disabled');
		} else {
			this.g.classList.remove('sqd-disabled');
		}
	}
}
