Generates file hash to the JSON manifest file and generates new file name.

- Author: JsonZhou
- Author Blog: [http://www.2fz1.com/](http://www.2fz1.com/)

## Install

	npm install --save-dev gulp-hash-list
	
## Usage

	var gulp = require('gulp');
	var hash = require('gulp-hash-list');
	
	gulp.task('hash', function() {
	    return gulp.src(['./src/**/*.js','./src/**/*.css'])
	        .pipe(hash({
	            "template": "{name}{ext}?hash={hash}"
	        }))
	        .pipe(gulp.dest('./dist'))
	        .pipe(hash.manifest('assets.json'))
	        .pipe(gulp.dest('./manifest'));
	});
	
## API

### hash(options)

|option|default|description|
|---|---|---|
|algorithm|sha1|[crypto.createHash(algorithm)](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm)|
|hashLength|8|hash string length|
|template|{name}{ext}?hash={hash}|file name template|

### options.template

|name| description |
|---|---|
|{name}|file name|
|{ext)|file extension, **Required**|
|{hash}| file contents hash|
|{size}| file size|
|{atime}|Access Time, return UTC|
|{mtime}|Modified Time, return UTC|
|{ctime}|Change Time, return UTC|

### hash.manifest(manifestPath)

manifestPath:manifest file name.

## 重复造轮子的原因

Gulp生态已经有比如：`gulp-hash`这样优秀的生成文件Hash的库，但是为什么还要造一个`gulp-hash-lish`呢？ 因为在使用过程中，需要更加灵活的对文件名进行变更，比如文件名加参数后，应该生成以文件后缀结尾的文件，而不是带参数的文件名。

如：

模板：

	{name}{mtime}{ext}?hash={hash}
	
生成以后缀结尾的文件，而不是参数结尾的不合法文件名：

	{name}{mtime}{ext}
	
但HTML引用变成：

	{name}{mtime}{ext}?hash={hash}