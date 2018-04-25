const express = require('express')
const app = express()
var mongoose = require('mongoose')
var models = require("./models/stock")
var models = require("./models/stockPrice")
var stock = mongoose.model("Stock")
var stockPrice = mongoose.model("StockPrice") 
var schedule = require("node-schedule")
var bodyParser = require("body-parser")
var io = require('socket.io').listen(8081);



db = mongoose.connect('mongodb://mongodb/exchange',function(err){
    if(err){
        console.log(err)
    }
})

mongoose.connection.on("connected",function() {
    console.log("MongoDB connected")
    initDB();

})

mongoose.connection.on("error", function(err){
    console.log(err)
})

mongoose.connection.on("disconnected", function(){
    console.log("MongoDB disconnected")
})


var initDB = function() {
    console.log("Fill up MongoDB with Data")
   var initStocks = [{_id:"AAB", category:"heatlh"},
   {_id:"CKJ", category:"telecomunication"},
   {_id:"AIJ", category:"transportation"},
   {_id:"EOJ", category:"transportation"},
   {_id:"LJKJ", category:"health"},
   {_id:"LKLO", category:"telecomuncation"}];
   

   for(var i = 0; i<initStocks.length; i++){
       new stock(initStocks[i]).save(function(err){
           if(err){
               
           }
       })
   }
}

//This generates the stockPrices in every 10 seconds
var j = schedule.scheduleJob("*/10 * * * * *",function(){
    stock.find().then(function(doc){
        console.log("Job scheduled")
        console.log(doc)
        
        for(var i=0; i<doc.length;i++){
           ( function(i){
            stockPrice.find({stockId: doc[i]._id})
            .limit(1)
            .sort('timestamp').then(
                  function(docPrice) {
                    var newStockPrice;

                    if(!docPrice) {
                        var newPrice = docPrice.price + gauss(-10,15,1);
                        if(newPrice < 0) {
                            newPrice = docPrice.price;
                        }
            
                        newStockPrice = new stockPrice({stockId:docPrice.stockId,
                        timestamp: new Date(),
                        price: newPrice});
                        newStockPrice.save()
                    }else {
                        newStockPrice = new stockPrice({stockId:doc[i]._id,
                            timestamp: new Date(),
                            price: gauss(0,15,1)
                        })
                        newStockPrice.save()
                    }

                    io.emit("stockPriceUpdate",newStockPrice);
                    
                }
               )
        })(i)}
    })
    console.log(new Date())
    
})


function gauss(min, max, skew) {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    num = Math.max(Math.min(num, 1), 0); // cap between 0 and 1
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
  });
  
  app.use(express.static('public'))
  app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
  app.use(bodyParser.json());                                     // parse application/json
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

    app.get('/', (req, res) => res.sendFile('/app/www/index.html',function(err){
    if(err) {
        console.log(err)
    }
    res.end();
}))
app.get("/js/*",(req,res) => res.sendFile('/app/www' +req.path,function(err) {
    if(err) {
        console.log(err)
    }
    res.end();
} ))
app.get("/main.css",(req,res) => res.sendFile('/app/www' +req.path,function(err) {
    if(err) {
        console.log(err)
    }
    res.end();
} ))

app.get("/node_modules/*",(req,res) => res.sendFile('/app' +req.path,function(err) {
    if(err) {
        console.log(err)
    }
    res.end();
} ))


app.get("/api/stock/all",(req,res) => stock.find().then(function(stocks){
    res.send(stocks);
    res.end();

}))

app.get("/api/stock/price/:name/quantity/:many", (req,res) => stockPrice.find({stockId:req.params.name})
  .limit(parseInt(req.params.many)).sort('timestamp').then(function(doc){
    res.send(doc)
    res.end();
  } )
)

app.listen(8080, () => console.log('Example app listening on port 8080!'))