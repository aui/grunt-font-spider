{
  'targets': [
    {
      'target_name': 'freetype2',
      'dependencies': [
        'gyp/libfreetype.gyp:libfreetype'
      ],
      'sources': [
        'src/freetype2.cc',
        'src/fontface.cc'
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
    }
  ]
}
