var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var stockSchema = new Schema({
    _id: String,
    category: String
})

var stockModel = mongoose.model('Stock', stockSchema );