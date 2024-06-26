const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description:String,
    price: Number,
    quantity:Number,
    img: String,
    stars:{type: Number, default:0},
    comments:Array,
    sellerID: String,
    sellername: {type: String, default:""}
});

module.exports = mongoose.model("Product", productSchema);