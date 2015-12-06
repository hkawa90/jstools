var Datastore = require('nedb'),
    db = new Datastore({
        filename: 'data.nedb',
        autoload: true
    });

db.find({}, function (err, docs) {
    console.log(docs);
});
