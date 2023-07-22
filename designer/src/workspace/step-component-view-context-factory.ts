import { Sequence, Step } from '../definition';
import { ComponentContext } from '../component-context';
import { SequenceContext, StepComponentViewContext, StepContext } from '../designer-extension';

export class StepComponentViewContextFactory {
	public static create<S extends Step>(stepContext: StepContext<S>, componentContext: ComponentContext): StepComponentViewContext {
		return {
			getStepIconUrl: () => componentContext.iconProvider.getIconUrl(stepContext.step),
			createSequenceComponent: (parentElement: SVGElement, sequence: Sequence) => {
				const sequenceContext: SequenceContext = {
					sequence,
					depth: stepContext.depth + 1,
					isInputConnected: true,
					isOutputConnected: stepContext.isOutputConnected
				};
				return componentContext.services.sequenceComponent.create(parentElement, sequenceContext, componentContext);
			},
			createPlaceholderForArea: componentContext.services.placeholder.createForArea.bind(componentContext.services.placeholder)
		};
	}
}
