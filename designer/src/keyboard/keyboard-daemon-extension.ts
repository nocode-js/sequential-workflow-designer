import { DesignerApi } from '../api';
import { KeyboardConfiguration } from '../designer-configuration';
import { DaemonExtension } from '../designer-extension';
import { KeyboardDaemon } from './keyboard-daemon';

export class KeyboardDaemonExtension implements DaemonExtension {
	public static create(configuration: undefined | true | KeyboardConfiguration) {
		if (configuration === undefined || configuration === true) {
			configuration = {};
		}
		return new KeyboardDaemonExtension(configuration);
	}

	private constructor(private readonly configuration: KeyboardConfiguration) {}

	public create(api: DesignerApi) {
		return KeyboardDaemon.create(api, this.configuration);
	}
}
