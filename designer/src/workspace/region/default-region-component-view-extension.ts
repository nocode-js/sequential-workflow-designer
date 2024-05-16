import {
	RegionComponentViewExtension,
	RegionComponentViewContentFactory,
	StepComponentViewContext,
	StepContext
} from '../../designer-extension';
import { ComponentDom } from '../common-views';
import { StepComponentView } from '../component';
import { DefaultRegionView } from './default-region-view';

export class DefaultRegionComponentViewExtension implements RegionComponentViewExtension {
	public create(
		parentElement: SVGElement,
		componentClassName: string,
		stepContext: StepContext,
		_: StepComponentViewContext,
		contentFactory: RegionComponentViewContentFactory
	): StepComponentView {
		const g = ComponentDom.stepG(componentClassName, stepContext.step.type, stepContext.step.id);
		parentElement.appendChild(g);
		return contentFactory(g, DefaultRegionView.create);
	}
}
