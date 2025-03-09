
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Transactions = require("./schemas/Transactions")
const nodemailer = require("nodemailer")
const qr = require("qr-image")
const app = express()
const path = require("path")
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_KEY)
const cookieParser = require('cookie-parser');
const {sendStripeVerifcationProcessing, sendStripeVerificationVerified, sendStripeVerificationDenied, sendStripeBoarded, sendTicketConfirmation} = require("./helpers/emailer")
const {verifyWebhook,transferFundsToSeller} = require("./config/paypal")


//authenication stuff
const passport = require("./auth")
// app.use(passport.initialize());


//session stuff
const session = require("express-session")
const Profile = require("./schemas/Profile")
const generateTicketNumber = require("./helpers/generateTicketNumber")
const Ticket = require("./schemas/Ticket")
const { compareSync } = require("bcryptjs")
const PaypalInvoice = require("./schemas/PaypalInvoice")

// app.use(session({
//     secret: 'your-secret-key', // Replace with a strong, randomly generated string
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } // Set to true if your application is served over HTTPS
// }));
// app.use(passport.session());

app.set('trust proxy', 1);

app.use('/uploads/icons', express.static(path.join(__dirname, 'uploads/event-icons')));
app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads/event-images')));








console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(()=> console.log("DB connected!"))
    .catch((error)=>{
        console.log(error.message)
})



const allowedOrigins = [process.env.CLIENT_DOMAIN, process.env.SUPPORT_DOMAIN];

const corsOptions = {
    origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
    },
    
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Enable cookies and authentication headers
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.post("/webhook/platform",express.raw({ type: 'application/json' }) ,async (req, res)=>{
    const sig = req.headers['stripe-signature'];
    // const rawBody = JSON.stringify(req.body)
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_PLATFORM_WEBHOOK_SECRET);
    } catch (err) {
        console.log(err.message)
        return res.status(500).send(`Webhook Error: ${err.message}`);
    }

    if(event.type == "checkout.session.completed"){
        let {customer_details, metadata, amount_total} = event.data.object;
        console.log("Checkout completed")
        //fields for customer_details
        // generate a random integer ticket number within the range of minTicketNumber and maxTicketNumber
        try{
            
            const qrData = []
            const date = new Date(metadata.date)+1
            let currentDate = new Date(metadata.day);
            let matchingTicket = await Ticket.findById(metadata.ticket_id)
            let userTickets = JSON.parse(metadata.tickets)
            const ticketsMap = {}
            //asign a map for the tickets metadata
            userTickets.forEach((ticket, index)=>{
                // console.log(ticketVariant)
                ticketsMap[ticket.name] =ticket
            })
            // console.log("Map: " +ticketsMap)
            // Add one day to the current date
            currentDate.setDate(currentDate.getDate() + 1);
            console.log(matchingTicket.tickets)
            for(let i = 0; i < matchingTicket?.tickets?.length; i++){
                //find matching ticket from metadata
                const ticketData = ticketsMap[matchingTicket.tickets[i].name]
                // console.log("Mapped Data:",ticketData)
                // console.log("Current Ticket:",matchingTicket.tickets[i])
                if(!ticketData) continue
               
                
                for(let j = 0; j < ticketData.quantity; j++){
                    if(matchingTicket.tickets[i].stock >0) matchingTicket.tickets[i].stock -= 1
                    matchingTicket.tickets[i].sold += 1; 
                    const generateRandomTicketNumber = generateTicketNumber();
                    const newTransaction = new Transactions({
                        email: customer_details.email,
                        ticket_id: metadata.ticket_id,
                        expiration_date: currentDate,
                        amount: matchingTicket.tickets[i].price,
                        ticket_number: generateRandomTicketNumber,
                        ticket_title: matchingTicket.tickets[i].name
                    })
                   
                    const qrGen =  qr.imageSync(generateRandomTicketNumber, { type: 'png', size:20 })
                    qrData.push({content: qrGen, ticket_title: matchingTicket.tickets[i].name, quantity: j+1})
                    await newTransaction.save()
                }
                delete ticketsMap[matchingTicket.tickets[i].name]
            }
            //there are some keys remaning, tickets either got deleted during processing or renamed
            const remainingKeys = Object.keys(ticketsMap)
            // console.log(remainingKeys)
            // console.log(ticketsMap)
            for(let i = 0; i < remainingKeys.length; i++){
                matchingTicket.stock -= 1;
                const key = remainingKeys[i];
                for(let j = 0; j< ticketsMap[key].quantity; j++){
                    const generateRandomTicketNumber = generateTicketNumber();
                    const newTransaction = new Transactions({
                        email: customer_details.email,
                        ticket_id: metadata.ticket_id,
                        expiration_date: currentDate,
                        amount: ticketsMap[key].price,
                        ticket_number: generateRandomTicketNumber,
                        ticket_title: key
                    })
                    
                    const qrGen = qr.imageSync(generateRandomTicketNumber, { type: 'png', size:20 })
                    qrData.push({content: qrGen, ticket_title: key, quantity: j+1})
                    await newTransaction.save()
                }
            }
            await matchingTicket.save()
            // await Ticket.findByIdAndUpdate(metadata.ticket_id,{$inc: {stock: -metadata.quantity}})
            await sendTicketConfirmation(customer_details.email,qrData,metadata.ticket_title,userTickets, amount_total, metadata.fees, metadata.ticket_address)
            console.log("Confirmation Sent")
            return res.status(200).send()
        }catch(error){
            console.log(error.message)
            return res.status(500).send()
        }      

        
        
    }

    return res.status(200).send()

})



