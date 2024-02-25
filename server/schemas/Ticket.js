const mongoose = require("mongoose")


const TicketSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    seller_id: {
        type:String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    icon: {
        type:String,
        required: true
    },
    checkin_code: {
        type: String,
        required: true
    },
    pictures: {
        type: Array,
        required: false
    },
    event_type: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    event: {
        start_time: {
            type:String, 
            required: true
        },
        end_time: {
            type:String, 
            required: true
        },
        day: {
            type:String, 
            required: true
        },
    }
})


const Ticket= mongoose.models?.Tickets || mongoose.model("Ticket", TicketSchema)
module.exports = Ticket