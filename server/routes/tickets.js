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
const { verifySeller } = require("../sellerMiddleware")
//protected route
router.post("/" ,[verifyToken, verifySeller ,uploadEventIcons.fields([{name:"icon", maxCount:1}])],async(req,res)=>{
    const {title, description,stock,price,line,state,event_type,address,day, start_time, end_time} = req.body
    
    
//     res.set('Location', `${process.env.CLIENT_DOMAIN}/seller/verify`);
//   // Set the status code to indicate a redirect (301 for permanent redirect, 302 for temporary)
//     res.status(302).send();
//     return
    //edit user id
    
    // if(matchingProfile.stripe_boarded == null || matchingProfile.stripe_connected_id == null) return res.status(500).json({message: "Not a boarded account"})
    try{
        // const matchingProfile = Profile.findById(req.user._id)
        // console.log("hi")
        console.log(req.files["icon"])
        // console.log("stock")
        if(title.length < 5) return res.status(500).json({message: "Title is too short"})
        if(description.length < 5) return res.status(500).json({message: "Description is too short"})
        if(address.length < 5) return res.status(500).json({message: "Description is too short"})
        if(stock < 1) return res.status(500).json({message: "Invalid stock"})
        if(price < 0 || price < 10 || Math.round(price * 100) != Math.floor(price*100) ) return res.status(500).json({message: "Invalid price"})
        // console.log(req.user)
        const newTicket = new Ticket({
            title,
            description,
            stock,
            price,
            event_type,
            checkin_code: generateCheckInCode(),
            seller_id: req.user._id,
            icon: req.files["icon"][0].filename,
            address,
            event: {
                start_time,
                end_time,
                day
            }
        })
        const savedTicket = newTicket.save()
        return res.status(201).json({message: "Ticket successfully created"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
    
})


router.put("/:id", [verifyToken, verifySeller ,uploadEventIcons.fields([{name:"icon", maxCount:1}])],async(req,res)=>{
    const {id} = req.params
    const {title, description,stock,price,line,state,event_type,address,day, start_time, end_time} = req.body
    console.log(price)
    try{
        // console.log(price>40)
        if(title && title.length < 5) return res.status(500).json({message: "Title is too short"})
        if(description && description.length < 5) return res.status(500).json({message: "Description is too short"})
        if(address && address.length < 5) return res.status(500).json({message: "Description is too short"})
        if(stock && stock < 1) return res.status(500).json({message: "Invalid stock"})
       
        if( price && (price < 0 || price < 10 || Math.round(price * 100) != Math.floor(price*100)) ) return res.status(500).json({message: "Invalid price"})
        // return
        const matchingTicket = await Ticket.findById(id)
        
        if(matchingTicket.seller_id != req.user._id) return res.status(500).json({message: "You do not own this ticket"})
        if(title) matchingTicket.title = title
        if(description) matchingTicket.description = description
        if(stock) matchingTicket.stock = stock
        if(price) matchingTicket.price = price
        if(address) matchingTicket.address = address
        if(day) matchingTicket.day = day
        if(start_time) matchingTicket.event.start_time = start_time
        if(end_time) matchingTicket.event.end_time = end_time
        if(event_type) matchingTicket.event_type = event_type
        if(req.files["icon"]) matchingTicket.icon = req.files["icon"][0].filename
        await matchingTicket.save()
        return res.status(200).json({message: "Ticket updated successfully"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})




router.post("/purchase/:id",async(req,res)=>{
    const {id} = req.params
    const {quantity} = req.body
    try {
        const matchingTicket = await Ticket.findById(id)
        console.log(quantity)
        // console.log(matchingTicket)
        const matchingSeller = await Profile.findById(matchingTicket.seller_id)
        if(matchingSeller.stripe_connected_id == null) return res.status(500).json({message: "Ticket does not have a connected stripe account somehow"})
        if(matchingTicket.stock-quantity <= 0) return res.status(500).json({message: "Ticket has run out of stock!"})
        
        // const applicationFee = Math.floor(totalCost*.15)
        // console.log(totalCost, applicationFee)

        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.CLIENT_DOMAIN}/tickets`,
            line_items: [
                {price_data: {
                    currency: 'usd',
                    product_data: {
                      name: matchingTicket.title,
                      description: matchingTicket.description,
                    },
                    unit_amount: Math.floor(matchingTicket.price * 1.08 *100)+50, // Amount in cents (e.g., $10.00)
                  }
                  , quantity},
            ],
            mode: 'payment',
            payment_intent_data: {
                transfer_data: {
                    destination: matchingSeller.stripe_connected_id,
                    amount: Math.floor(matchingTicket.price*100*quantity),
                    
                },
            },
            metadata: {
                ticket_id: id,
                ticket_title: matchingTicket.title,
                day: matchingTicket.event.day,
                quantity: quantity
            }
        });
        return res.status(201).json({url: session.url})

    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})



router.get("/:id", async(req,res)=>{
    const {id} = req.params
    // console.log(id)
    try{
        const TicketData = await Ticket.findById(id)
        return res.status(200).json(TicketData)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

router.get("/", async(req,res)=>{
    
    // console.log(id)
    try{
        const TicketData = await Ticket.find()
        return res.status(200).json(TicketData)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})



//fetches scanner data
router.put("/checkin/:id", async(req,res)=>{
    const {id} = req.params
    const {checkin_code} = req.body
    try{
        console.log(checkin_code)
        const matchingTicketWithCode = await Ticket.findOne({checkin_code, _id: id})
        if(matchingTicketWithCode == null){
            return res.status(500).json({message: "Invalid code"})
        }
        return res.status(201).json(matchingTicketWithCode)
        
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
    
})

//scans qr codes
router.post("/checkin/:id", async(req,res)=>{
    const {id} = req.params
    const {ticket_number} = req.body
    // console.log("Hello")
    //warning: no check to see if the checking user is actually pat of the group
    try{
        const matchingTicketNumber = await Transactions.findOne({ticket_id:id, ticket_number})
        if(matchingTicketNumber == null ) return res.status(500).json({message: "Invalid code"})
        
        if(matchingTicketNumber.expiration_date <= Date.now()) return res.status(500).json({message: "Ticket has expired"})
        matchingTicketNumber.expiration_date = Date.now()
        await matchingTicketNumber.save()
        return res.status(201).json({message: "Check in success"})
        
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message:error.message})
    }
    
})




module.exports = router