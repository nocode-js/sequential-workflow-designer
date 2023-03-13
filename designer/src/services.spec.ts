import { ServicesResolver } from './services';
import { createDesignerConfigurationStub } from './test-tools/stubs';

describe('ServicesResolver', () => {
	it('returns all properties with value', () => {
		const configuration = createDesignerConfigurationStub();
		const services = ServicesResolver.resolve([], configuration) as Record<string, unknown>;

		for (const key of Object.keys(services)) {
			expect(services[key]).toBeDefined();
		}
	});
});
