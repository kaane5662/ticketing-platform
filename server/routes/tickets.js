const express = require("express")
const router = express.Router()
const Ticket = require("../schemas/Ticket")
const Profile = require("../schemas/Profile")
const { verifyToken } = require("../jwtMiddleware")
const stripe = require("stripe")(process.env.STRIPE_KEY)
const {uploadEventIcons, uploadEventImages} = require("../uploadMiddleware")
const multer = require("multer")
const Transactions = require("../schemas/Transactions")
const crypto = require("crypto")
const generateCheckInCode = require("../helpers/generateCheckInCode")
//protected route
router.post("/" ,[ [uploadEventIcons.single("event_icon"), uploadEventImages.array("event_images",5)]],async(req,res)=>{
    const {title, description,stock,price,line,state,postal_code,event_type,tags, start_time, end_time, date} = req.body
    
    //edit user id
    const matchingProfile = Profile.findById(req.user._id)
    if(matchingProfile.stripe_boarded == null || matchingProfile.stripe_connected_id == null) return res.status(500).json({message: "Not a boarded account"})
    try{
        const newTicket = new Ticket({
            title,
            description,
            stock,
            price,
            event_type,
            tags,
            checkin_code: generateCheckInCode(),
            seller_id: req.user.id,
            icon: req.files["event_icon"],
            pictures: req.files["event_images"].map((event_image, index)=>{return event_image.path}),
            address:{
                line,
                state,
                postal_code,
            },
            event: {
                start_time,
                end_time,
                day: date
            }
        })
        const savedTicket = newTicket.save()
        res.status(201).json({message: "Ticket successfully created"})
    }catch(error){
        res.status(500).json({message: error.message})
    }
    
})



router.post("/purchase/:id", verifyToken,async(req,res)=>{
    const {id, quantity} = req.params
    try {
        const matchingTicket = await Ticket.findById(id)
        const matchingSeller = await Profile.findById(matchingTicket.seller_id)
        if(matchingSeller.stripe_connected_id == null) return res.status(500).json({message: "Ticket does not have a connected stripe account somehow"})
        if(matchingTicket.stock-quantity <= 0) return res.status(500).json({message: "Ticket has run out of stock!"})
        const totalCost = matchingTicket.productCost * quantity * 100
        const applicationFee = Math.floor(totalCost*.15)
        console.log(totalCost, applicationFee)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost,
            currency: 'usd',
            payment_method_types: ['card'],
            application_fee_amount: applicationFee,
            transfer_data: {
              destination: seller.stripe_account_id,
            },
            metadata:{
                ticketName: matchingTicket.title,
                totalCost,
                quantity
            }
        });
        return res.status(201).json({client_secret: paymentIntent.client_secret})

    }catch(error){
        return res.status(500).json({message: error.message})
    }
})



router.get("/:id", async(req,res)=>{
    const {id} = req.params
    try{
        const TicketData = await Ticket.findById(id)
        return res.status(200).json(TicketData)
    }catch(error){
        return res.status(500).json({message: error.message})
    }
})

router.get("/checkin/:id", async(req,res)=>{
    const {id} = req.params
    const {code} = req.body
    try{
        const matchingTicketWithCode = await Ticket.findOne({_id:id, checkin_code:code})
        if(matchingTicketWithCode == null){
            res.status(500).json({message: "Invalid code"})
        }
        return res.status(201).json({message: "Check in success"})
        
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
    
})

router.post("/checkin/:id", async(req,res)=>{
    const {id} = req.params
    const {ticket_number} = req.body
    //warning: no check to see if the checking user is actually pat of the group
    try{
        const matchingTicketNumber = await Transactions.findOne({ticket_number, ticket_id: id})
        if(matchingTicketNumber == null ){
            res.status(500).json({message: "Invalid code"})
        }
        if(matchingTicketNumber.expiration_date <= Date.now()){
            res.status(500).json({message: "Ticket has expired"})
        }
        matchingTicketNumber.expiration_date = Date.now()
        await matchingTicketNumber.save()
        return res.status(201).json({message: "Check in success"})
        
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
    
})




module.exports = router