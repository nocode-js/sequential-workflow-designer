import { Uid } from './core/uid';

export class Utils {
	public static readonly nextId: () => string = Uid.next;
}
