#!/usr/bin/env node

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
var header = {
    "Access-Control-Allow-Origin": "*",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache"
};
(function (root, port, conf) {

    //
    // status code message map
    //
    var message = {};

    //
    // mime type map
    //
    var mime = {};

    //
    // replace url
    //
    var pathMapping = {};

    //
    // current path mode
    //
    var currentPathMode;

    function readJson(file) {
        var obj = fs.readFileSync(file, 'utf8');

        return JSON.parse(obj);
    }
    //
    // send requested file
    //
    function sendFile(req, res, filePath) {

        var file = fs.createReadStream(filePath);
        file.on("readable", function () {
            header["Content-Type"] = mime[path.extname(filePath)] || "text/plain";
            res.writeHead(200, header);
        });

        file.on("data", function (data) {
            res.write(data, 'binary');
        });

        file.on("close", function () {
            res.end();
            console.log("<- " + message[String(200)] + ": " + req.method + " " + req.url);
        });

        file.on("error", function (err) {
            sendError(req, res, 500);
        });
    }

    //
    // send error status
    //
    function sendError(req, res, statusCode) {
        res.writeHead(statusCode, {
            "Content-Type": "text/html"
        });
        res.write("<!DOCTYPE html><html><body><h1>" + message[String(statusCode)] + "</h1></body></html>");
        res.end();
        console.log("<- " + message[String(statusCode)] + ": " + req.method + " " + req.url);
    }

    //
    // internal cgi(status)
    function status() {
        return "<!DOCTYPE html><html><body><h1>" + "hoge" + "</h1></body></html>";
    }
    /**
     * URL解析して、クエリ文字列を返す
     * @returns {Array} クエリ文字列
     * http://qiita.com/ma_me/items/03aaebb5dc440b380244
     */
    function getUrlVars(queryString) {
        var vars = [],
            max = 0,
            hash = "",
            array = "";
        var url = queryString;

        //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
        hash = url.slice(1).split('&');
        max = hash.length;
        for (var i = 0; i < max; i++) {
            array = hash[i].split('='); //keyと値に分割。
            vars.push(array[0]); //末尾にクエリ文字列のkeyを挿入。
            vars[array[0]] = array[1]; //先ほど確保したkeyに、値を代入。
        }

        return vars;
    }

    function loadconf() {
        mime = readJson(conf + "mime.json");
        console.dir(mime);
        message = readJson(conf + "message.json");
        console.dir(message);
        pathMapping = readJson(conf + "path.json");
        console.dir(pathMapping);
        return "<!DOCTYPE html><html><body><h1>" + "reload configuration file." + "</h1></body></html>";
    }
    //
    // request handler
    //
    function handleRequest(req, res, filePath) {
        var quries;
        console.dir("req :=> " + req);
        console.dir("res :=> " + res);
        console.dir("path :=> " + filePath);

        if (url.parse(req.url).search) {
            console.log("req.url.search :=>" + url.parse(req.url).search);
            console.log("req.url.query :=>" + url.parse(req.url).query);
            quries = getUrlVars(url.parse(req.url).search);
            console.log("queries[0]" + quries[0]);
            for (var k in quries)
                console.log(k);
            console.dir(quries);
        }
        for (var keyString in pathMapping["command"]) {
            console.log("COMMON KEY:" + pathMapping["command"][keyString]);
            console.dir(keyString);
            if (keyString === filePath) {
                console.log("COMMON KEY MATCHING:" + keyString);
                var msg = eval(pathMapping["command"][keyString]);
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                res.write(msg);
                res.end();
                return;
            }
        }
        console.log("handleRequest out");
        fs.exists(filePath, function (exists) {
            if (!exists) {
                return sendError(req, res, 404);
            }
            if (fs.statSync(filePath).isDirectory()) {
                console.log("handleRequest");
                return handleRequest(req, res, path.join(filePath, "index.html"));
            } else {
                console.log("sendFile");
                return sendFile(req, res, filePath);
            }
        });
        /*        fs.stat(filePath, function (err, stats) {
                    if (err) {
                        if ((/ENOENT/).test(err.message)) return sendError(req, res, 404);
                        else return sendError(req, res, 500);
                    }

                    if (stats.isDirectory())
                        // try to handle request with index.html file
                        return handleRequest(req, res, path.join(filePath, "index.html"));
                    else
                        return sendFile(req, res, filePath);
                });*/
    }
    // read configuration
    loadconf();

    //
    // create and start the server
    //
    http.createServer(function (req, res) {
        console.log("createServer start");
        var pathName = url.parse(req.url).pathname;
        console.log("-> " + req.method + " " + pathName);

        if (req.method === "GET") {
            console.log("handleRequest IN");
            handleRequest(req, res, path.join(root, pathName));
        } else {
            console.log("sendError IN");
            sendError(req, res, 501);
        }
        console.log("createServer end");
    }).listen(port);

    //
    // initiation log
    //
    console.log("Http Server running at http://localhost:" + port + "/ (" + root + ")");
    //console.log(JSON.stringify(message));

}(process.argv[2] || "./", process.argv[3] || "8888", process.argv[4] || "../conf/"));