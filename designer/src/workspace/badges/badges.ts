import { ComponentContext } from '../../component-context';
import { Dom, Vector } from '../../core';
import { StepContext } from '../../designer-extension';
import { Badge, BadgesResult, ClickCommand, ClickDetails, StepComponentView } from '../component';

const BADGE_GAP = 4;

export class Badges {
	public static createForStep(stepContext: StepContext, view: StepComponentView, componentContext: ComponentContext): Badges {
		const g = createG(view.g);
		const badges = componentContext.services.badges.map(ext => ext.createForStep(g, stepContext, componentContext));
		const position = new Vector(view.width, 0);
		return new Badges(g, position, badges);
	}

	public static createForRoot(parentElement: SVGGElement, position: Vector, componentContext: ComponentContext): Badges {
		const g = createG(parentElement);
		const badges = componentContext.services.badges.map(ext => {
			return ext.createForRoot ? ext.createForRoot(g, componentContext) : null;
		});
		return new Badges(g, position, badges);
	}

	private constructor(private readonly g: SVGGElement, private readonly position: Vector, private readonly badges: (Badge | null)[]) {}

	public update(result: BadgesResult) {
		const count = this.badges.length;
		for (let i = 0; i < count; i++) {
			const badge = this.badges[i];
			if (badge) {
				result[i] = badge.update(result[i]);
			}
		}

		let offsetX = 0;
		let maxHeight = 0;
		let j = 0;
		for (let i = 0; i < count; i++) {
			const badge = this.badges[i];
			if (badge && badge.view) {
				offsetX += j === 0 ? badge.view.width / 2 : badge.view.width;
				maxHeight = Math.max(maxHeight, badge.view.height);
				Dom.translate(badge.view.g, -offsetX, 0);
				offsetX += BADGE_GAP;
				j++;
			}
		}

		Dom.translate(this.g, this.position.x, this.position.y + -maxHeight / 2);
	}

	public resolveClick(click: ClickDetails): ClickCommand | null {
		for (const badge of this.badges) {
			const command = badge && badge.resolveClick(click);
			if (command) {
				return command;
			}
		}
		return null;
	}
}

function createG(parentElement: SVGGElement): SVGGElement {
	const g = Dom.svg('g', {
		class: 'sqd-badges'
	});
	parentElement.appendChild(g);
	return g;
}
