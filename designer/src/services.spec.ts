import { ServicesResolver } from './services';

describe('ServicesResolver', () => {
	it('returns all properties with value', () => {
		const services = ServicesResolver.resolve([]) as Record<string, unknown>;

		for (const key of Object.keys(services)) {
			expect(services[key]).toBeDefined();
		}
	});
});
