import { Dom } from '../core/dom';
import { readMousePosition, readTouchPosition } from '../core/event-readers';
import { Vector } from '../core/vector';

const listenerOptions: AddEventListenerOptions & EventListenerOptions = {
	passive: false
};

export class ScrollBoxView {
	public static create(parent: HTMLElement, viewport: HTMLElement): ScrollBoxView {
		const root = Dom.element('div', {
			class: 'sqd-scrollbox'
		});
		parent.appendChild(root);

		const view = new ScrollBoxView(root, viewport);
		window.addEventListener('resize', view.onResize, false);
		root.addEventListener('wheel', e => view.onWheel(e), listenerOptions);
		root.addEventListener('touchstart', e => view.onTouchStart(e), listenerOptions);
		root.addEventListener('mousedown', e => view.onMouseDown(e), false);
		return view;
	}

	private content?: {
		element: HTMLElement;
		height: number;
	};
	private scroll?: {
		startPositionY: number;
		startScrollTop: number;
	};

	public constructor(private readonly root: HTMLElement, private readonly viewport: HTMLElement) {}

	public setContent(element: HTMLElement) {
		if (this.content) {
			this.root.removeChild(this.content.element);
		}
		element.classList.add('sqd-scrollbox-body');
		this.root.appendChild(element);
		this.reload(element);
	}

	public refresh() {
		if (this.content) {
			this.reload(this.content.element);
		}
	}

	public destroy() {
		window.removeEventListener('resize', this.onResize, false);
	}

	private reload(element: HTMLElement) {
		const maxHeightPercent = 0.7;
		const minDistance = 206;

		let height = Math.min(this.viewport.clientHeight * maxHeightPercent, element.clientHeight);
		height = Math.min(height, this.viewport.clientHeight - minDistance);

		this.root.style.height = height + 'px';
		element.style.top = '0px';

		this.content = {
			element,
			height
		};
	}

	private readonly onResize = () => {
		this.refresh();
	};

	private onWheel(e: WheelEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (this.content) {
			const delta = e.deltaY > 0 ? -25 : 25;
			const scrollTop = this.getScrollTop();
			this.setScrollTop(scrollTop + delta);
		}
	}

	private readonly onTouchStart = (e: TouchEvent) => {
		e.preventDefault();
		this.startScroll(readTouchPosition(e));
	};

	private readonly onMouseDown = (e: MouseEvent) => {
		this.startScroll(readMousePosition(e));
	};

	private readonly onTouchMove = (e: TouchEvent) => {
		e.preventDefault();
		this.moveScroll(readTouchPosition(e));
	};

	private readonly onMouseMove = (e: MouseEvent) => {
		e.preventDefault();
		this.moveScroll(readMousePosition(e));
	};

	private readonly onTouchEnd = (e: TouchEvent) => {
		e.preventDefault();
		this.stopScroll();
	};

	private readonly onMouseUp = (e: MouseEvent) => {
		e.preventDefault();
		this.stopScroll();
	};

	private startScroll(startPosition: Vector) {
		if (!this.scroll) {
			window.addEventListener('touchmove', this.onTouchMove, listenerOptions);
			window.addEventListener('mousemove', this.onMouseMove, false);
			window.addEventListener('touchend', this.onTouchEnd, listenerOptions);
			window.addEventListener('mouseup', this.onMouseUp, false);
		}

		this.scroll = {
			startPositionY: startPosition.y,
			startScrollTop: this.getScrollTop()
		};
	}

	private moveScroll(position: Vector) {
		if (this.scroll) {
			const delta = position.y - this.scroll.startPositionY;
			this.setScrollTop(this.scroll.startScrollTop + delta);
		}
	}

	private stopScroll() {
		if (this.scroll) {
			window.removeEventListener('touchmove', this.onTouchMove, listenerOptions);
			window.removeEventListener('mousemove', this.onMouseMove, false);
			window.removeEventListener('touchend', this.onTouchEnd, listenerOptions);
			window.removeEventListener('mouseup', this.onMouseUp, false);
			this.scroll = undefined;
		}
	}

	private getScrollTop(): number {
		if (this.content && this.content.element.style.top) {
			return parseInt(this.content.element.style.top);
		}
		return 0;
	}

	private setScrollTop(scrollTop: number) {
		if (this.content) {
			const max = this.content.element.clientHeight - this.content.height;
			const limited = Math.max(Math.min(scrollTop, 0), -max);
			this.content.element.style.top = limited + 'px';
		}
	}
}
