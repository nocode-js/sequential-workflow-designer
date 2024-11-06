import { WorkspaceApi } from '../../api';
import { ViewportControllerExtension } from '../../designer-extension';
import { DefaultViewportController } from './default-viewport-controller';
import { DefaultViewportControllerConfiguration } from './default-viewport-controller-configuration';

export type DefaultViewportControllerExtensionConfiguration = DefaultViewportControllerConfiguration;

export class DefaultViewportControllerExtension implements ViewportControllerExtension {
	public static create(configuration?: DefaultViewportControllerExtensionConfiguration): DefaultViewportControllerExtension {
		return new DefaultViewportControllerExtension(configuration);
	}

	private constructor(private readonly configuration: DefaultViewportControllerExtensionConfiguration | undefined) {}

	public create(api: WorkspaceApi): DefaultViewportController {
		return DefaultViewportController.create(api, this.configuration);
	}
}
