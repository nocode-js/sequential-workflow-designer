const fs = require('fs');

const json = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
json['dependencies']['sequential-workflow-designer'] = 'file:../../designer';
json['dependencies']['sequential-workflow-designer-angular'] = 'file:../../angular/designer-dist';

fs.writeFileSync('../package.json', JSON.stringify(json, null, '\t'), 'utf8');
