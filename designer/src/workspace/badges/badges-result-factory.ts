import { Services } from '../../services';
import { BadgesResult } from '../component';

export class BadgesResultFactory {
	public static create(services: Services): BadgesResult {
		return services.badges.map(ext => ext.createStartValue());
	}
}
