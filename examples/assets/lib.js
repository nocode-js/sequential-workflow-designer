/* global location, document */

function isTestEnv() {
	return location.hostname.toLowerCase() === 'localhost' ||
		location.hostname.startsWith('192.168.');
}

function embedScript(url) {
	document.write(`<script src="${url}"></script>`);
}

function embedStylesheet(url) {
	document.write(`<link href="${url}" rel="stylesheet">`);
}

const baseUrl = isTestEnv()
	? '..'
	: '//cdn.jsdelivr.net/npm/sequential-workflow-designer@0.1.5';

embedScript(`${baseUrl}/lib/designer.js`);
embedStylesheet(`${baseUrl}/css/designer.css`);
embedStylesheet(`${baseUrl}/css/designer-light.css`);
embedStylesheet(`${baseUrl}/css/designer-dark.css`);
