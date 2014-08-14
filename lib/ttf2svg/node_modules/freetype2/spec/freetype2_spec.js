var fs = require('fs'),
    freeTypePath = '../build/Release/freetype2';

describe('freetype', function() {
  it('loads successfully via require()', function() {
    var loadFreeType = function() {
      var ft = require(freeTypePath);
    };

    expect(loadFreeType).not.toThrow();
  });
});

describe('freetype.parse()', function() {
  var ft;

  beforeEach(function() {
    ft = require(freeTypePath);
  });

  var isValidFontFaceObject = function(fontFace) {
    var expectedOwnProperties = [
      'num_faces',
      'face_index',
      'face_flags',
      'style_flags',
      'num_glyphs',
      'family_name',
      'style_name',
      'num_fixed_sizes',
      'num_charmaps',
      'units_per_EM',
      'ascender',
      'descender',
      'height',
      'max_advance_width',
      'max_advance_height',
      'underline_position',
      'underline_thickness',
      'available_characters'
    ];

    expectedOwnProperties.forEach(function(p) {
      expect(fontFace.hasOwnProperty(p)).toBe(true);
    });
  };

  it ('supports .otf', function() {
    var parseFont = function() {
      var f = ft.parse(fs.readFileSync(__dirname + '/fonts/OpenBaskerville-0.0.53/OpenBaskerville-0.0.53.otf'));
      isValidFontFaceObject(f);
    };

    expect(parseFont).not.toThrow();
  });

  it ('supports .ttf', function() {
    var parseFont = function() {
      var f = ft.parse(fs.readFileSync(__dirname + '/fonts/OpenBaskerville-0.0.53/OpenBaskerville-0.0.53.ttf'));
      isValidFontFaceObject(f);
    };

    expect(parseFont).not.toThrow();
  });

  it ('supports .woff', function() {
    var parseFont = function() {
      var f = ft.parse(fs.readFileSync(__dirname + '/fonts/OpenBaskerville-0.0.53/OpenBaskerville-0.0.53.woff'));
      isValidFontFaceObject(f);
    };

    expect(parseFont).not.toThrow();
  });
});
