var fs = require("fs");

var readStream = fs.createReadStream(process.argv[2]);

readStream.on('open', function () {
    console.log("open...");
});

readStream.on('data', function (chunk) {
    console.log("data...");
    console.log(chunk);
});

readStream.on('end', function () {
    console.log("end...");
});

readStream.on('error', function (err) {
    res.end(err);
});