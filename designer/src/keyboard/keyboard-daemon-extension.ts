import { DaemonExtension } from '../designer-extension';
import { KeyboardDaemon } from './keyboard-daemon';

export class KeyboardDaemonExtension implements DaemonExtension {
	public readonly create = KeyboardDaemon.create;
}
