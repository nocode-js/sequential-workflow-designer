/* global document, Image, console, sequentialWorkflowDesigner */

function loadImage(url) {
	return new Promise(resolve => {
		const image = new Image();
		image.onload = () => {
			resolve(image);
		};
		image.onerror = e => {
			console.error(e);
		};
		image.src = url;
	});
}

function grayscaleImage(d) {
	for (let i = 0; i < d.length; i += 4) {
		const c = Math.floor((d[i] + d[i + 1] + d[i + 2]) / 3);
		d[i] = c;
		d[i + 1] = c;
		d[i + 2] = c;
	}
}

function reverseColor(d) {
	for (let i = 0; i < d.length; i += 4) {
		d[i] = 255 - d[i];
		d[i + 1] = 255 - d[i + 1];
		d[i + 2] = 255 - d[i + 2];
	}
}

function contrast(d, contrast) {
	const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
	for (let i = 0; i < d.length; i += 4) {
		d[i] = factor * (d[i] - 128) + 128;
		d[i + 1] = factor * (d[i + 1] - 128) + 128;
		d[i + 2] = factor * (d[i + 2] - 128) + 128;
	}
}

function shiftColor(d) {
	for (let i = 0; i < d.length; i += 4) {
		const c = d[i];
		d[i] = d[i + 1];
		d[i + 1] = d[i + 2];
		d[i + 2] = c;
	}
}

async function renderImage(definition) {
	const canvas = document.getElementById('preview');
	const context = canvas.getContext('2d');

	const image = await loadImage('./assets/image-bee.jpg');

	canvas.width = image.width;
	canvas.height = image.height;
	context.drawImage(image, 0, 0);
	const imageData = context.getImageData(0, 0, image.width, image.height);

	definition.sequence.forEach(step => {
		switch (step.type) {
			case 'grayscale':
				grayscaleImage(imageData.data);
				break;
			case 'reverse-color':
				reverseColor(imageData.data);
				break;
			case 'contrast':
				contrast(imageData.data, 50);
				break;
			case 'shift-color':
				shiftColor(imageData.data);
				break;
		}
	});

	context.putImageData(imageData, 0, 0);
}

function createTaskStep(id, type, name) {
	return {
		id,
		componentType: 'task',
		type,
		name,
		properties: {}
	};
}

const configuration = {
	theme: 'dark',
	undoStackSize: 10,

	toolbox: {
		groups: [
			{
				name: 'Filters',
				steps: [
					createTaskStep(null, 'grayscale', 'Grayscale'),
					createTaskStep(null, 'reverse-color', 'Reverse color'),
					createTaskStep(null, 'contrast', 'Contrast'),
					createTaskStep(null, 'shift-color', 'Shift color')
				]
			}
		]
	},

	steps: {
		iconUrlProvider: () => {
			return `./assets/icon-filter.svg`;
		}
	},

	editors: false,
	controlBar: true
};

const startDefinition = {
	properties: {},
	sequence: [createTaskStep('00000000000000000000000000000001', 'contrast', 'Contrast')]
};

const placeholder = document.getElementById('designer');
const designer = sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);
designer.onDefinitionChanged.subscribe(() => {
	renderImage(designer.getDefinition());
});
renderImage(startDefinition);
