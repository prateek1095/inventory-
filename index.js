var express=require('express');
var app=express();
var mongojs = require('mongojs');
var db = mongojs('warehouse',['warehouse']);
var bodyParser = require('body-parser'); 

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());

app.get('/warehouse',function(req,res) {
        console.log('I received a get request');
        db.warehouse.find(function(err,docs){
            console.log(docs);
            res.json(docs);
        })
});

app.post('/warehouse', function(req,res){
        console.log(req.body);
        db.warehouse.insert(req.body, function(err,docs){
            res.json(docs);
        });
});

app.delete('/warehouse/:id', function(req,res){
    var id = req.params.id;
    console.log(id);
    db.warehouse.remove({_id: mongojs.ObjectId(id)}, function(err,doc){
        res.json(doc);
    });
});

app.get('/warehouse/:id', function(req,res){
    var id = req.params.id;
    console.log(id);
    db.warehouse.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
            res.json(doc);
    });
});

app.put('/warehouse/:id', function(req,res){
    var id = req.params.id;
    console.log(req.body.name);
    db.warehouse.findAndModify({
        query : {_id : mongojs.ObjectId(id)},
        update : {$set : {category:req.body.category,name:req.body.name, description:req.body.description, price:req.body.price, stock:req.body.stock, packing:req.body.packing }},
        new : true }, function(err,doc){
                res.json(doc);
        });
});

app.listen(3000);
console.log("server running on localhost:3000");