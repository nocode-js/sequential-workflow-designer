import { DesignerExtension, RootComponentExtension } from '../designer-extension';
import { StartStopRootComponentExtension, StartStopRootComponentExtensionConfiguration } from '../workspace';

export class StartStopRootComponentDesignerExtension implements DesignerExtension {
	public static create(configuration: StartStopRootComponentExtensionConfiguration): DesignerExtension {
		return new StartStopRootComponentDesignerExtension(StartStopRootComponentExtension.create(configuration));
	}

	private constructor(public readonly rootComponent: RootComponentExtension) {}
}
