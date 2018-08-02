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


routerApi.route('/games')
    .post( function(req,res){
        var game = new Game()
        game.name = req.body.name
        game.description = req.body.description
        
        game.save(function (err){
            if(err) 
                res.send(err)
            
            res.json({message:'Game created'})
        })

    })
    .get(function(req,res){
        Game.find(function(err, games){
            if(err)
                res.send(err)

            res.json(games)
        })
    })

routerApi.route('/games/:gameId')
    .get(function(req,res){

        Game.findById(req.params.gameId, function(err, game){
            if(err)
                res.send(err)
            
            res.json(game)
        })
    })
    .post(async function(req,res){
        try{
            const game = await Game.findById(req.params.gameId)

            game.name = req.body.name ? req.body.name : game.name
            game.description = req.body.description ? req.body.description : game.description

            await game.save()
            res.json({message:game.name + " updated!"})

        }catch(err){
            res.status(500).send(err)
        }

        // Game.findById(req.params.gameId, function(err, game){
        //     if(err)
        //         res.send(err)
            
        //     if(game == null)
        //         res.send({message:"object not found"})
            
        //     game.name = req.body.name ? req.body.name : game.name
        //     game.description = req.body.description ? req.body.description : game.description

        //     game.save(function(err){
        //         if(err)
        //             res.send(err)

        //         res.json({message:game.name + " updated!"})
        //     })
        // })
    })
    .delete(async function(req,res){
        try{
            await Game.remove({_id:req.params.gameId})
            res.json({message: "Game has been deleted"})
        }catch(err)
        {
            res.status(500).send(err)
        }
    })

app.use('/api', routerApi)

app.get('/ping', function(req,res){
    res.send({'pong': 1})
})

app.listen(port)