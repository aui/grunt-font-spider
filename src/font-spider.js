'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var jsdom = require('jsdom');
var css = require('css');


var FontSpider = function (options) {
	options = options || {};

	this._debug = options.debug;
	this._files = {};
	this._chars = {};
	this._cssFiles = {};
};

FontSpider.prototype = {

	constructor: FontSpider,

	/**
	 * 加载并分析 HTML 文件
	 * @param	{Array, String}	HTML 文件列表
	 * @param	{Function}		回调
	 */
	load: function (htmlFiles, callback) {
		var that = this;

		if (typeof htmlFiles === 'string') {
			htmlFiles = [htmlFiles];
		}

		async.each(htmlFiles, function (htmlFile, callback) {

			htmlFile = path.resolve(htmlFile);

			jsdom.env({
				file: htmlFile,
				done: function (errors, window) {
					if (errors) {
						throw errors;
					}


					that._htmlParser(htmlFile, window);
					window.close();

					callback();
				}
			});
			
		}, function (errors) {
			if (errors) {
				throw errors;
			}
			var result = that._getResult();
			that._log('result', result);

			callback(result);
		});
	},



	_getResult: function () {

		var familyName;
		var list = [];
		var hashmap;
		var files = this._files;
		var chars = this._chars;
		var fn = function (val) {
			if (hashmap[val]) {
				return false;
			} else {
				hashmap[val] = true;
				return true;
			}
		};

		// 对文本进行除重操作
		for (familyName in chars) {
			hashmap = {};
			chars[familyName] = chars[familyName].split('').filter(fn).join('');
			hashmap = null;
		}


		for (familyName in files) {
			if (chars[familyName]) {
				list.push({
					name: familyName,
					chars: chars[familyName],
					files: files[familyName]
				});
			}
		}

		/*
			[
				{	
					// 字体名称
		        	name: 'FZLTCXHJW--GB1-0',

		        	// 使用中的字符
		        	chars: '宁静致远helo wrd秋水共长天一色',

		        	// 字体路径
					files: ['/Users/tangbin/Documents/github/font/FZLTCXHJW--GB1-0.eot',
			            '/Users/tangbin/Documents/github/font/FZLTCXHJW--GB1-0.eot',
			            '/Users/tangbin/Documents/github/font/FZLTCXHJW--GB1-0.woff',
			            '/Users/tangbin/Documents/github/font/FZLTCXHJW--GB1-0.ttf',
			            '/Users/tangbin/Documents/github/font/FZLTCXHJW--GB1-0.svg'
			        ]
		        }
		    ]
		*/

		
		return list;
	},


	// 在 DOM 环境中提取信息
	_htmlParser: function (htmlFile, window) {

		var document = window.document;

		this._log('[HTML] document.URL', document.URL);
		
		var that = this;
		var htmlDir = path.dirname(htmlFile);
		var styleSheets = document.querySelectorAll('link[rel=stylesheet], style');
		
		
		var getComputedStyle = function (elem, name) {
			return elem.ownerDocument.defaultView
			.getComputedStyle(elem, null)
			.getPropertyValue(name);
		};


		var setCharsCache = function (data) {
			
			var cssSelectors = data.selectors.join(', ');
			var RE_CLASS = /\:(link|visited|hover|active|focus)\b/g;

			data.familys.forEach(function (family) {

				that._chars[family] = that._chars[family] || '';

				// 处理状态伪类
				var selectors = cssSelectors.replace(RE_CLASS, '');

				var elements = document.querySelectorAll(selectors);

				elements = Array.prototype.slice.call(elements);
				elements.forEach(function (element) {

					// 查询当前节点最终应用的字体（因为 css 选择器有优先级）
					//var familys = getComputedStyle(element, 'font-family');

					
					//if (familys.indexOf(family) !== -1) {// TODO: 这里要完善判断

						// 找到使用了字体的文本
						that._chars[family] += element.textContent;
					//}

				});
			});



			//that._log('[HTML] ' + JSON.stringify(cssSelectors), chars);

		};


		// 查询页面中所有样式表
		styleSheets = Array.prototype.slice.call(styleSheets);
		styleSheets.forEach(function (elem) {

			that._log('[HTML]', elem.outerHTML.replace(/>[\w\W]*<\//, '> ... <\/'));

			var cssInfo;
			var cssContent;
			var cssDir = htmlDir;
			var cssFile;


			if (elem.disabled) {
				return;
			}

			// link 标签
			if (elem.href) {
				
				cssFile = path.resolve(htmlDir, elem.href);
				cssDir = path.dirname(cssFile);

				if (!that._cssFiles[cssFile]) {
					cssContent = fs.readFileSync(cssFile, 'utf-8');
				}


			// style 标签
			} else {
				cssContent = elem.textContent;
			}


			if (cssFile && that._cssFiles[cssFile]) {
				cssInfo = that._cssFiles[cssFile];
			} else {
				// 根据 css 选择器查询使用了自定义字体的节点
				cssInfo = that._cssParser(cssContent, cssDir);
				cssInfo.files.forEach(function (data, cssFile) {
					that._files[data.name] = data.files;
					data.files.forEach(function (value, index) {
						data.files[index] = path.resolve(cssDir, value);
					});
				});

				// 记录已处理过的样式文件
				cssFile && (that._cssFiles[cssFile] = cssInfo);
			}

			// 提取 HTML 的文本
			cssInfo.selectors.forEach(setCharsCache);

			that._log('[CSS]', JSON.stringify(cssInfo, null, 4));

		});

	},


	// 提取 css 中要用到的信息
	_cssParser: function (string, base) {

		var that = this;
		var files = [];
		var selectors = [];

		var RE_URL = /url\(['"]?(.*?)['"]?\)/ig;
		var RE_SPLIT = /[#?].*$/g;
		var RE_QUOTATION = /^['"]|['"]$/g;
		var RE_SPLIT_COMMA = /\s*,\s*/;

		var ast = css.parse(string, {
			// silent: silently fail on parse errors.
			// source: the path to the file containing css.
			//		   Makes errors and source maps more helpful,
			//		   by letting them know where code comes from.
		});

		//console.log(JSON.stringify(ast, null, 4));

		var parser = function (rule) {

			switch (rule.type) {

				case 'import':
				
					var url = RE_URL.exec(rule['import'])[1];
					RE_URL.lastIndex = 0;

					var target = path.resolve(base, url);
					var cssContent = fs.readFileSync(target, 'utf-8');
					var cssInfo = that._cssParser(cssContent, path.dirname(target));

					files = files.concat(cssInfo.files);
					selectors = selectors.concat(cssInfo.selectors);

					//that._log('import', url);
					break;

				case 'font-face':

					var family = {
						name: '',
						files: []
					};

					rule.declarations.forEach(function (declaration) {
						var property = declaration.property;
						var value = declaration.value;
						switch (property) {
							case 'font-family':

								value = value.trim().replace(RE_QUOTATION, '');

								family.name = value;
								//that._log('font-family', value);
								
								break;

							case 'src':
								var url;

								while ((url = RE_URL.exec(value)) !== null) {
									url = url[1].replace(RE_SPLIT, '');
									family.files.push(url);
								}

								//that._log('files', family.files);
								break;
						}
					});

					files.push(family);

					break;

				case 'media':

					rule.rules.forEach(parser);
					break;

				case 'rule':

					//that._log('selectors', rule.selectors);

					var selector = {
						selectors: rule.selectors,// 注意：包含伪类选择器
						familys: [],
						content: ''
					};

					rule.declarations.forEach(function (declaration) {
						var property = declaration.property;
						var value = declaration.value;

						switch (property) {
							case 'font-family':

								value.split(RE_SPLIT_COMMA).forEach(function (val) {
									// 去掉空格与前后引号
									val = val.trim().replace(RE_QUOTATION, '');
									selector.familys.push(val);
								});

								//that._log('use "' + value + '"', rule.selectors);
								
								break;

							case 'content':
								// TODO: content 属性可以继承字体，这里需要深入处理
								//selector.content = value;
								//that._log('content', value);
								break;
						}
					});


					if (selector.familys.length) {
						selectors.push(selector);
					}
					break;
			}

		};

		ast.stylesheet.rules.forEach(parser);


		return {
			files: files,
			selectors: selectors
		};
	},

	_log: function () {
		if (this._debug) {
			console.log.apply(console, arguments);
		}
	}
};


module.exports = FontSpider;