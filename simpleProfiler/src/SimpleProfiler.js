//console.log = function(arg) {
//    if (arg === undefined) {
//        document.getElementById('log').innerHTML += "undefined" + '\n';
//    } else {
//        document.getElementById('log').innerHTML += arg.toString() + '\n';
//    }
//};

function getCaller(callstack) {
    for (var i = 1; i < callstack.length; i++) {
        if (callstack[i] != "")
            return callstack[i];
    }
    return "";
}

function getCallStack() {
    var caller = arguments.callee,
        ret = [];
    while ((caller = caller.caller)) {
        ret.push(caller.name);
    }
    return ret;
};

SimpleProfiler = function(target, recursive) {
    this.traceList = [];
    this.profileList = [];
    this.targetObj = target;
    this.recursive = recursive || false;
    this.handler = {
        _this: this,
        apply: function(target, thisArg, argumentsList) {
            console.log(this);
            console.log("apply ---");
            var startTime = new Date();
            var r = target.apply(thisArg, argumentsList);
            var endTime = new Date();
            this._this.profileList.push({
                "start": startTime,
                "end": endTime,
                "method": target
            });
            console.log(this._this.profileList);
            console.log("apply ---");
            return r;
        },
        set: function(target, prop, value, receiver) {
            target[prop] = value;
            return true;
        },
        get: function(target, name) {

            //console.dir(getCallStack());
            //            if (typeof target[name] === 'function') {
            //                return function() {
            //                    var startTime = new Date();
            //                    var rtnVal = target[name].call(this);
            //                    var endTime = new Date();
            //                    this._this.profileList.push({
            //                        "start": startTime,
            //                        "end": endTime,
            //                        "method": target
            //                    });
            //                    return rtnVal == target ? this : rtnVal;
            //                }
            //            } else {
            return target[name];
            //            }
        }
    };
    this.proxy = new Proxy(this.targetObj, this.handler);
};

SimpleProfiler.prototype.run = function(method, thisArg, argumentsList) {
    //    return this.proxy[method].apply(this.targetObj, argumentsList);
    return this.proxy.apply(this.targetObj, argumentsList);
};

SimpleProfiler.prototype.getProfileList = function() {
    return this.profileList;
};

SimpleClass = function(arg) {
    this.argumentsList = arg;
};

SimpleClass.prototype.myfunc_a = function(arg) {
    return arg;
};

SimpleClass.prototype.myfunc_b = function(arg) {
    return myfunc_a(arg);
};

function simple_func_a(arg) {
    console.log("Do func_a");
    console.log(arg);
    console.log("Done func_a");
};

function simple_func_b(arg) {
    console.log("Do func_b");
    console.log(arg);
    console.log("Done func_b");
    return simple_func_a(arg);
};

window.onload = function() {
    // simple function test
    var sf_proxy = new SimpleProfiler(simple_func_b);
    sf_proxy.run("sf_proxy");
    console.log("simpleClass_proxy.getProfileList");
    console.log(simpleClass_proxy.getProfileList());
    console.log("--simpleClass_proxy.getProfileList");

    // simple class test
    var simpleClass_proxy = new SimpleClass("simpleClass_proxy");
    simpleClass_proxy.run("simpleClass_proxy_instance");
    console.log("simpleClass_proxy.getProfileList");
    console.log(simpleClass_proxy.getProfileList());
    console.log("--simpleClass_proxy.getProfileList");
}
