import { IconProvider } from './icon-provider';
import { createStepStub } from '../test-tools/stubs';

describe('IconProvider', () => {
	const testStep = createStepStub();

	it('forwards icon from provider', () => {
		const provider = new IconProvider({
			iconUrlProvider: () => {
				return 'assets/icon.gif';
			}
		});

		expect(provider.getIconUrl(testStep)).toBe('assets/icon.gif');
	});

	it('returns null if no provider', () => {
		const provider = new IconProvider({});

		expect(provider.getIconUrl(testStep)).toBeNull();
	});
});
