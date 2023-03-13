import { MutableRefObject } from 'react';
import ReactDOM from 'react-dom/client';

export class Presenter {
	public static render(className: string, rootRef: MutableRefObject<ReactDOM.Root | null>, element: JSX.Element): HTMLElement {
		Presenter.tryDestroy(rootRef);

		const container = document.createElement('div');
		container.className = className;
		rootRef.current = ReactDOM.createRoot(container);
		rootRef.current.render(element);
		return container;
	}

	public static tryDestroy(rootRef: MutableRefObject<ReactDOM.Root | null>) {
		if (rootRef.current) {
			const oldRoot = rootRef.current;
			rootRef.current = null;
			setTimeout(() => oldRoot.unmount());
		}
	}
}
