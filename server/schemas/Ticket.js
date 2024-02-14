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
    pictures: {
        type: Array,
        required: true
    },
    event_type: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    address: {
        state: {
            type: String,
            required: true
        },
        postal_code: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        line: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    }
})

const Tickets = mongoose.models?.Tickets || mongoose.model("Tickets", TicketSchema)
module.exports = Tickets