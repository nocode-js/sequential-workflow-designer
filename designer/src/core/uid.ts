export class Uid {
	public static next(): string {
		const bytes = new Uint8Array(16);
		window.crypto.getRandomValues(bytes);
		return Array.from(bytes, v => v.toString(16).padStart(2, '0')).join('');
	}
}
