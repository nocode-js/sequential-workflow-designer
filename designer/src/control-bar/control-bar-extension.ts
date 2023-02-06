import { UiComponentExtension } from '../designer-extension';
import { ControlBar } from './control-bar';

export class ControlBarExtension implements UiComponentExtension {
	public readonly create = ControlBar.create;
}
