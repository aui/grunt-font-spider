# 字蛛-grunt插件

中文 WebFont 自动化压缩工具，它能自动分析页面使用的 WebFont 并进行按需压缩。

官方网站：<http://font-spider.org>

## 特性

相对于图片，WebFont 拥有更好的体验。它支持选中、搜索、翻译、朗读、缩放等，而字蛛作为一个 WebFont 压缩转码工具，拥有如下特性：

1. 按需压缩：数 MB 的中文字体可被压成几十 KB
2. 简单可靠：完全基于 CSS 规则，无需 js 与服务端辅助
3. 自动转码：支持 IE 与标准化的浏览器

## 安装

```shell
npm install grunt-font-spider --save-dev
```

## 使用范例

### 在 CSS 中声明字体

```css
/*声明 WebFont*/
@font-face {
  font-family: 'pinghei';
  src: url('../font/pinghei.eot');
  src:
    url('../font/pinghei.eot?#font-spider') format('embedded-opentype'),
    url('../font/pinghei.woff') format('woff'),
    url('../font/pinghei.ttf') format('truetype'),
    url('../font/pinghei.svg') format('svg');
  font-weight: normal;
  font-style: normal;
}

/*使用选择器指定字体*/
.home h1, .demo > .test {
    font-family: 'pinghei';
}
```

> 特别说明： `@font-face` 中的 `src` 定义的 .ttf 文件必须存在，其余的格式将由工具自动生成


### 配置示例

```javascript
module.exports = function(grunt) {
  grunt.initConfig({
     // 拷贝文件到发布目录，这样字体可被反复处理
    copy: {
      main: {
        src: './test/**',
        dest: './dest/'
      },
    },
     // 字蛛插件：压缩与转码静态页面中的 WebFont
    'font-spider': {
      options: {},
      main: {
        src: './dest/test/**/*.html'
      }
    }
  });
  grunt.loadNpmTasks('grunt-font-spider');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['copy', 'font-spider']);
};
```

### Options

名称 | 类型 | 默认值 | 说明
---- | ---- | ---- | -----
map | Array | [] | 映射 CSS 内部 HTTP 路径到本地。示例：[['http://demo.io/css', __dirname + '/css']]
ignore | Array | [] | 忽略的文件配置（可以是字体、CSS、HTML）。示例：['icons.ttf', '*.bk.css']
backup | Boolean | true | 是否备份字体
silent | Boolean | false | 不显示非关键错误

## 使用场景限制

- 不支持元素行内样式（仅支持 `<link>` 与 `<style>` 标签声明的样式）
- CSS `content` 属性插入的字符需要定义 `font-family`，不支持继承
- 不支持 javascript 动态插入的样式与元素节点
- 不支持 .otf 格式的字体

## 字体兼容性参考

格式 | IE | Firefox | Chrome | Safari | Opera | iOS Safari | Android Browser | Chrome for Android 
----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | -----
``.eot`` | 6  | -- | -- | -- | -- | -- | -- | --
``.woff`` | 9 | 3.6 | 5 | 5.1 | 11.1 | 5.1 | 4.4 | 36 
``.ttf`` | --  | 3.5 | 4 | 3.1 | 10.1 | 4.3 | 2.2 | 36
``.svg`` | -- | -- | 4 | 3.2 | 9.6 | 3.2 | 3 | 36

来源：<http://caniuse.com/#feat=fontface>


=============

*字体受版权保护，若在网页中使用商业字体，请联系相关字体厂商购买授权*
