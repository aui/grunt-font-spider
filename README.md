#	“字蛛”-中文字体压缩工具

字蛛是一款针对中文字体的压缩工具，它基于爬虫算法来提取本地页面、css 和字体的数据，最终可将几 MB 字体压成几十 KB 的大小。

至此，设计师可以大胆的将精美的中文字体运用在 web 设计中，而无需考虑字体体积以及工程成本。

##	工作原理

1.	爬行本地 html 文档，分析所有 css 语句
2.	记录``@font-face``语句声明的字体，并且记录使用该字体的 css 选择器
3.	通过 css 选择器的规则查找当前 html 文档的节点，记录节点上的文本
4.	找到字体文件并删除没被使用的字符
5.	生成多种字体格式

##	安装

依赖 [nodejs](http://nodejs.org) 与 [gruntjs](http://gruntjs.com)。windows 需要提前安装 [perl](http://www.perl.org) 环境。

```
npm install grunt-font-spider --save-dev
```

##	使用范例

### 在 css 中声明字体

```
@font-face {
  font-family: 'FZLTCXHJW--GB1-0';
  /*IE*/
  src: url('../font/FZLTCXHJW--GB1-0.eot');
  /*现代浏览器*/
  src:
    url('../font/FZLTCXHJW--GB1-0.woff') format('woff') 
    url('../font/FZLTCXHJW--GB1-0.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

声明字体后，可以使用``font-family``来使用该字体。

###	放置 .ttf 的字体文件

工具依赖 .ttf 格式的字体作为源文件来压缩，所以``@font-face``中的 src 定义 .ttf 字体必须存在（.eot 与 .woff 的字体可由工具自动生成）。

###	Gruntfile.js

```
module.exports = function(grunt) {
  grunt.initConfig({
	 // 拷贝文件到发布目录
    copy: {
      main: {
        src: './test/**',
        dest: './dest/'
      },
    },
    
	 // 压缩 html 中自定义字体
    'font-spider': {
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

##	开发规范

1.	HTML 样式表路径必须使用相对路径

##	字体兼容性参考

格式 | IE | Firefox | Chrome | Safari | Opera | iOS Safari | Android Browser | Chrome for Android | 
----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | -----
``.eot`` | 6  | -- | -- | -- | -- | -- | -- | --
``.woff`` | 9 | 3.6 | 5 | 5.1 | 11.1 | 5.1 | 4.4 | 36 
``.ttf`` | --  | 3.5 | 4 | 3.1 | 10.1 | 4.3 | 2.2 | 36
~~``.svg``~~ | -- | -- | 4 | 3.2 | 9.6 | 3.2 | 3 | 36

来源：<http://caniuse.com/#feat=fontface>

> 工具暂时不支持 .svg 格式输出

=============

版权声明：若在网页中使用商业中文字体，请联系相关字体厂商购买使用权再使用。