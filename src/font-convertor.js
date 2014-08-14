'use strict';

var fs = require('fs');
var path = require('path');

var ttf2eot = require('../lib/ttf2eot');
var ttf2woff = require('../lib/ttf2woff');
//var ttf2svg = require('../lib/ttf2svg');


var FontConvertor = function (ttfFile) {

	var dirname = path.dirname(ttfFile);
	var extname = path.extname(ttfFile);
	var basename = path.basename(ttfFile, extname);

	if (extname.toLocaleLowerCase() !== '.ttf') {
	  console.error("Only accept .ttf file");
	  process.exit(1);
	}

	this._out = path.join(dirname, basename);

	try {
	  this._ttf = fs.readFileSync(ttfFile);
	} catch(e) {
	  console.error("Can't open input file");
	  process.exit(1);
	}
}

FontConvertor.prototype = {

	constructor: FontConvertor,

	toEot: function (outfile) {
		outfile = outfile || this._out + '.eot';

		var ttf = new Uint8Array(this._ttf);
		var eot = new Buffer(ttf2eot(ttf).buffer);

		fs.writeFileSync(outfile, eot);
	},

	toWoff: function (outfile) {
		outfile = outfile || this._out + '.woff';

		var ttf = new Uint8Array(this._ttf);
		var woff = new Buffer(ttf2woff(ttf).buffer);

		fs.writeFileSync(outfile, woff);
	}/*,
	// 库不可用
	toSvg: function (outfile) {
		outfile = outfile || this._out + '.svg';

		var ttf = this._ttf;
		var svg = ttf2svg(ttf);

		fs.writeFileSync(outfile, svg, 'utf-8');
	}*/

};

module.exports = FontConvertor;