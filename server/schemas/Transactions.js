const mongoose = require("mongoose")

//create a mongoose schema called "TicketSchema"
// add a field called "name" that is of type String as is required
// add a field called "email" that is of type String as is required
// add a field called "expiration_date" that is of type Date as is required
// add a field called "ticket_number" that is of type String as is required

const TransactionSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true
    },
    order_date: {
        type: Date, 
        default: Date.now()
    },
    expiration_date: {
        type: Date,
        required: true
    },
    ticket_number: {
        type: String,
        required: true
    },
    ticket_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number, 
        required: true
    },
    ticket_title: {
        type: String,
        required: true
    }
})

const Transactions = mongoose.Models?.Transactions || mongoose.model("Transactions", TransactionSchema)
module.exports = Transactions
