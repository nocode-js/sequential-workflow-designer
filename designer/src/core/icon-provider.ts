import { StepDefinition, StepsConfiguration } from '../designer-configuration';

export class IconProvider {
	public constructor(private readonly configuration: StepsConfiguration) {}

	public getIconUrl(step: StepDefinition): string | null {
		if (this.configuration.iconUrlProvider) {
			return this.configuration.iconUrlProvider(step.componentType, step.type);
		}
		return null;
	}
}
