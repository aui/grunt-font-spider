# Node FreeType

[![Build Status](https://travis-ci.org/ericfreese/node-freetype2.png?branch=master)](https://travis-ci.org/ericfreese/node-freetype2)

A Node native addon that uses FreeType to parse font files.

FreeType is a freely available software library to render fonts. http://www.freetype.org/

## Install

`npm install freetype2`

## Usage

``` javascript
var fs = require('fs'),
    freetype = require('freetype2');

fs.readFile('/path/to/a/font.woff', function(err, buffer) {
  if (!!err) throw err;
  var fontface = freetype.parse(buffer);
  console.log(fontface);
});
```

The module exports a `parse` function, which takes the raw font file data and returns a `FontFace` object with the following properties:

    {
      num_faces: 1,
      face_index: 0,
      face_flags: 537,
      style_flags: 2,
      num_glyphs: 233,
      family_name: 'Nexa Bold',
      style_name: 'Regular',
      num_fixed_sizes: 0,
      num_charmaps: 4,
      units_per_EM: 1000,
      ascender: 750,
      descender: -250,
      height: 1000,
      max_advance_width: 1159,
      max_advance_height: 1000,
      underline_position: -100,
      underline_thickness: 50,
      available_characters: [ 32, 33, 34, 35, ... ]
    }

`available_characters` is an array of character values that the font maps to glyphs. Use `.toString(16)` to get a hex string representation.

Built for https://github.com/ericfreese/font-viewer.
