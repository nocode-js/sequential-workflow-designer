import '@testing-library/jest-dom';
import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', {
	value: {
		getRandomValues: (buffer: Uint8Array) => crypto.randomFillSync(buffer)
	}
});
