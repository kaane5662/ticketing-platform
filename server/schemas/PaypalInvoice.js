const mongoose = require("mongoose")

const PaypalSchema = new mongoose.Schema({
    
    fees: {
        type:Number,
        required:true
    },
    amount: {
        type:Number,
        required:true
    },
    tickets:[{
        name: {type:String, required:true},
        price: {type:Number, required:true},
        quantity: {type:Number, required:true}
    }],
})

const PaypalInvoice = mongoose.models?.PaypalInvoice || mongoose.model("PaypalInvoice", PaypalSchema)
module.exports = PaypalInvoice