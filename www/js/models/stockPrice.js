var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var stockPriceSchema = new Schema({
    timestamp: Date,
    stockId: String,
    price: {
        min: 0,
        type: Number
    }
})

var stockPriceSchema = mongoose.model('StockPrice', stockPriceSchema );