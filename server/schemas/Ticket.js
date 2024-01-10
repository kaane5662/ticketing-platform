const mongoose = require("mongoose")


const userSchema = new mongoose.userSchema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    expiration_date: {
        type: Date,
        required: true,
    },
    ticket_number: {
        type: String,
        required: true,
    }
})
//create a mongoose schema called "TicketSchema"
// add a field called "name" that is of type String as is required
// add a field called "email" that is of type String as is required
// add a field called "expiration_date" that is of type Date as is required
// add a field called "ticket_number" that is of type String as is required



const Tickets = mongoose.Models?.Tickets || mongoose.model("Tickets", TicketSchema)
module.exports = Tickets
