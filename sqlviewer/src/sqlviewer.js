var outputElm = document.getElementById('output');
var errorElm = document.getElementById('error');
var commandsElm = document.getElementById('commands');
var dbFileElm = document.getElementById('dbfile');

// Start the worker in which sql.js will run
var worker = new Worker("lib/js/worker.sql.js");
worker.onerror = error;

// Open a database
worker.postMessage({action:'open'});

// Connect to the HTML element we 'print' to
function print(text) {
    outputElm.innerHTML = text.replace(/\n/g, '<br>');
}
function error(e) {
  console.log(e);
	errorElm.style.height = '2em';
	errorElm.textContent = e.message;
}

function noerror() {
		errorElm.style.height = '0';
}

// Run a command in the database
function executeCreateTable(commands) {
	tic();
	worker.onmessage = function(event) {
		var results = event.data.results;
		outputElm.innerHTML = "";
		for (var i=0; i<results.length; i++) {
			outputElm.appendChild(tableCreate(results[i].columns, results[i].values));
		}
	}
	worker.postMessage({action:'exec', sql:commands});
	outputElm.textContent = "Fetching results...";
}

// Run a command in the database
function execute(commands) {
	worker.onmessage = function(event) {
		var results = event.data.results;
        console.log(results);
        for (var i=0; i<results.length; i++) {
            console.log(results[i]);
        }
	}
	worker.postMessage({action:'exec', sql:commands});
	outputElm.textContent = "Fetching results...";
}

// Create an HTML table
var tableCreate = function () {
  function valconcat(vals, tagName) {
    if (vals.length === 0) return '';
    var open = '<'+tagName+'>', close='</'+tagName+'>';
    return open + vals.join(close + open) + close;
  }
  return function (columns, values){
    var tbl  = document.createElement('table');
    var html = '<thead>' + valconcat(columns, 'th') + '</thead>';
    var rows = values.map(function(v){ return valconcat(v, 'td'); });
    html += '<tbody>' + valconcat(rows, 'tr') + '</tbody>';
	  tbl.innerHTML = html;
    return tbl;
  }
}();

// Execute the commands when the button is clicked
function execEditorContents () {
	noerror()
	execute (editor.getValue() + ';');
}


// Load a db from a file
dbFileElm.onchange = function() {
	var f = dbFileElm.files[0];
	var r = new FileReader();
	r.onload = function() {
		worker.onmessage = function () {
			// Show the schema of the loaded database
			execute("SELECT `name`, `sql`\n  FROM `sqlite_master`\n  WHERE type='table';");
		};
		try {
			worker.postMessage({action:'open',buffer:r.result}, [r.result]);
		}
		catch(exception) {
			worker.postMessage({action:'open',buffer:r.result});
		}
	}
	r.readAsArrayBuffer(f);
}
