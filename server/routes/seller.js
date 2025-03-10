const express = require("express")
const axios = require("axios")
const router = express.Router()
const {verifyToken} = require("../jwtMiddleware")
const {verifySeller} = require("../sellerMiddleware")
const Profile = require("../schemas/Profile")
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY)
const EventTypes = require("../fields/EventTypes")
const Tickets = require("../schemas/Ticket")
const Transactions = require("../schemas/Transactions")
const mongoose = require("mongoose")
const { PAYPAL_API,getAccessToken } = require("../config/paypal")
//creates a stripe verification session

// router.get("/verify",verifyToken,async (req,res)=>{
//     // const {first_name, last_name, business_email, business_name} = req.body
    
//     try{   
//         const userProfile = await Profile.findById(req.user._id)
//         if(userProfile?.stripe_identity_verified) return res.status(500).json({message:"Your account is already verified"}) 
//         if(userProfile?.recent_stripe_verification_session) return res.status(500).json({message:"Your verification is processing"}) 
        
//         const verificationSession = await stripe.identity.verificationSessions.create({
//             type: 'document',
//             options: {
//                 document:{
//                     require_id_number: true,
//                     require_matching_selfie: true,
//                     require_live_capture: true,
                    
//                 }
//             },
//             metadata:{
//                 _id: req.user._id
//             }
//         });
        
//         return res.status(201).json({url: verificationSession.url})
//     }catch(error){
//         console.log(error.message)
//         return res.status(500).json({message: error.message})
//     }
// })

//creates a connect account
router.post("/connect",verifyToken,async(req,res)=>{
    const {first_name, last_name, business_email, business_name, business_desc} = req.body
    
    try{
        // return stripe.accounts.del("acct_1OlzyxIzbrfbn6lt")  
        const User = await Profile.findById(req.user._id)
        // if(!User.stripe_identity_verified) return res.status(403).json({message: "User has not verified id"})
        if(User.stripe_connected_id) return res.status(500).json({message: "You already have a connected account"})
        const connectedAccount = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: User.email,
            capabilities: {
                card_payments: {
                  requested: true,
                },
                transfers: {
                  requested: true,
                },
            },
            business_type: "individual"
        })
        console.log(connectedAccount.id)
        await Profile.findByIdAndUpdate(req.user._id, {stripe_connected_id: connectedAccount.id})
        return res.status(201).json({url:"/boarding"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json(error.message)
    }
})




//creates a stripe connected account boarding session
router.post("/boarding", verifyToken,async(req,res)=>{
    try{
        const {email, phoneNumber, businessEmail, guestsPerEvent, paypalEmail, name} = req.body
        
        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(businessEmail)) 
            return res.status(400).json({message:"Incorrect business email format"})
        if(!/^\+?(\d{1,3})?[-. ]?\(?\d{1,4}\)?[-. ]?\d{1,4}[-. ]?\d{1,9}$/.test(phoneNumber)) 
            return res.status(400).json({message:"Incorrect phone number format"})
        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(paypalEmail)) 
            return res.status(400).json({message:"Incorrect paypal email format"})
        if(name.length < 3)
            return res.status(400).json({message:"Name must be at least 3 characters"})
        const User = await Profile.findById(req.user._id)
        if(!User) return res.status(404).json({message:"User not found"})
        User.paypal_email = paypalEmail
        User.business_email = businessEmail
        User.name = name
        User.guests_per_event = guestsPerEvent
        User.phone_number = phoneNumber
        await User.save()
        return res.status(201).json({message:"Paypal linked"})
        // if(User.stripe_connected_id == null) return res.status(500).json({message: "You need a stripe connected id"})
        
        // stripe_connected_id = User.stripe_connected_id || "acct_1OkYStRJr6vSAqtv"
        
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

// //protected route       
// router.get("/check", verifyToken,async (req,res)=>{
//     const User = await Profile.findById(req.user._id)

//     if(!User.stripe_identity_verified) return res.status(200).json({url:"/seller/verify"})
    
//     if(User.recent_stripe_verification_session != null) return res.status(200).json({url: "/seller/processing/"})
    
//     if(User.stripe_connected_id == null) return res.status(200).json({url:"/seller/join"})
        
//     if(!User.stripe_boarded) return res.status(200).json({url: "/seller/boarding"})
    
//     return res.status(200).json({url:"/seller/dashboard"}) 
// })

//should be protected
router.get("/create", [verifyToken, verifySeller], async(req,res)=>{
    const User = await Profile.findById(req.user.id)
    // if(User.stripe_connected_id == null || User.stripe_boared == false){
    //     return res.status(500).json({url:"/checkseller"})
    // }
    return res.status(200).json({EventTypes})
})

//updates the onboaring info of the seller
router.get("/update", [verifyToken, verifySeller], async(req,res)=>{
    try{

        const User = await Profile.findById(req.user._id)
        // if(User.stripe_connected_id == null){
        //     return res.status(404).json({url:"/checkseller"})
        // }
        const accountLink = await stripe.accountLinks.create({
            account: User.stripe_connected_id,
            refresh_url: `${process.env.CLIENT_DOMAIN}/seller/tickets`,
            return_url: `${process.env.CLIENT_DOMAIN}/seller/tickets`,
            type: 'account_onboarding',
            
        });
        return res.status(201).json({url:accountLink.url})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message:error.message})
    }
    
})

