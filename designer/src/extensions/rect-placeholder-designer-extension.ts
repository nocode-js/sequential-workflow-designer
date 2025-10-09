import { DesignerExtension, PlaceholderExtension } from '../designer-extension';
import { RectPlaceholderConfiguration } from '../workspace';
import { RectPlaceholderExtension } from '../workspace/placeholder/rect-placeholder-extension';

export class RectPlaceholderDesignerExtension implements DesignerExtension {
	public static create(configuration?: RectPlaceholderConfiguration): RectPlaceholderDesignerExtension {
		return new RectPlaceholderDesignerExtension(RectPlaceholderExtension.create(configuration));
	}

	private constructor(public readonly placeholder: PlaceholderExtension) {}
}
