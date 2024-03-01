
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



//authenication stuff
const passport = require("./auth")
// app.use(passport.initialize());


//session stuff
const session = require("express-session")
const Profile = require("./schemas/Profile")
const generateTicketNumber = require("./helpers/generateTicketNumber")
const Ticket = require("./schemas/Ticket")
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




const corsOptions = {
    origin: process.env.CLIENT_DOMAIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Enable cookies and authentication headers
};

app.use(cors(corsOptions));
app.use(cookieParser());


app.post("/webhook",express.raw({ type: 'application/json' }) ,async (req, res)=>{
    const sig = req.headers['stripe-signature'];
    // const rawBody = JSON.stringify(req.body)
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(err.message)
        return res.
        status(500).send(`Webhook Error: ${err.message}`);
    }
  
    //purchase successful
    if(event.type == "checkout.session.completed"){
        const {customer_details, metadata, amount_total} = event.data.object;
        console.log(event.data.object)
        //fields for customer_details
        // customer_details: {
        //     "address": {
        //       "city": null,
        //       "country": "US",
        //       "line1": null,
        //       "line2": null,
        //       "postal_code": "43985",
        //       "state": null
        //     },
        //     "email": "kaane0169@gmail.com",
        //     "name": "John Adams",
        //     "phone": null,
        //     "tax_exempt": "none",
        //     "tax_ids": []
        // }

        // generate a random integer ticket number within the range of minTicketNumber and maxTicketNumber
        try{
            
            const qrs = []
            const date = new Date(metadata.date)+1
            let currentDate = new Date(metadata.day);

            // Add one day to the current date
            currentDate.setDate(currentDate.getDate() + 1);
            for(let i = 0; i < metadata.quantity; i++){
                const generateRandomTicketNumber = generateTicketNumber();
                const qrGen = qr.imageSync(generateRandomTicketNumber, { type: 'png', size:20 })
                qrs.push(qrGen)
                const newTransaction = new Transactions({
                    email: customer_details.email,
                    ticket_id: metadata.ticket_id,
                    expiration_date: currentDate,
                    amount: Math.floor(amount_total/metadata.quantity)/100,
                    ticket_number: generateRandomTicketNumber,
                    ticket_title: metadata.ticket_title
                })
                await newTransaction.save()
            }
            await Ticket.findByIdAndUpdate(metadata.ticket_id,{$inc: {stock: -metadata.quantity}})
           
            await sendTicketConfirmation(customer_details.email,qrs,metadata.ticket_title,metadata.quantity, amount_total)
        }catch(error){
            console.log(error.message)
        }
        

       
        
    }

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
        // const {metadata} = account;
        console.log('Account Updated:', id);
        console.log('Capabilities:', capabilities);
        if(capabilities && capabilities["card_payments"] && capabilities["transfers"]){
            
            const User = await Profile.findOne({stripe_connected_id: id})
            User.stripe_boarded = true
            await User.save()
            await sendStripeBoarded(User)

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

//routes
app.use("/profiles", require("./routes/profiles"))
app.use("/tickets", require("./routes/tickets"))
app.use("/seller", require("./routes/seller"))

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

app.listen(3000, ()=>{console.log("Listening on port 3000!")})