router.get("/dashboard", [verifyToken, verifySeller], async (req,res)=>{
    try{

        const User = await Profile.findById(req.user._id)
        // if(User.stripe_connected_id == null){
        //     return res.status(404).json({url:"/checkseller"})
        // }
        const dashboardLink = await stripe.accounts.createLoginLink(User.stripe_connected_id);
        return res.status(201).json({url:dashboardLink.url})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message:error.message})
    }
})

//create a stripe checkout transfer
router.post("/checkout", [verifyToken, verifySeller], async(req,res)=>{
    let {amount} = req.body;
    amount = Math.floor(amount *100);
    try{
        const User = await Profile.findById(req.user._id)
        if(User.stripe_boarded == false){
            return res.status(403).json({message: "You are not eligible for a checkout. Make sure you have a connected stripe account and completed the boarding process."})
        }
        const balance = stripe.balance.retrieve({stripeAccount: User.stripe_connected_id})
        if(balance > amount) return res.status(406).json({message: "Insufficient funds"})
        const transfer = await stripe.transfers.create({
            amount: amount,
            currency: "usd",
            destination: User.stripe_connected_id
        })
        res.status(201).json({message: "Transfer has successfully been initiated!"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
    
})

//get stripe account balance data
router.get("/checkout", [verifyToken, verifySeller], async(req, res)=>{
    try{
        const User = await Profile.findById(req.user._id)
        console.log(User)
        const balance = await stripe.balance.retrieve({stripeAccount: User.stripe_connected_id})
        console.log(balance)
        return res.status(200).json(balance)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})


//returns the sellers tickets uploaded
router.get("/tickets", [verifyToken, verifySeller], async(req,res)=>{
    console.log("Hi")
    try{
        const createdTickets = await Tickets.find({seller_id: req.user._id})
        const testTickets = [
            {
                title: "Event Ticket",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                stock: 100,
                seller_id: "seller123",
                price: 25.99,
                published: true,
                icon: "ticket-icon.png",
                checkin_code: 123456,
                pictures: ["image1.jpg", "image2.jpg"],
                event_type: "Concert",
                tags: ["music", "live", "concert"],
                address: "123 Main St, City, Country",
                event: {
                    start_time: "2024-02-20T08:00:00",
                    end_time: "2024-02-20T12:00:00",
                    day: "2024-02-20"
                }
            },
            {
                title: "Workshop Ticket",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                stock: 50,
                seller_id: "seller456",
                price: 50.50,
                published: true,
                icon: "workshop-icon.png",
                checkin_code: 789012,
                pictures: ["image3.jpg", "image4.jpg"],
                event_type: "Workshop",
                tags: ["workshop", "learning", "education"],
                address: "456 Elm St, City, Country",
                event: {
                    start_time: "2024-03-15T10:00:00",
                    end_time: "2024-03-15T16:00:00",
                    day: "2024-03-15"
                }
            }
        ];
        
        return res.status(200).json(createdTickets)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

//returns the transactions listed for all tickets
// router.get("/transactions", [verifyToken, verifySeller],async(req,res)=>{
//     try{
//         console.log("Hi")
//         // console.log(req.user._id)
//         const transactions = await Transactions.aggregate([
//             {
//               $lookup: {
//                 from: "tickets", // The name of the tickets collection
//                 localField: "ticket_id",
//                 foreignField: "_id", // Assuming ticket_id in transactions matches _id in tickets
//                 as: "ticket"
//               }
//             },
//             {
//               $unwind: "$ticket" // Unwind the array created by the lookup
//             },
//             {
//               $match: {
//                 "ticket.seller_id": new mongoose.Types.ObjectId(req.user._id) // Filter by the specific seller ID
//               }
//             }
//           ]);
//           console.log(transactions)
//         const testTransactions = [
//             {
//                 email: "user1@example.com",
//                 expiration_date: new Date("2024-03-01"),
//                 ticket_number: "T123456",
//                 ticket_id: "ticket123",
//                 seller_id: "seller123",
//                 amount: 25.99,
//                 order_date: Date.now(),
//                 _id: "gojrtoirtoihrtio"
//             },
//             {
//                 email: "user2@example.com",
//                 expiration_date: new Date("2024-03-15"),
//                 ticket_number: "T789012",
//                 ticket_id: "ticket456",
//                 seller_id: "seller456",
//                 order_date: Date.now(),
//                 amount: 50.50,
//                 _id: "540t045904590"
//             }
//         ];
//         return res.status(200).json(transactions)
//     }catch(error){
//         console.log(error.message)
//         return res.status(500).json({message: error.message})
//     }
// })

//returns the statistics of the ticket
router.get("/ticket/:id", [verifyToken, verifySeller], async (req,res)=>{
    const {id} = req.params
    try{
        const ticketData = await Tickets.findById(id)
        const transactions = await Transactions.find({seller_id: req.user._id, ticket_id: id}).sort({order_date: -1})
        const transData = await Transactions.aggregate([
            {
                $match: {
                    ticket_id: id // Filter transactions for the specific ticket ID
                }
            },
            {
                $group: {
                    _id: "$ticket_id", // Group transactions by ticket_id (should be unique since we're filtering by a specific ticket ID)
                    revenue: { $sum: "$amount" }, // Calculate total revenue for the specific ticket ID
                    sold: { $sum: 1 } // Count the number of transactions for the specific ticket ID
                }
            },
            {
                $project: {
                    _id: 0,
                    revenue: 1,
                    sold: 1
                }
            }
        ])
        const ticketDatas = {name: "BingChilling", price: 20, checkin_code: 30}
        return res.status(200).json({transactions: transData[0], ticket: ticketData})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})



module.exports = router