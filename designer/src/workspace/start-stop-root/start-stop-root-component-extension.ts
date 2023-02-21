import { RootComponentExtension } from '../../designer-extension';
import { StartStopRootComponent } from './start-stop-root-component';

export class StartStopRootComponentExtension implements RootComponentExtension {
	public readonly create = StartStopRootComponent.create;
}
