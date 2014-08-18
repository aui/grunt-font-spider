'use strict';

var fs = require('fs');
var path = require('path');

var ttf2eot = require('../lib/ttf2eot');
var ttf2woff = require('../lib/ttf2woff');
var ttf2svg = require('../lib/ttf2svg');

var FontConvertor = function (ttfFile) {

	var dirname = path.dirname(ttfFile);
	var extname = path.extname(ttfFile);
	var basename = path.basename(ttfFile, extname);

	if (extname.toLocaleLowerCase() !== '.ttf') {
		throw "Only accept .ttf file";
	}

	this._out = path.join(dirname, basename);
	this._ttf = fs.readFileSync(ttfFile);
}

FontConvertor.prototype = {

	constructor: FontConvertor,

	eot: function (outfile) {
		outfile = outfile || this._out + '.eot';

		var ttf = new Uint8Array(this._ttf);
		var eot = new Buffer(ttf2eot(ttf).buffer);

		fs.writeFileSync(outfile, eot);
	},

	woff: function (outfile) {
		outfile = outfile || this._out + '.woff';

		var ttf = new Uint8Array(this._ttf);
		var woff = new Buffer(ttf2woff(ttf).buffer);

		fs.writeFileSync(outfile, woff);
	},

	svg: function (outfile) {
		outfile = outfile || this._out + '.svg';

		var ttf = this._ttf;
		var svg = ttf2svg(ttf);

		fs.writeFileSync(outfile, svg);
	},

};

module.exports = FontConvertor;