app.post("/webhook/connect",express.raw({ type: 'application/json' }) ,async (req, res)=>{
    const sig = req.headers['stripe-signature'];
    // const rawBody = JSON.stringify(req.body)
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_CONNECT_WEBHOOK_SECRET);
    } catch (err) {
        console.log(err.message)
        return res.
        status(500).send(`Webhook Error: ${err.message}`);
    }
  
    //purchase successful
    

    //verification completed
    if(event.type == "identity.verification_session.verified"){
        dataObject = event.data.object;
        console.log(dataObject)
        const {metadata} = dataObject;
        const User = await Profile.findById(metadata._id)
        User.stripe_identity_verified = true
        await User.save()
        // console.log(dataObject)
        await sendStripeVerificationVerified(User)
        // res.redirect(`${process.env.CLIENT_DOMAIN}/checkseller`)
        // console.log("Verification has been completed")

    }
    if(event.type == 'identity.verification_session.processing'){
        // return res.redirect(`${process.env.CLIENT_DOMAIN}/checkseller`);
        const {metadata, id} = event.data.object;
        const User = await Profile.findById(metadata._id)
        User.recent_stripe_verification_session = id
        await User.save()
        await sendStripeVerifcationProcessing(User)
        
    }
    if(event.type == 'identity.verification_session.requires_input'){
        // return res.redirect(`${process.env.CLIENT_DOMAIN}/checkseller`);
        const {metadata, id} = event.data.object;
        const User = await Profile.findById(metadata._id)
        User.recent_stripe_verification_session = null
        await User.save()
        await sendStripeVerificationDenied(User)
        
    }
    //connect capabilities updated
    if (event.type == 'account.updated') {
        const {id, capabilities} = event.data.object;
        console.log("Account updated")
        // const {metadata} = account;
        console.log('Account Updated:', id);
        console.log('Capabilities:', capabilities);
        if(capabilities && capabilities["card_payments"] == "active" && capabilities["transfers"] == "active"){
            console.log("Permission enabled for card")
            try{
                const User = await Profile.findOne({stripe_connected_id: id})
                User.stripe_boarded = true
                await User.save()
                await sendStripeBoarded(User)
                return res.status(200).send()
            }catch(error){
                console.log(error.message)
                return res.status(500).send()
            }

            // await Profile.findOneAndUpdate({stripe_connected_id: account.id}, {stripe_boarded: true});
            // return res.redirect(`${process.env.CLIENT_DOMAIN}/checkseller`)
        }
        // console.log(account.capabilities)
        
        // Here you can perform actions based on the updated capabilities
      }

    
    // Handle transfer.paid event(mainly for sellers cashing out)
    if (event.type === 'transfer.paid') {
        const transfer = event.data.object;
        console.log('Transfer completed:', transfer);
        // Handle transfer completion logic here
    }

    res.send();
})


app.use(express.json())

