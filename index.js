var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var db = mongojs('todo', ['tasks']);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// http://localhost:8000/tasks/?status=1
app.get('/tasks', function(req, res) {
    var status = req.query.status;

    if(status == undefined) {
        db.tasks.find(function(err, data) {
            res.json(data);
        });
    } else {
        db.tasks.find({
            status: parseInt(status)
        }, function(err, data) {
            res.json(data);
        });
    }
});

// curl -X POST localhost:8000/tasks -d "subject=Bread"
app.post('/tasks', function(req, res) {
    var subject = req.body.subject;

    db.tasks.insert({
        "subject": subject,
        "status": 0
    }, function(err, data) {
        res.json(data);
    });
});

// curl -X DELETE localhost:8000/tasks/<38924kjsdfi92342jrwe>
app.delete('/tasks/:id', function(req, res) {
    var id = req.params.id;
    db.tasks.remove({
        "_id": mongojs.ObjectId(id)
    }, function(err, data) {
        res.json(data);
    });
});

// remove all
app.delete('/tasks', function(req, res) {
    db.tasks.remove({
        "status": 1
    }, function(err, data) {
        res.json(data);
    });
});

// curl -X PUT localhost:8000/tasks/<id> -d "status=1"
app.put('/tasks/:id', function(req, res) {
    var id = req.params.id;
    var status = req.body.status;

    db.tasks.update(
        { "_id": mongojs.ObjectId(id) },
        { $set: { status: parseInt(status) } },
        { "multi": true },
        function(err, data) {
        res.json(data);
    });
});

// curl localhost:8000/tasks/<id>
app.get('/tasks/:id', function(req, res) {
    var id = req.params.id;
    db.tasks.find({
        "_id": mongojs.ObjectId(id)
    }, function(err, data) {
        res.json(data);
    });
});

app.listen(8000, function() {
    console.log('Express server running at 8000');
});
