var callback;

exports.init = function (_callback) {
    callback = _callback;
};


exports.sleep = function (time) {
    var e = new Date().getTime() + (time * 1000);
    // busy loop
    while (new Date().getTime() <= e) {
        /* do nothing, but burn a lot of CPU while doing so */
        /* jshint noempty: false */
    }
    callback();
}