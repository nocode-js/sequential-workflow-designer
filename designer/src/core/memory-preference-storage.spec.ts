import { MemoryPreferenceStorage } from './memory-preference-storage';

describe('MemoryPreferenceStorage', () => {
	it('remember a value', () => {
		const storage = new MemoryPreferenceStorage();

		expect(storage.getItem('key0')).toBeNull();

		storage.setItem('key0', 'value');

		expect(storage.getItem('key0')).toBe('value');
	});
});
