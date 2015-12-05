var fs = require('fs'),
    moment = require('moment'),
    readline = require('readline');
argv = require('argv');

var regex = /([\s\S]+) \S+ \w+\[\d+\]/; ///^(.+) \w+ \w+\[\d+\]/;

var opt = argv.run();
console.log(opt);
console.log(moment("Dec  5 00:09:12"));

rs = fs.ReadStream(opt.targets[0]),
    rl = readline.createInterface({
        'input': rs,
        'output': {}
    });
rl.on('line', function (line) {
    var result = regex.exec(line.trim());
    //    console.log(result);
    if (result != null) {
        //        console.log(result);
        var date = moment(result[1]);
        console.log(date);
    }
});
