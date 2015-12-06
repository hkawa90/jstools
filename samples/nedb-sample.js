var Datastore = require('nedb'),
    db = new Datastore({
        filename: 'data.nedb',
        autoload: true
    });

var fs = require('fs'),
    readline = require('readline');
argv = require('argv');

var regex = /([\s\S]+) (\S+) (\w+)\[(\d+)\]/;

argv.option({
    name: 'file',
    short: 'f',
    type: 'path',
    description: 'syslog to NeDB',
    example: "'script --file=/path/syslog' or 'script -f syslog'"
});

var opt = argv.run();

rs = fs.ReadStream(opt.options.file),
    rl = readline.createInterface({
        'input': rs,
        'output': {}
    });
rl.on('line', function (line) {
    var result = regex.exec(line.trim());

    if (result != null) {
        var date = Date.parse(result[1]);
        var r = {};
        r.date = date;
        r.host = result[2];
        r.process = result[3];
        r.pid = result[4];
        r.line = line.trim();
        db.insert(r, function (err, newDoc) {
            if (err) throw err;
        });

    }
});
