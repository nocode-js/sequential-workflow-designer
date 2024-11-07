import { DesignerExtension, ViewportControllerExtension } from '../designer-extension';
import { DefaultViewportControllerExtension, DefaultViewportControllerExtensionConfiguration } from '../workspace';

export class DefaultViewportControllerDesignerExtension implements DesignerExtension {
	public static create(configuration: DefaultViewportControllerExtensionConfiguration): DesignerExtension {
		return new DefaultViewportControllerDesignerExtension(DefaultViewportControllerExtension.create(configuration));
	}

	private constructor(public readonly viewportController: ViewportControllerExtension) {}
}
