/**
 * Read the file hash to generate a json manifest file and a new file
 * Created by jsonzhou
 */
var through2 = require('through2'),
    gutil = require('gulp-util'),
    assign = require('lodash.assign'),
    path = require('path'),
    createHash = require('./libs/createHash'),
    formatStr = require('./libs/formatStr'),
    fs = require('fs');

var PluginName = 'gulp-hash-list';

function formatManifestPath(mPath) {
    return path.normalize(mPath).replace(/\\/g, '/');
}

var hashListObj = function(options){
    options = assign({}, {
        algorithm: 'sha1',
        hashLength: 8,
        template: '{name}{ext}?hash={hash}'
    }, options);

    return through2.obj(function(file, encoding, done) {
        if (file.isDirectory()) {
            done(null, file);
            return;
        }

        var fileExt = path.extname(file.relative),
            fileName = path.basename(file.relative, fileExt),
            dir = path.dirname(file.path);

        file.origFilename = path.basename(file.relative);

        //template data
        var params = {
            name: fileName,
            ext: fileExt,
            hash: createHash(file.contents, options),
            size:  file.stat ? file.stat.size : '',
            atime: file.stat ? file.stat.atime.getTime() : '', //Access Time
            mtime: file.stat ? file.stat.mtime.getTime() : '', //Modified Time
            ctime: file.stat ? file.stat.ctime.getTime() : '' //Change Time
        };

        var fileName = formatStr(options.template, params);
        if(options.template.endsWith('{ext}')){
            file.path = path.join(dir, fileName);
            file.hashFilename = path.basename(file.path);
        }else if(options.template.indexOf('{ext}')>0){ //must start 1
            var fileRealNameTemplate = options.template.substring(0,options.template.indexOf('{ext}')+5);
            file.path = path.join(dir, formatStr(fileRealNameTemplate, params));
            file.hashFilename = path.basename(fileName);
        }else{
            var err = new gutil.PluginError(PluginName, {
                message: 'template must have {ext}'
            });
            done(err,file);
            return;
        }

        done(null,file);
    });
};

hashListObj.manifest = function(manifestPath){
    var manifest = {};

    return through2.obj(function(file, encoding, done) {
        if (typeof file.origFilename !== 'undefined') {
            var srcPath = formatManifestPath(path.join(path.dirname(file.relative), file.origFilename));
            var distPath = formatManifestPath(path.join(path.dirname(file.relative), file.hashFilename));
            manifest[srcPath] = distPath;
        }

        done();
    },function(cb) {
        this.push(new gutil.File({
            path: manifestPath,
            contents: new Buffer(JSON.stringify(manifest))
        }));

        cb();
    });
};

module.exports = hashListObj;