var editor, cm; // CodeMirror Instance

function makeMarker() {
    var marker = document.createElement("div");
    marker.style.color = "#822";
    //marker.innerHTML = "●";
    marker.innerHTML = "<img src='" + "list_003_f-trans.png'/>";
    return marker;
}

function regExpSearch() {
    var linecnt = 0;
    var result;
    // CodeMirror選択状態の解除
    editor.setSelection({
        line: 0,
        ch: 0
    }, {
        line: 0,
        ch: 0
    });
    cm.save();
    editor.save();
    // 正規表現のフラグ取得
    var regExpFlag = document.getElementById("flag").value;
    // 正規表現オブジェクト生成
    var re = new RegExp(document.getElementById("regex").value, regExpFlag);
    // 入力文字列各行に対して正規表現による検索実行
    var rStr = document.getElementById("code").value.split("\n");
    rStr.forEach(function (s) {
        // 前回検索にマッチした行のマーカーを削除
        editor.setGutterMarker(linecnt, "found", null);
        if (regExpFlag == "g") {
            var matched = false;
            // Globalフラグでの検索はexecの戻りが'null'となるまで、
            // 状態を保持して、連続してマッチするまで実行させる.
            while ((result = re.exec(s)) != null) {
                // 検索にヒットした場合選択状態にする
                editor.addSelection({
                    line: linecnt,
                    ch: result.index
                }, {
                    line: linecnt,
                    ch: result.index + result[0].length
                });
                matched = true;
            }
            if (matched == true) {
                // 検索にヒットした行にマーカーを表示する.
                var info = editor.lineInfo(linecnt);
                editor.setGutterMarker(linecnt, "found", info.gutterMarkers ? null : makeMarker());

            }
        } else {

            result = re.exec(s);
            if (result != null) {
                editor.addSelection({
                    line: linecnt,
                    ch: result.index
                }, {
                    line: linecnt,
                    ch: result.index + result[0].length
                });
                var info = editor.lineInfo(linecnt);
                editor.setGutterMarker(linecnt, "found", info.gutterMarkers ? null : makeMarker());
            }
        }
        linecnt++;
    });
}

window.onload = function () {
    // 正規表現検索対象文字列入力用
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        gutters: ["CodeMirror-linenumbers", "found"]
    });
    // 正規表現式
    cm = CodeMirror.fromTextArea(document.getElementById("regex"), {
        lineNumbers: false,
        lineWrapping: true
    });
    cm.setSize(400, cm.defaultTextHeight() + 2 * 4);
    // 200 is the preferable width of text field in pixels,
    // 4 is default CM padding (which depends on the theme you're using)
    // now disallow adding newlines in the following simple way
    cm.on("beforeChange", function (instance, change) {
        var newtext = change.text.join("").replace(/\n/g, "");
        // remove ALL \n !
        change.update(change.from, change.to, [newtext]);
        return true;
    });
};
