module.exports = function (base, filterEx, callback) {
    var fs = require('fs');
    var filter = filterEx || /.*\.js$/;
    console.log(base);
    console.log(filterEx);
    fs.readdir(base, function (err, files) {
        console.log('---');
        console.log(files);
        console.log('---');
        if (err) throw err;
        var fileList = [];
        files.filter(function (file) {
            console.log('---');
            console.log(file);
            console.log('---');
            return fs.statSync(file).isFile() && filter.test(file);
        }).forEach(function (file) {
            fileList.push(file);
        });
        console.log('--');
        console.log(fileList);
        console.log('--');
        callback(null, fileList);
        return fileList;
    });
}
