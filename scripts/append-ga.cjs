const fs = require('fs');
const path = require('path');

const SCRIPT =
`<script async src="https://www.googletagmanager.com/gtag/js?id=G-VEX4DMT3BZ"></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', 'G-VEX4DMT3BZ');
</script>`;

function appendGa(path) {
	let html = fs.readFileSync(path, 'utf8');
	if (html.includes(SCRIPT)) {
		console.log(`👌 ${path} already has tracking`);
		return;
	}
	const pos = html.lastIndexOf('</body>');
	if (pos < 0) {
		throw new Error('Could not find </body> tag');
	}
	html = html.substring(0, pos) + SCRIPT + html.substring(pos);
	fs.writeFileSync(path, html, 'utf8');
	console.log(`✅ ${path} updated`);
}

const directory = process.argv[2];
if (!directory) {
	throw new Error('Please specify a directory');
}

const dirPath = path.join(__dirname, '..', directory);
fs.readdir(dirPath, (_, files) => {
	files.forEach(file => {
		if (file.endsWith('.html')) {
			const filePath = path.join(dirPath, file);
			appendGa(filePath);
		}
	});
});
