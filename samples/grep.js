var files = require('./file_listing');
var readline = require('readline'),
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
                console.dir(results);
            });
});
