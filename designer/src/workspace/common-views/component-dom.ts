import { Dom } from '../../core';

export class ComponentDom {
	public static stepG(componentClassName: string, type: string, id: string): SVGGElement {
		return Dom.svg('g', {
			class: `sqd-step-${componentClassName} sqd-type-${type}`,
			'data-step-id': id
		});
	}
}
