//export NODE_PATH=`npm root -g`

var fs   = require('fs');
var zlib = require('zlib');
var tar  = require('tar');

var tarballPath = 's.tar.gz';
var outputPath  = '.';

var gunzip    = zlib.createGunzip();
var extractor = tar.Extract({path: outputPath});
//var parser = tar.Parse();

fs.createReadStream(tarballPath).pipe(gunzip).pipe(extractor);
