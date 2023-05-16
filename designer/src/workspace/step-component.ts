import { ComponentContext } from '../component-context';
import { Sequence, Step } from '../definition';
import { StepContext } from '../designer-extension';
import { Badges } from './badges/badges';
import { BadgesResult, ClickDetails, ClickCommand, Component, Placeholder, StepComponentView, ClickCommandType } from './component';

export class StepComponent implements Component {
	public static create(view: StepComponentView, stepContext: StepContext, componentContext: ComponentContext) {
		const badges = Badges.createForStep(stepContext, view, componentContext);
		return new StepComponent(view, stepContext.step, stepContext.parentSequence, view.hasOutput(), badges);
	}

	private isDisabled = false;

	private constructor(
		public readonly view: StepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence,
		public readonly hasOutput: boolean,
		private readonly badges: Badges
	) {}

	public findById(stepId: string): StepComponent | null {
		if (this.step.id === stepId) {
			return this;
		}
		if (this.view.sequenceComponents) {
			for (const component of this.view.sequenceComponents) {
				const result = component.findById(stepId);
				if (result) {
					return result;
				}
			}
		}
		return null;
	}

	public resolveClick(click: ClickDetails): ClickCommand | null {
		if (this.view.sequenceComponents) {
			for (const component of this.view.sequenceComponents) {
				const result = component.resolveClick(click);
				if (result) {
					return result;
				}
			}
		}
		const badgeResult = this.badges.resolveClick(click);
		if (badgeResult) {
			return badgeResult;
		}
		const viewResult = this.view.resolveClick(click);
		if (viewResult) {
			return viewResult === true
				? {
						type: ClickCommandType.selectStep,
						component: this
				  }
				: viewResult;
		}
		return null;
	}

	public getPlaceholders(result: Placeholder[]) {
		if (!this.isDisabled) {
			if (this.view.sequenceComponents) {
				this.view.sequenceComponents.forEach(component => component.getPlaceholders(result));
			}
			if (this.view.placeholders) {
				this.view.placeholders.forEach(ph => result.push(ph));
			}
		}
	}

	public setIsDragging(isDragging: boolean) {
		if (!this.isDisabled) {
			if (this.view.sequenceComponents) {
				this.view.sequenceComponents.forEach(component => component.setIsDragging(isDragging));
			}
			if (this.view.placeholders) {
				this.view.placeholders.forEach(ph => ph.setIsVisible(isDragging));
			}
		}
		this.view.setIsDragging(isDragging);
	}

	public setIsSelected(isSelected: boolean) {
		this.view.setIsSelected(isSelected);
	}

	public setIsDisabled(isDisabled: boolean) {
		this.isDisabled = isDisabled;
		this.view.setIsDisabled(isDisabled);
	}

	public updateBadges(result: BadgesResult) {
		if (this.view.sequenceComponents) {
			this.view.sequenceComponents.forEach(component => component.updateBadges(result));
		}
		this.badges.update(result);
	}
}
