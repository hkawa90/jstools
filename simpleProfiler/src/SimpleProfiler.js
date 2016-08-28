//console.log = function(arg) {
//    if (arg === undefined) {
//        document.getElementById('log').innerHTML += "undefined" + '\n';
//    } else {
//        document.getElementById('log').innerHTML += arg.toString() + '\n';
//    }
//};
var _SimpleProfiler = {
    nativeCodeEx: /\[native code\]/,
    indentCount: -4,
    tracing: [],
    diagram: [],

    traceMethod: function(func, methodName) {
        var traceOn = function() {
            var startTime = new Date();
            var result = func.apply(this, arguments);
            _SimpleProfiler.callgraph.add(_SimpleProfiler.getCaller(_SimpleProfiler.getCallStack()), methodName);
            _SimpleProfiler.diagram.push({
                'start': startTime,
                'end': new Date(),
                'content': methodName
            });
            return result;
        };
        traceOn.traceOff = func;
        for (var prop in func) {
            traceOn[prop] = func[prop];
        }
        traceOn.originalFuncName = methodName;
        return traceOn;
    },

    trace: function(root, recurse) {
        if ((root == window) || !((typeof root == 'object') || (typeof root == 'function'))) {
            return;
        }
        for (var key in root) {
            if ((root.hasOwnProperty(key)) && (root[key] != root)) {
                var thisObj = root[key];
                if (typeof thisObj == 'function') {
                    if ((this != root) && !thisObj.traceOff && !this.nativeCodeEx.test(thisObj)) {
                        root[key] = this.traceMethod(root[key], key);
                        this.tracing.push({
                            obj: root,
                            methodName: key
                        });
                    }
                }
                if (recurse === true) {
                    this.traceAll(thisObj, true);
                }
            }
        }
    },

    untraceAll: function() {
        for (var i = 0; i < this.tracing.length; ++i) {
            var thisTracing = this.tracing[i];
            thisTracing.obj[thisTracing.methodName] =
                thisTracing.obj[thisTracing.methodName].traceOff;
        }
        _SimpleProfiler.tracing = [];
        _SimpleProfiler.diagram = [];
    },

    callgraph: {
        enumList: [],
        add: function(caller, method) {
            var fnd = false;
            var content = {};
            for (var i = 0; i < _SimpleProfiler.callgraph.enumList.length; i++) {
                if ((_SimpleProfiler.callgraph.enumList[i].caller == caller) && (_SimpleProfiler.callgraph.enumList[i].method == method)) {
                    _SimpleProfiler.callgraph.enumList[i].count++;
                    fnd = true;
                }
            }
            if (!fnd) {
                content.caller = caller;
                content.method = method;
                content.count = 1;
                _SimpleProfiler.callgraph.enumList.push(content);
            }
        },
        get: function() {
            return _SimpleProfiler.callgraph.enumList;
        }
    },
    getCaller: function(callstack) {
        for (var i = 1; i < callstack.length; i++) {
            if (callstack[i] != "")
                return callstack[i];
        }
        return "";
    },

    getCallStack: function() {
        var caller = arguments.callee,
            ret = [];
        while ((caller = caller.caller)) {
            ret.push(caller.name);
        }
        return ret;
    }
};

SimpleClass = function(arg) {
    this.argumentsList = arg;
};

SimpleClass.prototype.myfunc_a = function(arg) {
    return arg;
};

SimpleClass.prototype.myfunc_b = function(arg) {
    return this.myfunc_a(arg);
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
    var sf_simple_func_b = _SimpleProfiler.traceMethod(simple_func_b, false);
    console.log("sf_simple_func_b run");
    sf_simple_func_b();
    console.log("sf_simple_func_b getProfileList");
    console.log("sf_simple_func_b getProfileList");
    console.log(_SimpleProfiler.callgraph.get());
    console.log(_SimpleProfiler.diagram);
    console.log("--sf_simple_func_b getProfileList");

}
