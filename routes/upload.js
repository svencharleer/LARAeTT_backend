var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require('../dbConnection');

/* GET home page. */
router.post('/', function(req, res) {

    fs.writeFile("test.jpg", new Buffer(req.body.file, 'base64'), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
    db.collection('images', function (err, collection) {
        collection.insert(req.body, {w: 1}, function(err, records){
            console.log("Record added as "+records[0]._id);
        });
    });


    res.render('index', { title: 'Express' });
});

module.exports = router;
