var async = require('async');
var cnt = 0;

function func1() {
    console.log('cnt =' + cnt);
    async.each([1, 2, 3], function (val, callback) {
        setTimeout(function () {
            cnt++
            console.log('cnt =>' + cnt);
            callback();
        }, 5000);
    }, function (err) {
        console.log('cnt ==>' + cnt);
    });

    console.log('cnt ==' + cnt);
}

console.log('Start');
func1();
console.log('End');