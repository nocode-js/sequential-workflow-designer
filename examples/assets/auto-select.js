/* global document, sequentialWorkflowDesigner */

function init(id, isAutoSelectDisabled) {
	const configuration = {
		steps: {
			iconUrlProvider: () => './assets/icon-task.svg',
			isAutoSelectDisabled
		},
		toolbox: {
			groups: [
				{
					name: 'Steps',
					steps: [
						{
							componentType: 'task',
							type: 'setValue',
							name: 'Set value',
							properties: {}
						}
					]
				}
			]
		},
		editors: false,
		controlBar: true
	};

	const startDefinition = {
		properties: {},
		sequence: []
	};

	const placeholder = document.getElementById(`designer${id}`);
	const viewport = document.getElementById(`viewport${id}`);
	const designer = sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);

	function set00Viewport() {
		designer.setViewport({
			scale: 1,
			position: new sequentialWorkflowDesigner.Vector(0, 0)
		});
	}

	function reloadViewport(vp) {
		const x = Math.round(vp.position.x);
		const y = Math.round(vp.position.x);
		const scale = vp.scale.toFixed(2);
		viewport.innerText = `Viewport x: ${x}, y: ${y}, scale: ${scale}`;
	}

	designer.onViewportChanged.subscribe(reloadViewport);
	viewport.addEventListener('click', set00Viewport, false);
	reloadViewport(designer.getViewport());
}

init('1', false);
init('2', true);
