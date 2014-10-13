var express = require('express');
var db = require('./data');
var port = process.env.PORT || 3000;

var app = express()
    // delayed responses for simulation of a bad connection
    //.use(function(req, res, next){setTimeout(next, 3000);})
    .use(express.static(__dirname + '/../client'));


/**
 * /api/cases
 * /api/cases?closed=true
 * /api/cases?closed=false
 */
app.get('/api/cases', function(req, res){
    var filterClosed = req.query.closed == 'true';
    var cases = db.filter(function(currentCase){
        return !!currentCase.closedDate == filterClosed;
    }).map(function(item){
        return {
            id: item.id,
            subject: item.subject
        };
    });
    res.json(cases);
});


/**
 * /api/cases/00189394
 */
app.get('/api/cases/:id', function(req, res){
    var caseDetails = db.filter(function (currentCase){
        return currentCase.id === req.params.id;
    }).map(function(item){
        return {
            subject: item.subject,
            description: item.description
        };
    })[0];

    res.json(caseDetails);
});


/**
 * /api/cases/00189394/comments
 */
app.get('/api/cases/:id/comments', function(req, res){
    var findedCase = db.filter(function (currentCase){
        return currentCase.id === req.params.id;
    })[0];
    res.json(findedCase ? findedCase.comments : []);
});

app.listen(port);