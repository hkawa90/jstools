module.exports = function (file) {
    var fs = require('fs');
    var obj = fs.readFileSync(file, 'utf8');

    return JSON.parse(obj);
}
