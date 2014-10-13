var express = require('express');
var db = require('./../api/data');
var app = express()
    // delayed responses for simulation of a bad connection
    //.use(function(req, res, next){setTimeout(next, 3000);})
    .use(express.static(__dirname + '/client'));

app.get('/api/v2/cases', function(req, res){
    var cases = db.filter(function(currentCase){
        return !!currentCase.closedDate == (req.query.closed == 'true');
    }).map(function(item){
        return {
            number: item.number,
            subject: item.subject
        };
    });

    res.json(cases);
});

app.get('/api/cases', function(req, res){
    var openCases = db.filter(function(currentCase){
        return currentCase.closedDate === null;
    }).map(function(item){
        return {
            number: item.number,
            subject: item.subject
        };
    });

    res.json(openCases);
});

app.get('/api/cases/:id', function(req, res){
    var caseDetail = db.filter(function (currentCase){
        return currentCase.number === req.params.number;
    }).map(function(item){
        return {
            subject: item.subject,
            description: item.description
        };
    });

    res.json(caseDetail[0]);
});

app.get('/api/v2/cases/comments', function(req, res){
    var findedCase = db.filter(function (currentCase){
        return currentCase.number === req.query.caseNumber;
    });

    res.json(findedCase[0].comments);
});


app.listen(3000);