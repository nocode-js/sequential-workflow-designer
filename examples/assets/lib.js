/* global location, document */

function isTestEnv() {
	const hostname = location.hostname.toLowerCase();
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
}

function embedScript(url) {
	document.write(`<script src="${url}"></script>`);
}

function embedStylesheet(url) {
	document.write(`<link href="${url}" rel="stylesheet">`);
}

const baseUrl = isTestEnv() ? '../designer' : '//cdn.jsdelivr.net/npm/sequential-workflow-designer@0.34.1';

embedScript(`${baseUrl}/dist/index.umd.js`);
embedStylesheet(`${baseUrl}/css/designer.css`);
embedStylesheet(`${baseUrl}/css/designer-light.css`);
embedStylesheet(`${baseUrl}/css/designer-soft.css`);
embedStylesheet(`${baseUrl}/css/designer-dark.css`);
