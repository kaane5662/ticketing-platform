const express = require("express")
const router = express.Router()
const Ticket = require("../schemas/Ticket")
const Profile = require("../schemas/Profile")
const PaypalInvoice = require("../schemas/PaypalInvoice")
const { verifyToken } = require("../jwtMiddleware")
const stripe = require("stripe")(process.env.STRIPE_KEY)
const {uploadEventIcons, uploadEventImages} = require("../uploadMiddleware")
const multer = require("multer")
const Transactions = require("../schemas/Transactions")
const crypto = require("crypto")
const generateCheckInCode = require("../helpers/generateCheckInCode")
const { verifySeller } = require("../sellerMiddleware")
const fs = require('fs').promises;
const path = require('path');
const axios = require("axios")
const { PAYPAL_API,getAccessToken } = require("../config/paypal")

//route that allows sellers to create a ticket
router.post("/" ,[verifyToken, verifySeller],async(req,res)=>{
    let {title, description,stock,price,line,state,event_type,address,day, start_time, end_time, tickets, published} = req.body
    
    
//     res.set('Location', `${process.env.CLIENT_DOMAIN}/seller/verify`);
//   // Set the status code to indicate a redirect (301 for permanent redirect, 302 for temporary)
//     res.status(302).send();
//     return
    //edit user id
    
    // if(matchingProfile.stripe_boarded == null || matchingProfile.stripe_connected_id == null) return res.status(500).json({message: "Not a boarded account"})
    try{
        
        // console.log("hi")
        // console.log(req.file)
        // console.log("stock")
        // console.log(req.body)
        if(title.length < 5) return res.status(500).json({message: "Title is too short"})
        if(tickets.length < 1) return res.status(400).json({message: "Must have at least one ticket"})
        if(description.length < 5) description = ""
        if(address.length < 5) return res.status(500).json({message: "Description is too short"})
        const matchingProfile = Profile.findById(req.user._id)
        // console.log(matchingProfile)
        matchingProfile.paypal_email
        if(!matchingProfile.paypal_email) return res.status(403).json({message:"Must connect a paypal email"})
    
        //tickets validation
        for(let i = 0; i < tickets.length; i++){
            console.log(tickets[i])
            if( typeof(tickets[i].price) != "number" || typeof(tickets[i].stock)!= "number" ) return res.status(400).json({message:`Invalid input type: ${tickets[i].name}`})
            if(tickets[i].price < 0 || tickets[i].price < .5  ) return res.status(500).json({message: `Invalid price: ${tickets[i].name}`}) 
            if(tickets[i].stock < 0) return res.status(500).json({message: `Invalid stock : ${tickets[i].name}`})

        }
        
        // return;
        // console.log(req.user)
        const newTicket = new Ticket({
            title,
            description,
            published,
            // stock,
            // price,
            tickets: tickets,
            event_type,
            checkin_code: generateCheckInCode(),
            seller_id: req.user._id,
            // icon: req.file.filename,
            address,
            event: {
                start_time,
                end_time,
                day
            }
        })
        const savedTicket = await newTicket.save()
        return res.status(201).json({message: "Ticket contents created successfully", ticket_id: savedTicket._id})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
    
})

router.post("/upload/:id",[verifyToken, verifySeller, uploadEventIcons.single("icon")], async(req,res)=>{
    const {id} = req.params
    try{
        console.log(req.file.filename)
        const updatedIcon = await Ticket.findByIdAndUpdate(id, {icon: req.file.filename})
        res.status(200).json({message: "Icon uploaded successfully"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})
//update the ticket contents
router.put("/:id", [verifyToken, verifySeller ,uploadEventIcons.fields([{name:"icon", maxCount:1}])],async(req,res)=>{
    const {id} = req.params
    let {title, description,stock,price,line,state,event_type,address,day, start_time, end_time, tickets, published} = req.body
    console.log(price)
    try{
        // console.log(price>40)
        if(title && title.length < 5) return res.status(500).json({message: "Title is too short"})
        if(description && description.length < 5) return res.status(500).json({message: "Description is too short"})
        if(address && address.length < 5) return res.status(500).json({message: "Description is too short"})
        //this is formData so neccesary
        tickets = await JSON.parse(tickets)
        if(tickets.length < 1) return res.status(400).json({message: "Must have at least one ticket"})
        console.log(tickets)
        //tickets validation
        for(let i = 0; i < tickets.length; i++){
            console.log(tickets[i])
            if( typeof(tickets[i].price) != "number" || typeof(tickets[i].stock)!= "number" ) return res.status(400).json({message:`Invalid input type: ${tickets[i].name}`})
            if(tickets[i].price < 0 || tickets[i].price < 1  ) return res.status(500).json({message: `Invalid price: ${tickets[i].name}`})
            if(tickets[i].stock < 1) return res.status(500).json({message: `Invalid stock : ${tickets[i].name}`})

        }
        // return
        const matchingTicket = await Ticket.findById(id)
        
        if(matchingTicket.seller_id != req.user._id) return res.status(500).json({message: "You do not own this ticket"})
        if(title) matchingTicket.title = title
        if(description) matchingTicket.description = description
        if(stock) matchingTicket.stock = stock
        if(price) matchingTicket.price = price
        if(address) matchingTicket.address = address
        if(day) matchingTicket.event.day = day
        if(start_time) matchingTicket.event.start_time = start_time
        if(end_time) matchingTicket.event.end_time = end_time
        if(event_type) matchingTicket.event_type = event_type
        if(published) matchingTicket.published = published
        if(tickets) matchingTicket.tickets = tickets
        if(req.files["icon"]) matchingTicket.icon = req.files["icon"][0].filename
        await matchingTicket.save()
        return res.status(200).json({message: "Ticket updated successfully"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

//delete the ticket of current id
router.get("/delete/:id", [verifyToken, verifySeller],async(req,res)=>{
    const {id} = req.params
    // console.log(id)
    try{
        const matchingTicket = await Ticket.findById(id)
        if(matchingTicket.seller_id != req.user._id) return res.status(403).json({message: "You do not own this ticket"})
        let eventDate = new Date(matchingTicket.event.day)
        eventDate.setDate(eventDate.getDate()+1)
        const currentDate = new Date(Date.now()) 
        if(eventDate > currentDate) return res.status(500).json({message: "Can't delete event until day after event"})
        fs.unlink(path.join(__dirname, '../uploads/event-icons', matchingTicket.icon)).then((res)=>console.log(res)).catch((err)=>console.log(err))
        await Transactions.deleteMany({ticket_id: id})
        await Ticket.findByIdAndDelete(id)
        return res.status(200).json({message: "Ticket and ticket data deleted successfully"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})


router.post("/purchase/:id",async(req,res)=>{
    const {id} = req.params
    const {tickets} = req.body
    try {
       
        const matchingTicket = await Ticket.findById(id)
        // console.log(quantity)
        // console.log(matchingTicket)
        const matchingSeller = await Profile.findById(matchingTicket.seller_id)
        // if(matchingSeller.stripe_connected_id == null) return res.status(500).json({message: "Ticket does not have a connected stripe account somehow"})
        // if(matchingTicket.stock-quantity <= 0) return res.status(500).json({message: "Ticket has run out of stock!"})
        // console.log(matchingTicket.price)
        const ticketVariants = matchingTicket.tickets.length > 0 ? matchingTicket.tickets : [{name: "Entry", price: matchingTicket.price, stock: matchingTicket.stock}]
        //set up map
        const ticketsMap = {}
        ticketVariants.forEach((ticketVariant, index)=>{
            // console.log(ticketVariant)
            ticketsMap[ticketVariant.name] =ticketVariant
        })
        //loop through client tickets
        let totalPrice = 0;
        let quantityTax = 0;
        let purchaseData = ""
        for(let i = 0; i < tickets.length; i++){
            const ticket = tickets[i]
            //check through the database ticket map
            const ticketData = ticketsMap[ticket.name]
            if(!ticketData) return res.status(400).json({message: "A specific ticket has not been found, this means a ticket was either modified or removed, please refresh the page"})
            if(ticket.quantity <= 0) continue
            const avaliableStock = ticketData.stock - ticket.quantity
            console.log(avaliableStock)
            if(avaliableStock< 0) return res.status(400).json({message: `Not enough stock for: ${ticket.name}`})
            console.log(ticketData)
            totalPrice += ticketData.price * ticket.quantity
            quantityTax += ticket.quantity*.99
            purchaseData += ticket.name +" x"+ticket.quantity+": $"
            purchaseData += (ticketData.price * ticket.quantity) +", "
        }
        
        // totalPrice *= 100;
        let totalTax = Math.floor(totalPrice*.1)
        const buyerPrice = Number(totalPrice + quantityTax + totalTax).toFixed(2)
        const applicationFee = Number(quantityTax+totalTax).toFixed(2)
        purchaseData += "Fees: $"+applicationFee

        // console.log(ticketMap)
        console.log(tickets)
        const invoice = new PaypalInvoice({
            tickets: tickets,
            fees:applicationFee,
            amount: totalPrice
        })
        invoice.save()
        console.log(invoice)
        
        const accessToken = await getAccessToken()
        const validTickets= tickets.filter((ticket)=>ticket.quantity > 0)
        const items = validTickets.map((ticket,i)=>{ return {name:ticket.name, unit_amount: {currency_code:"USD", value:ticket.price}, quantity:ticket.quantity}})
        items.push({
            name:"Fees",
            unit_amount: {currency_code:"USD", value:applicationFee},
            quantity:1
        })
        // console.log(items)
        const order = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: buyerPrice,// Modify as needed
                        "breakdown": {
                            "item_total": {
                                "currency_code": "USD",
                                "value": buyerPrice
                            }
                        }
                    },
                    
                    custom_id: matchingTicket._id,
                    invoice_id: invoice._id,
                    items
                    // items: [{
                    //     name: 'Entry',
                        
                    //     "unit_amount": {
                    //         "currency_code": "USD",
                    //         "value": 24.44
                    //     },
                    //     quantity: 1,
                        
                    //     sku: 'sku0',
                        
                    // }]
            
                }
            ],
           
            application_context: {
                brand_name:"SwftT LLC",
                return_url: `${process.env.CLIENT_DOMAIN}`,
                cancel_url: `${process.env.CLIENT_DOMAIN}/ticket/${id}`,
                user_action: "PAY_NOW",
                // landing_page: "BILLING",
                landing_page: 'NO_PREFERENCE', // Guest checkout
            }
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
        
        
        const url = order.data.links.find((link)=>link.rel == "approve")

        console.log(url)
        return res.status(201).json({url: url.href})

    }catch(error){
        console.log(error.response?.data)
        return res.status(500).json({message: error.message})
    }
})



router.get("/:id", async(req,res)=>{
    const {id} = req.params
    // console.log(id)
    try{
        const TicketData = await Ticket.findById(id)
        if(!TicketData.published) return res.status(500).json({message: "Ticket is not published!"})
        return res.status(200).json(TicketData)
    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

router.get("/", async(req,res)=>{
    
    // console.log(id)
    try{
        const TicketData = await Ticket.find({published: true})
        return res.status(200).json(TicketData)
    }catch(error){
        console.log(error.response)
        return res.status(500).json({message: error.message})
    }
})



//fetches scanner data
router.put("/checkin/:id", async(req,res)=>{
    const {id} = req.params
    const {checkin_code} = req.body
    try{
        // console.log(checkin_code)
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
        // console.log(ticket_number, id)
        
        const matchingTicketNumber = await Transactions.findOne({ticket_id:id, ticket_number})
        if(matchingTicketNumber == null ) return res.status(500).json({message: "Invalid code"})
        
        if(matchingTicketNumber.expiration_date <= Date.now()) return res.status(500).json({message: `Ticket has expired: ${matchingTicketNumber?.ticket_title || "Entry"}`})
        matchingTicketNumber.expiration_date = Date.now()
        await matchingTicketNumber.save()
        return res.status(201).json({message: `Check in success: ${matchingTicketNumber?.ticket_title || "Entry"}`})
        
    }catch(error){
        console.log(error)
        return res.status(500).json({message:error.message})
    }
    
})




module.exports = router