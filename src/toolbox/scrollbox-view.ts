import { Dom } from '../core/dom';

export class ScrollBoxView {
	public static create(parent: HTMLElement, viewport: HTMLElement): ScrollBoxView {
		const root = Dom.element('div', {
			class: 'sqd-scrollbox'
		});
		parent.appendChild(root);

		const view = new ScrollBoxView(root, viewport);
		window.addEventListener('resize', view.onResizeHandler);
		root.addEventListener('wheel', e => view.onWheel(e));
		return view;
	}

	private readonly onResizeHandler = () => this.onResize();
	private current?: {
		content: HTMLElement;
		height: number;
	};

	public constructor(private readonly root: HTMLElement, private readonly viewport: HTMLElement) {}

	public setContent(content: HTMLElement) {
		if (this.current) {
			this.root.removeChild(this.current.content);
		}
		content.classList.add('sqd-scrollbox-body');
		this.root.appendChild(content);
		this.reload(content);
	}

	public refresh() {
		if (this.current) {
			this.reload(this.current.content);
		}
	}

	public destroy() {
		window.removeEventListener('resize', this.onResizeHandler);
	}

	private reload(content: HTMLElement) {
		const maxHeightPercent = 0.7;
		const minDistance = 200;

		let height = Math.min(this.viewport.clientHeight * maxHeightPercent, content.clientHeight);
		height = Math.min(height, this.viewport.clientHeight - minDistance);

		this.root.style.height = height + 'px';
		content.style.top = '0px';

		this.current = {
			content,
			height
		};
	}

	private onResize() {
		this.refresh();
	}

	private onWheel(e: WheelEvent) {
		e.preventDefault();
		e.stopPropagation();

		if (this.current) {
			const delta = e.deltaY > 0 ? -25 : 25;
			const currentY = this.readScrollY();
			this.setScrollY(currentY + delta);
		}
	}

	private readScrollY(): number {
		if (this.current && this.current.content.style.top) {
			return parseInt(this.current.content.style.top);
		}
		return 0;
	}

	private setScrollY(y: number) {
		if (this.current) {
			const maxY = this.current.content.clientHeight - this.current.height;
			const newTop = Math.max(Math.min(y, 0), -maxY);
			this.current.content.style.top = newTop + 'px';
		}
	}
}
