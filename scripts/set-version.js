const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version || !(/^\d+\.\d+\.\d+$/.test(version))) {
	console.log('Usage: node set-version.js 1.2.3');
	return;
}

function resolvePath(filePath) {
	return path.join(__dirname, '..', filePath);
}

function updatePackage(filePath) {
	filePath = resolvePath(filePath);
	const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

	json['version'] = version;
	for (const dependency in json['dependencies']) {
		if (dependency === 'sequential-workflow-designer') {
			json['dependencies'][dependency] = `^${version}`;
		}
	}

	fs.writeFileSync(filePath, JSON.stringify(json, null, '\t'), 'utf-8');
}

function updateJsdelivrUrl(filePath) {
	filePath = resolvePath(filePath);
	let text = fs.readFileSync(filePath, 'utf-8');

	text = text.replace(/\/\/cdn\.jsdelivr\.net\/npm\/sequential-workflow-designer@\d+\.\d+\.\d+/g, (found) => {
		const parts = found.split('@');
		return `${parts[0]}@${version}`;
	});

	fs.writeFileSync(filePath, text, 'utf-8');
}

updatePackage('designer/package.json');
updatePackage('react/package.json');
updatePackage('demos/react-app/package.json');
updateJsdelivrUrl('README.md');
updateJsdelivrUrl('examples/assets/lib.js');
