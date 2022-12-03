import { Uid } from './uid';

describe('Uid', () => {
	it('next() returns unique ids', () => {
		const ids: string[] = [];

		for (let i = 0; i < 100; i++) {
			const id = Uid.next();
			expect(id.length).toEqual(32);
			expect(ids).not.toContain(id);
			ids.push(id);
		}
	});
});