app.post("/webhook/paypal" ,async (req, res)=>{
    
    // if (!await verifyWebhook(req)) {
    //     return res.status(400).send("Invalid webhook signature");
    // }
    try{

        const webhookEvent = await req.body;
        console.log(webhookEvent)
        if (webhookEvent.event_type === "CHECKOUT.ORDER.APPROVED") {
            const purchase = webhookEvent.resource.purchase_units[0]
            const payer = webhookEvent.resource.payer
            console.log(purchase)
            const ticketId = purchase.custom_id
    
            const qrData = []
            let matchingTicket = await Ticket.findById(ticketId)
            let ticketOwner = await Profile.findById(matchingTicket.seller_id)
            const date = new Date(matchingTicket.event.day)
            console.log(date)
            let currentDate = new Date();
            let invoice = await PaypalInvoice.findById(purchase.invoice_id)
            const userTickets = invoice.tickets
            
            
            const ticketsMap = {}
            //asign a map for the tickets metadata
            userTickets.forEach((ticket, index)=>{
                // console.log(ticketVariant)
                ticketsMap[ticket.name] =ticket
            })
            // console.log("Map: " +ticketsMap)
            // Add one day to the current date
            currentDate.setDate(currentDate.getDate() + 1);
            console.log(matchingTicket.tickets)
            for(let i = 0; i < matchingTicket?.tickets?.length; i++){
                //find matching ticket from metadata
                const ticketData = ticketsMap[matchingTicket.tickets[i].name]
                // console.log("Mapped Data:",ticketData)
                // console.log("Current Ticket:",matchingTicket.tickets[i])
                
                if(!ticketData) continue
                
                
                for(let j = 0; j < ticketData.quantity; j++){
                    if(matchingTicket.tickets[i].stock >0) matchingTicket.tickets[i].stock -= 1
                    matchingTicket.tickets[i].sold += 1; 
                    const generateRandomTicketNumber = generateTicketNumber();
                    const newTransaction = new Transactions({
                        email: payer.email_address,
                        ticket_id: ticketId,
                        expiration_date: currentDate,
                        amount: matchingTicket.tickets[i].price,
                        ticket_number: generateRandomTicketNumber,
                        ticket_title: matchingTicket.tickets[i].name
                    })
                    
                    const qrGen =  qr.imageSync(generateRandomTicketNumber, { type: 'png', size:20 })
                    qrData.push({content: qrGen, ticket_title: matchingTicket.tickets[i].name, quantity: j+1})
                    await newTransaction.save()
                }
                delete ticketsMap[matchingTicket.tickets[i].name]
            }
            //there are some keys remaning, tickets either got deleted during processing or renamed
            const remainingKeys = Object.keys(ticketsMap)
            // console.log(remainingKeys)
            // console.log(ticketsMap)
            for(let i = 0; i < remainingKeys.length; i++){
                matchingTicket.stock -= 1;
                const key = remainingKeys[i];
                for(let j = 0; j< ticketsMap[key].quantity; j++){
                    const generateRandomTicketNumber = generateTicketNumber();
                    const newTransaction = new Transactions({
                        email: customer_details.email,
                        ticket_id: metadata.ticket_id,
                        expiration_date: currentDate,
                        amount: ticketsMap[key].price,
                        ticket_number: generateRandomTicketNumber,
                        ticket_title: key
                    })
                    
                    const qrGen = qr.imageSync(generateRandomTicketNumber, { type: 'png', size:20 })
                    qrData.push({content: qrGen, ticket_title: key, quantity: j+1})
                    await newTransaction.save()
                }
            }
            await matchingTicket.save()
            // await Ticket.findByIdAndUpdate(metadata.ticket_id,{$inc: {stock: -metadata.quantity}})
            console.log(userTickets)
            console.log(qrData)
            await sendTicketConfirmation(payer.email_address,qrData,matchingTicket.title,userTickets,invoice.amount+invoice.fees,invoice.fees,matchingTicket.address)
            
            
            // Transfer funds to seller
            await transferFundsToSeller(invoice.amount,ticketOwner.paypal_email);
        }
    
        return res.status(200).send(    )
    }catch(error){
        return res.status(500).json({error:error.message})
    }


})



//routes
app.use("/profiles", require("./routes/profiles"))
app.use("/tickets", require("./routes/tickets"))
app.use("/seller", require("./routes/seller"))
app.use("/support", require("./routes/support"))

app.post("/purchase", async (req, res)=>{
    const {quantity} = req.body
    const session = await stripe.checkout.sessions.create({
        success_url: process.env.SUCCESS_URL,
        line_items: [
            {price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Test Ticket',
                  description: 'Testing ',
                },
                unit_amount: 24.99*100, // Amount in cents (e.g., $10.00)
              }
              , quantity: quantity},
        ],
        mode: 'payment'
    });
    return res.status(200).json({url: session.url})

})



app.put("/verify-purchase", async(req,res)=>{
    // get ticketNumber from the request body (its named exactly that)
    const {ticketNumber} = req.body
    // check if a ticket exists with the matching ticketNumber
    const ticketExists = await Transactions.findOne({ticket_number: ticketNumber})
    // if a ticket does not exist or is null return a json message of "Ticket does not exist" with status code 500
    if(ticketExists == null) return res.status(500).json("Ticket does not exist.")
    // if a ticket has and expiration_date before today return a json message of "Ticket has been used or is expired" with a status code of 500
    if(ticketExists.expiration_date <= Date.now()) return res.status(500).json("Ticket has been used or is expired.")
    // set the ticket expiration date to now if the ticket exists and didn't expire
    
    // save the ticket
    
    // return a json response of "Ticket does exist and has now been used." with a status code 200
    ticketExists.expiration_date = Date.now()
    await ticketExists.save()
    res.status(200).json("Ticket does exist and has now been used.")
})

app.get("/",(req,res)=>{
    res.send("Hello World")
})
const port = process.env.PORT || 3000
app.listen(port, ()=>{console.log("Listening on port "+port)})
