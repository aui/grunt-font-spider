#	“字蛛”-中文字体压缩工具

汉字字体文件平均每套 5M 大小，这严重阻碍其在 web 设计中的运用——而 font-spider（字蛛） 便是一款针对中文字体的压缩工具，它基于爬虫算法来抓取页面、css、字体的数据，通常可将字体压成几十 kb 的大小。

##	工作原理

1.	爬行 html 文档，分析所有 css 语句
2.	记录``@font-face``语句声明的字体，并且记录使用改字体的 css 选择器
3.	通过 css 选择器查找 html 文档的节点，记录节点上的文本
4.	找到字体文件（.ttf）并分析字体，删除没有使用的字符
5.	生成各个浏览器最佳字体格式

##	使用范例

###	css

#### 在 css 中声明字体

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

####	放置 .ttf 的字体文件

工具依赖 .ttf 格式的字体作为源文件来压缩，``@font-face``中的 src 定义 .ttf 字体必须存在（.eot 与 .woff 的字体可以没有，工具会自动生成）

> 字体格式兼容性参考：<http://caniuse.com/#feat=fontface>

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