var files = require('./file_listing');
var readline = require('readline'),
    colors = require('colors'),
    fs = require('fs'),
    async = require('async');
var results = [];

files('.', /.*\.js/, function (err, fileLists) {
            var patterns = {
                'require': /require\((.*)\)/,
                'var': /var/
            };
            async.each(fileLists, function (file, callback) {
                var lineNum = 1;
                rs = fs.ReadStream(file),
                    rl = readline.createInterface({
                        'input': rs,
                        'output': {}
                    });
                rl.on('line', function (line) {
                    for (var p in patterns) {
                        //console.log(patterns[p]);
                        var result = patterns[p].exec(line.trim());
                        if (result != null) {
                            //results.push()
                            result.lineNumber = lineNum;
                            result.fileName = file;
                            results.push(result);
                        }

                    }
                    lineNum++;
                });
                rl.on('close', function () {
                    callback();
                });
            }, function (err) {
                for (var i = 0; i < results.length; i++) {
                    console.log(results[i].fileName + ':' + results[i].lineNumber + ':' + results[i][1] + '=' + results[i][0].red);
                }
                console.dir(results);
            });
});
