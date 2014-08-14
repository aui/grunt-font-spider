#ifndef FONTFACE_H
#define FONTFACE_H

#include <nan.h>
#include <vector>
#include <ft2build.h>
#include FT_FREETYPE_H

using namespace v8;

class FontFace : public node::ObjectWrap {
  public:
    static void Init();
    static Handle<Value> NewInstance(_NAN_METHOD_ARGS_TYPE args);

    FT_Face face;

  private:
    explicit FontFace(const FT_Byte* file_base, FT_Long file_size);
    ~FontFace();

    static NAN_METHOD(New);
    static Persistent<Function> constructor;

    static FT_Library library;
    void SetObjectProperties(Handle<Object> obj);
    std::vector<FT_UInt> AvailableCharacters();
};

#endif