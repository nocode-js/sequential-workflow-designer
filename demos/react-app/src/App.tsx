import { useState } from 'react';
import { Playground } from './playground/Playground';
import { NativeEditors } from './nativeEditors/NativeEditors';

const pathKey = 'swdReactPath';
type AppPath = 'playground' | 'nativeEditors';

export function App() {
	const [path, setPath] = useState<AppPath>((localStorage[pathKey] as AppPath) || 'playground');

	function changePath(path: AppPath) {
		localStorage[pathKey] = path;
		setPath(path);
	}

	return (
		<>
			<nav>
				<h1>SWD for React Demo</h1>
				<button onClick={() => changePath('playground')} className={path === 'playground' ? 'selected' : ''}>
					Playground
				</button>
				<button onClick={() => changePath('nativeEditors')} className={path === 'nativeEditors' ? 'selected' : ''}>
					Native editors
				</button>
				<a href="https://github.com/nocode-js/sequential-workflow-designer/tree/main/react" className="github">
					GitHub
				</a>
			</nav>
			{path === 'playground' && <Playground />}
			{path === 'nativeEditors' && <NativeEditors />}
		</>
	);
}
