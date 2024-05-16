import { PreferenceStorage } from '../designer-configuration';

export class MemoryPreferenceStorage implements PreferenceStorage {
	private readonly map: Record<string, string> = {};

	public setItem(key: string, value: string) {
		this.map[key] = value;
	}

	public getItem(key: string): string | null {
		return this.map[key] ?? null;
	}
}
