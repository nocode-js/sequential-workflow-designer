import { Vector } from '../../core';
import { BadgesDecorator, StepBadgesDecoratorExtension } from '../../designer-extension';
import { StepComponentView, Badge } from '../component';
import { DefaultBadgesDecorator } from './default-badges-decorator';

export class DefaultStepBadgesDecoratorExtension implements StepBadgesDecoratorExtension {
	public create(g: SVGGElement, view: StepComponentView, badges: (Badge | null)[]): BadgesDecorator {
		const position = new Vector(view.width, 0);
		return new DefaultBadgesDecorator(position, badges, g);
	}
}
