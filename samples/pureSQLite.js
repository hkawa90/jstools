var Sql = require('node-sqlite-purejs');
var dbFile = 'test.db';
var sqlStatement = "select * from user;";
var r = Sql.open(dbFile, {}, function (err, db) {
    if (!err) {
        db.exec(sqlStatement,
            function (err, result) {
                if (err)
                    console.log('Error: ' + err);
                else
                    console.log(result);
            });
    }
});