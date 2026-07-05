import { Dom, Icons } from '../core';

export class ControlBarButtonView {
	public static create(parent: HTMLElement, d: string, title: string, cls?: string): ControlBarButtonView {
		const button = Dom.element('div', {
			class: 'sqd-control-bar-button',
			title
		});
		if (cls) {
			button.classList.add(cls);
		}
		const icon = Icons.createSvg('sqd-control-bar-button-icon', d);
		button.appendChild(icon);
		parent.appendChild(button);
		return new ControlBarButtonView(button);
	}

	private constructor(public readonly button: HTMLElement) {}

	public bindClick(handler: () => void) {
		this.button.addEventListener(
			'click',
			e => {
				e.preventDefault();
				handler();
			},
			false
		);
	}

	public setIsDisabled(isDisabled: boolean) {
		Dom.toggleClass(this.button, isDisabled, 'sqd-disabled');
	}

	public setIsHidden(isHidden: boolean) {
		Dom.toggleClass(this.button, isHidden, 'sqd-hidden');
	}
}
