var fs = require('fs');
var filter = /.*\.js$/;
fs.readdir('.', function(err, files){
    if (err) throw err;
    var fileList = [];
    files.filter(function(file){
        return fs.statSync(file).isFile() && filter.test(file);
    }).forEach(function (file) {
        fileList.push(file);
    });
    console.log(fileList);
});