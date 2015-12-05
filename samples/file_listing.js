module.exports = function (base, filterEx, callback) {
    var fs = require('fs');
    var filter = filterEx || /.*\.js$/;
    fs.readdir(base, function (err, files) {
        if (err) throw err;
        var fileList = [];
        files.filter(function (file) {
            return fs.statSync(file).isFile() && filter.test(file);
        }).forEach(function (file) {
            fileList.push(file);
        });
        callback(null, fileList);
        return fileList;
    });
}
