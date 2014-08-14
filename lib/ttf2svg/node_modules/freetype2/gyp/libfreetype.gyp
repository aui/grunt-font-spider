{
  'targets': [
    {
      'target_name': 'libfreetype',
      'type': 'static_library',
      'defines': [
        'FT2_BUILD_LIBRARY',
      ],
      'include_dirs': [
        '../vendor/freetype/include/',
      ],
      'sources': [
        # From vendor/freetype/docs/INSTALL.ANY
        # This is for the default config. If we want to customize the config, we
        # need to create a custom ftconfig.h with the appropriate definitions
        # according to vendor/freetype/docs/CUSTOMIZING.

        # base components (required)
        '../vendor/freetype/src/base/ftsystem.c',
        '../vendor/freetype/src/base/ftinit.c',
        '../vendor/freetype/src/base/ftdebug.c',

        '../vendor/freetype/src/base/ftbase.c',

        '../vendor/freetype/src/base/ftbbox.c',       # recommended, see <ftbbox.h>
        '../vendor/freetype/src/base/ftglyph.c',      # recommended, see <ftglyph.h>

        '../vendor/freetype/src/base/ftbdf.c',        # optional, see <ftbdf.h>
        '../vendor/freetype/src/base/ftbitmap.c',     # optional, see <ftbitmap.h>
        '../vendor/freetype/src/base/ftcid.c',        # optional, see <ftcid.h>
        '../vendor/freetype/src/base/ftfstype.c',     # optional
        '../vendor/freetype/src/base/ftgasp.c',       # optional, see <ftgasp.h>
        '../vendor/freetype/src/base/ftgxval.c',      # optional, see <ftgxval.h>
        '../vendor/freetype/src/base/ftlcdfil.c',     # optional, see <ftlcdfil.h>
        '../vendor/freetype/src/base/ftmm.c',         # optional, see <ftmm.h>
        '../vendor/freetype/src/base/ftotval.c',      # optional, see <ftotval.h>
        '../vendor/freetype/src/base/ftpatent.c',     # optional
        '../vendor/freetype/src/base/ftpfr.c',        # optional, see <ftpfr.h>
        '../vendor/freetype/src/base/ftstroke.c',     # optional, see <ftstroke.h>
        '../vendor/freetype/src/base/ftsynth.c',      # optional, see <ftsynth.h>
        '../vendor/freetype/src/base/fttype1.c',      # optional, see <t1tables.h>
        '../vendor/freetype/src/base/ftwinfnt.c',     # optional, see <ftwinfnt.h>
        '../vendor/freetype/src/base/ftxf86.c',       # optional, see <ftxf86.h>

        # font drivers (optional; at least one is needed)
        '../vendor/freetype/src/bdf/bdf.c',           # BDF font driver
        '../vendor/freetype/src/cff/cff.c',           # CFF/OpenType font driver
        '../vendor/freetype/src/cid/type1cid.c',      # Type 1 CID-keyed font driver
        '../vendor/freetype/src/pcf/pcf.c',           # PCF font driver
        '../vendor/freetype/src/pfr/pfr.c',           # PFR/TrueDoc font driver
        '../vendor/freetype/src/sfnt/sfnt.c',         # SFNT files support (TrueType & OpenType)
        '../vendor/freetype/src/truetype/truetype.c', # TrueType font driver
        '../vendor/freetype/src/type1/type1.c',       # Type 1 font driver
        '../vendor/freetype/src/type42/type42.c',     # Type 42 font driver
        '../vendor/freetype/src/winfonts/winfnt.c',   # Windows FONT / FNT font driver

        # rasterizers (optional; at least one is needed for vector formats)
        '../vendor/freetype/src/raster/raster.c',     # monochrome rasterizer
        '../vendor/freetype/src/smooth/smooth.c',     # anti-aliasing rasterizer

        # auxiliary modules (optional)
        '../vendor/freetype/src/autofit/autofit.c',   # auto hinting module
        '../vendor/freetype/src/cache/ftcache.c',     # cache sub-system (in beta)
        '../vendor/freetype/src/gzip/ftgzip.c',       # support for compressed fonts (.gz)
        '../vendor/freetype/src/lzw/ftlzw.c',         # support for compressed fonts (.Z)
        '../vendor/freetype/src/bzip2/ftbzip2.c',     # support for compressed fonts (.bz2)
        '../vendor/freetype/src/gxvalid/gxvalid.c',   # TrueTypeGX/AAT table validation
        '../vendor/freetype/src/otvalid/otvalid.c',   # OpenType table validation
        '../vendor/freetype/src/psaux/psaux.c',       # PostScript Type 1 parsing
        '../vendor/freetype/src/pshinter/pshinter.c', # PS hinting module
        '../vendor/freetype/src/psnames/psnames.c',   # PostScript glyph names support
      ],
      'conditions': [
        [ 'OS=="mac"', {
          'sources': [
            '../vendor/freetype/src/base/ftmac.c',        # only on the Macintosh
          ],
        }],
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          '../vendor/freetype/include',
        ],
      },
    }
  ]
}
