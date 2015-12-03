//export NODE_PATH=`npm root -g`

var fs = require('fs'),
    zlib = require('zlib'),
    tar = require('tar'),
    recdir = require('./file_listing'),
    async = require('async');

//var tarballPath = 's.tar.gz';
var outputPath = './outdir2';

var gunzip = zlib.createGunzip();
var extractor = tar.Extract({
    path: outputPath
});
//var parser = tar.Parse();


//var fileList = recdir('./', /.*\.tar\.gz$/);
async.waterfall([
    function (callback) {
        var fileList = recdir('./', /.*\.tar\.gz/, callback);
    },
    function (fileList, callback) {
        console.log('==');
        console.log(typeof(fileList));
        console.dir(fileList);
        fileList.map(function (file) {
            fs.createReadStream(file).pipe(gunzip).pipe(extractor);
            console.log(file);
        });
        callback(null);
    }]);
