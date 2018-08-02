var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/testGame123'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8080

var Game = require('./app/model/Game')

var routerApi = express.Router()

routerApi
    .post('/games', function(req,res){
        var game = new Game()
        game.name = req.body.name
        game.description = req.body.description
        
        game.save(function (err){
            if(err) 
                res.send(err)
            
            res.json({message:'Game created'})
        })

    })
    .get('/games', function(req,res){
        Game.find(function(err, games){
            if(err)
                res.send(err)

            res.json(games)
        })
    })

routerApi.get('/games/:gameId', function(req,res){
    res.send(req.params)
})

app.use('/api', routerApi)

app.get('/ping', function(req,res){
    res.send({'pong': 1})
})

app.listen(port)