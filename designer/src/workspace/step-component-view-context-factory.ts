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
			createStepComponent: (parentElement: SVGElement, parentSequence: Sequence, step: Step, position: number) => {
				return componentContext.stepComponentFactory.create(
					parentElement,
					{
						parentSequence,
						step,
						depth: stepContext.depth + 1,
						position,
						isInputConnected: stepContext.isInputConnected,
						isOutputConnected: stepContext.isOutputConnected,
						isPreview: stepContext.isPreview
					},
					componentContext
				);
			},
			createSequenceComponent: (parentElement: SVGElement, sequence: Sequence) => {
				const sequenceContext: SequenceContext = {
					sequence,
					depth: stepContext.depth + 1,
					isInputConnected: true,
					isOutputConnected: stepContext.isOutputConnected,
					isPreview: stepContext.isPreview
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
			getPlaceholderGapSize: orientation => componentContext.services.placeholder.getGapSize(orientation),
			createPlaceholderForGap: componentContext.services.placeholder.createForGap.bind(componentContext.services.placeholder),
			createPlaceholderForArea: componentContext.services.placeholder.createForArea.bind(componentContext.services.placeholder),
			getPreference: (key: string) => componentContext.preferenceStorage.getItem(preferenceKeyPrefix + key),
			setPreference: (key: string, value: string) => componentContext.preferenceStorage.setItem(preferenceKeyPrefix + key, value)
		};
	}
}
