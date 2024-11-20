import { ComponentContext } from '../../component-context';
import { Dom, Vector } from '../../core';
import { BadgesDecorator, StepContext } from '../../designer-extension';
import { Badge, BadgesResult, ClickCommand, ClickDetails, StepComponentView } from '../component';
import { DefaultBadgesDecorator } from './default-badges-decorator';

export class Badges {
	public static createForStep(stepContext: StepContext, view: StepComponentView, componentContext: ComponentContext): Badges {
		const g = createG(view.g);
		const badges = componentContext.services.badges.map(ext => ext.createForStep(g, view, stepContext, componentContext));
		const decorator = componentContext.services.stepBadgesDecorator.create(g, view, badges);
		return new Badges(badges, decorator);
	}

	public static createForRoot(parentElement: SVGGElement, position: Vector, componentContext: ComponentContext): Badges {
		const g = createG(parentElement);
		const badges = componentContext.services.badges.map(ext => {
			return ext.createForRoot ? ext.createForRoot(g, componentContext) : null;
		});
		const decorator = new DefaultBadgesDecorator(position, badges, g);
		return new Badges(badges, decorator);
	}

	private constructor(
		private readonly badges: (Badge | null)[],
		private readonly decorator: BadgesDecorator
	) {}

	public update(result: BadgesResult) {
		const count = this.badges.length;
		for (let i = 0; i < count; i++) {
			const badge = this.badges[i];
			if (badge) {
				result[i] = badge.update(result[i]);
			}
		}
		this.decorator.update();
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
