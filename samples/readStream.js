//export NODE_PATH=`npm root -g`

var fs   = require('fs');
var zlib = require('zlib');
var tar  = require('tar');

var tarballPath = 's.tar.gz';
var outputPath  = 'out';

var gunzip    = zlib.createGunzip();
//var extractor = tar.Extract({path: outputPath});
var parser = tar.Parse();

fs.createReadStream(tarballPath).pipe(gunzip).pipe(parser).on("entry", function (e) {
    console.error("entry", e.props)
    e.on("data", function (c) {
      console.error("  >>>" + c.toString().replace(/\n/g, "\\n"))
    })
    e.on("end", function () {
      console.error("  <<<EOF")
    })
  })
