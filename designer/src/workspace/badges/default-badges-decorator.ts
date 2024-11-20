import { Dom, Vector } from '../../core';
import { BadgesDecorator } from '../../designer-extension';
import { Badge } from '../component';

const BADGE_GAP = 4;

export class DefaultBadgesDecorator implements BadgesDecorator {
	public constructor(
		private readonly position: Vector,
		private readonly badges: (Badge | null)[],
		private readonly g: SVGGElement
	) {}

	public update() {
		let offsetX = 0;
		let maxHeight = 0;
		let j = 0;
		for (let i = 0; i < this.badges.length; i++) {
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
}
