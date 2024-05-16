import { Sequence, Step } from '../definition';
import { ComponentContext } from '../component-context';
import { SequenceContext, StepComponentViewContext, StepContext, RegionComponentViewContentFactory } from '../designer-extension';

export class StepComponentViewContextFactory {
	public static create<S extends Step>(stepContext: StepContext<S>, componentContext: ComponentContext): StepComponentViewContext {
		const preferenceKeyPrefix = stepContext.step.id + ':';

		return {
			i18n: componentContext.i18n,
			getStepIconUrl: () => componentContext.iconProvider.getIconUrl(stepContext.step),
			getStepName: () => componentContext.i18n(`step.${stepContext.step.type}.name`, stepContext.step.name),
			createSequenceComponent: (parentElement: SVGElement, sequence: Sequence) => {
				const sequenceContext: SequenceContext = {
					sequence,
					depth: stepContext.depth + 1,
					isInputConnected: true,
					isOutputConnected: stepContext.isOutputConnected
				};
				return componentContext.services.sequenceComponent.create(parentElement, sequenceContext, componentContext);
			},
			createRegionComponentView(
				parentElement: SVGElement,
				componentClassName: string,
				contentFactory: RegionComponentViewContentFactory
			) {
				return componentContext.services.regionComponentView.create(
					parentElement,
					componentClassName,
					stepContext,
					this,
					contentFactory
				);
			},
			createPlaceholderForArea: componentContext.services.placeholder.createForArea.bind(componentContext.services.placeholder),
			getPreference: (key: string) => componentContext.preferenceStorage.getItem(preferenceKeyPrefix + key),
			setPreference: (key: string, value: string) => componentContext.preferenceStorage.setItem(preferenceKeyPrefix + key, value)
		};
	}
}
