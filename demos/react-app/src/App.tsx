import { useState } from 'react';
import { Playground } from './playground/Playground';
import { NativeEditors } from './nativeEditors/NativeEditors';
import { SaveRequiredEditor } from './saveRequiredEditor/SaveRequiredEditor';

const TABS = [
	{
		label: '🍭 Playground',
		path: 'playground'
	},
	{
		label: '🔌 Native Editors',
		path: 'native-editors'
	},
	{
		label: '🔴 Save Required Editor',
		path: 'save-required-editor'
	}
];

export function App() {
	const [path, setPath] = useState<string>(window.location.hash?.substring(1) || 'playground');

	function changePath(path: string) {
		window.location.hash = path;
		setPath(path);
	}

	return (
		<>
			<nav className="title-bar">
				<div className="column demo">
					Select Demo:{' '}
					<select defaultValue={path}>
						{TABS.map(t => (
							<option key={t.path} value={t.path} onClick={() => changePath(t.path)}>
								{t.label}
							</option>
						))}
					</select>
				</div>
				<div className="column link">
					<a href="https://github.com/nocode-js/sequential-workflow-designer/tree/main/react" className="github">
						SWD for React
					</a>
				</div>
			</nav>
			{path === 'playground' && <Playground />}
			{path === 'native-editors' && <NativeEditors />}
			{path === 'save-required-editor' && <SaveRequiredEditor />}
		</>
	);
}
