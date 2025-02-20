const mongoose = require("mongoose")

const SupportSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    
    
})

const Support = mongoose.models?.Support || mongoose.model("Support", SupportSchema)
module.exports = Support