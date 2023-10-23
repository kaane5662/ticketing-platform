const mongoose = require("mongoose")

//create a mongoose schema called "TicketSchema"
// add a field called "name" that is of type String as is required
// add a field called "email" that is of type String as is required
// add a field called "expiration_date" that is of type Date as is required
// add a field called "ticket_number" that is of type String as is required



const Tickets = mongoose.Models?.Tickets || mongoose.model("Tickets", TicketSchema)
module.exports = Tickets
