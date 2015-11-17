var fs = require('fs');
var filter = /storing$|display$|storing\.\d+$|display\.\d+$|display*\.tgz$|storing*\.tgz$/;
var root='.';
var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else if (fs.statSync(file).isFile() && filter.test(file)) {
results.push(file)
}
    })
    return results
}

var r = walk(root);
console.log(r);