const mongoose = require("mongoose")

// const ticketVariantsSchema = new Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     stock: { type: Number, required: true }
// });

const TicketSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    published: {
        type:Boolean,
        default: false
    },
    description: {
        type:String,
        required: false
    },
    stock: {//deprecated
        type: Number,
        required: false
    },
    seller_id: {
        type:String,
        required: true
    },
    price: {//deprecated
        type: Number,
        required: false
    },
    icon: {
        type:String,
        default: ""
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
    tickets:[{
        name: {type:String, required:true},
        price: {type:Number, required:true},
        stock: {type:Number, require:true},
        sold: {type: Number, default: 0},
    }],
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