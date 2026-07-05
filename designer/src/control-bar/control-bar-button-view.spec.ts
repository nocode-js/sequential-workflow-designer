import { Dom, Icons } from '../core';
import { ControlBarButtonView } from './control-bar-button-view';

describe('ControlBarButtonView', () => {
	it('creates button view', () => {
		const parent = Dom.element('div');
		const view = ControlBarButtonView.create(parent, Icons.close, 'Close', 'sqd-close');

		expect(view).toBeDefined();
		expect(view.button.parentElement).toEqual(parent);
		expect(view.button.classList.contains('sqd-control-bar-button')).toBeTrue();
		expect(view.button.classList.contains('sqd-close')).toBeTrue();
		expect(view.button.getAttribute('title')).toEqual('Close');
		expect(view.button.children.length).toEqual(1);
		expect(view.button.children[0].classList.contains('sqd-control-bar-button-icon')).toBeTrue();
	});

	it('bindClick() binds click handler', () => {
		const parent = Dom.element('div');
		const view = ControlBarButtonView.create(parent, Icons.close, 'Close');
		const handler = jasmine.createSpy('handler');

		view.bindClick(handler);
		view.button.click();

		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('toggles disabled and hidden classes', () => {
		const parent = Dom.element('div');
		const view = ControlBarButtonView.create(parent, Icons.close, 'Close');

		view.setIsDisabled(true);
		view.setIsHidden(true);

		expect(view.button.classList.contains('sqd-disabled')).toBeTrue();
		expect(view.button.classList.contains('sqd-hidden')).toBeTrue();

		view.setIsDisabled(false);
		view.setIsHidden(false);

		expect(view.button.classList.contains('sqd-disabled')).toBeFalse();
		expect(view.button.classList.contains('sqd-hidden')).toBeFalse();
	});
});
