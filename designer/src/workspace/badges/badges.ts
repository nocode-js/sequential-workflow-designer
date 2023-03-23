import { ComponentContext } from '../../component-context';
import { Dom } from '../../core';
import { StepContext } from '../../designer-extension';
import { Badge, BadgesResult, ClickCommand, ClickDetails, StepComponentView } from '../component';

const BADGE_GAP = 4;

export class Badges {
	public static create(stepContext: StepContext, view: StepComponentView, componentContext: ComponentContext): Badges {
		const g = Dom.svg('g', {
			class: 'sqd-badges'
		});
		view.g.appendChild(g);

		const badges = componentContext.services.badges.map(ext => ext.createBadge(g, stepContext, componentContext));
		return new Badges(g, view, badges);
	}

	private constructor(private readonly g: SVGGElement, private readonly view: StepComponentView, private readonly badges: Badge[]) {}

	public update(result: BadgesResult) {
		const count = this.badges.length;
		for (let i = 0; i < count; i++) {
			result[i] = this.badges[i].update(result[i]);
		}

		let offsetX = 0;
		let maxHeight = 0;
		let j = 0;
		for (let i = 0; i < count; i++) {
			const badge = this.badges[i];
			if (badge.view) {
				offsetX += j === 0 ? badge.view.width / 2 : badge.view.width;
				maxHeight = Math.max(maxHeight, badge.view.height);
				Dom.translate(badge.view.g, -offsetX, 0);
				offsetX += BADGE_GAP;
				j++;
			}
		}
		Dom.translate(this.g, this.view.width, -maxHeight / 2);
	}

	public resolveClick(click: ClickDetails): ClickCommand | null {
		for (const badge of this.badges) {
			const command = badge.resolveClick(click);
			if (command) {
				return command;
			}
		}
		return null;
	}
}
