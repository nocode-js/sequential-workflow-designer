/* global window, document, console, localStorage, sequentialWorkflowDesigner */

const LANG = {
	es: {
		'controlBar.resetView': 'Reestablecer vista',
		'controlBar.zoomIn': 'Reestablecer vista',
		'controlBar.zoomOut': 'Disminuir el zoom',
		'controlBar.turnOnOffDragAndDrop': 'Activar/desactivar arrastrar y soltar',
		'controlBar.deleteSelectedStep': 'Eliminar paso seleccionado',
		'controlBar.undo': 'Deshacer',
		'controlBar.redo': 'Rehacer',
		'smartEditor.toggle': 'Alternar editor',
		'toolbox.title': 'Caja de herramientas',
		'toolbox.search': 'Buscar',
		'contextMenu.select': 'Seleccionar',
		'contextMenu.unselect': 'Deseleccionar',
		'contextMenu.delete': 'Eliminar',
		'contextMenu.resetView': 'Reestablecer vista',
		'contextMenu.duplicate': 'Duplicar',

		// Keys of steps
		'step.openDoor.name': 'Abrir puerta',
		'step.closeDoor.name': 'Cerrar puerta',
		'toolbox.item.openDoor.label': 'Abrir puerta',
		'toolbox.item.closeDoor.label': 'Cerrar puerta',

		// Keys of this example
		'_toolbox.group.tasks': 'Tareas',
		'_editor.pleaseSelectStep': 'Por favor seleccione cualquier paso.',
		'_editor.selectedStep': 'Paso seleccionado: '
	}
};

const uid = sequentialWorkflowDesigner.Uid.next;
const localStorageKey = 'sqdI18n';
let placeholder;
let designer = null;

function createOpenDoorStep() {
	return {
		id: uid(),
		componentType: 'task',
		type: 'openDoor',
		name: 'Open door',
		properties: {}
	};
}

function createCloseDoorStep() {
	return {
		id: uid(),
		componentType: 'task',
		type: 'closeDoor',
		name: 'Close door',
		properties: {}
	};
}

let definition = {
	properties: {},
	sequence: [createOpenDoorStep(), createCloseDoorStep()]
};

function createEditor(text) {
	const editor = document.createElement('div');
	editor.innerText = text;
	return editor;
}

function mount(lang) {
	if (designer) {
		designer.destroy();
		designer = null;
	}

	const i18n = (key, defaultValue) => {
		console.log(`(i18n) ${key} = ${defaultValue}`);
		return (LANG[lang] && LANG[lang][key]) || defaultValue;
	};
	const configuration = {
		undoStackSize: 5,
		toolbox: {
			groups: [
				{
					name: i18n('_toolbox.group.tasks', 'Tasks'),
					steps: [createOpenDoorStep(), createCloseDoorStep()]
				}
			]
		},
		steps: {
			iconUrlProvider: () => './assets/icon-task.svg',
			isDuplicable: () => true
		},
		editors: {
			rootEditorProvider: () => {
				return createEditor(i18n('_editor.pleaseSelectStep', 'Please select any step.'));
			},
			stepEditorProvider: step => {
				return createEditor(i18n('_editor.selectedStep', 'Selected step: ') + step.type);
			}
		},
		controlBar: true,
		i18n
	};
	designer = sequentialWorkflowDesigner.Designer.create(placeholder, definition, configuration);
	designer.onDefinitionChanged.subscribe(d => (definition = d));
}

window.addEventListener('load', () => {
	const languageSelect = document.getElementById('language');
	placeholder = document.getElementById('designer');

	if (localStorage[localStorageKey]) {
		languageSelect.value = localStorage[localStorageKey];
	}

	mount(languageSelect.value);

	languageSelect.addEventListener('change', () => {
		mount(languageSelect.value);
		localStorage[localStorageKey] = languageSelect.value;
	});
});
