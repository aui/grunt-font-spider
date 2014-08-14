#include <nan.h>
#include "fontface.h"

using namespace v8;

NAN_METHOD(CreateFontFace) {
  NanScope();
  NanReturnValue(FontFace::NewInstance(args));
}

void Init(Handle<Object> exports) {
  FontFace::Init();
  exports->Set(String::NewSymbol("parse"), FunctionTemplate::New(CreateFontFace)->GetFunction());
}

NODE_MODULE(freetype2, Init)
