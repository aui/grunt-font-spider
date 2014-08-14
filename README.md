#	“字蛛”-中文字体压缩工具

汉字字体文件平均每套 5M 大小，这严重阻碍其在 web 设计中的运用——而 font-spider（字蛛） 便是一款针对中文字体的压缩工具，它采用独特的分析算法，可大幅度的压缩字体文件体积，压缩率通常可以高达 95%。

##	工作原理

1.	爬行 html 文档，分析所有 css 语句
2.	记录``@font-face``语句声明的字体，并且记录使用改字体的 css 选择器
3.	通过 css 选择器查找 html 文档的节点，记录节点上的文本
4.	找到字体文件（.ttf）并分析字体，删除没有使用的字符
5.	生成新的 .ttf 与 .eot 字体格式实现全浏览器兼容

##	使用范例

###	css

```
@font-face {
  font-family: 'FZLTCXHJW--GB1-0';
  src: url('../font/FZLTCXHJW--GB1-0.eot');/*ie*/
  src: url('../font/FZLTCXHJW--GB1-0.ttf') format('truetype');/*现代浏览器*/
  font-weight: normal;
  font-style: normal;
}
```
字体格式兼容性参考：<http://caniuse.com/#feat=fontface>

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
    
	 // 智能压缩字体
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

##	环境依赖

windows 需要安装 perl 环境（字体处理依赖 perl，正在基于 js 重新实现..）

=============

若在网页中使用商业中文字体，请联系相关字体厂商购买使用权，尊重版权。