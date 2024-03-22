const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL,
    pass: process.env.AUTH_PASSWORD,
    },
});


const sendStripeVerifcationProcessing = async (User)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: User.email,
        subject: "Identity Verification Processing",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Identity Verification Processing</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Dear User,</p>
                <p>
                    Your id verification has been successfully submitted and is now processing:
                </p>
                <p>Best Regards,<br>SwiftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}
const sendStripeVerificationVerified = async(User)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: User.email,
        subject: "Identity Verified",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Identity Verification Processing</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Dear User,</p>
                <p>
                    Your ID verification was successful:
                </p>
                <p>
                    You may now create a stripe onboarding account to set up payments <a href="${process.env.CLIENT_DOMAIN}/seller/join">Here</a>.
                </p>
                <p>Best Regards,<br>SwftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}
const sendStripeVerificationDenied = async(User)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: User.email,
        subject: "Identity Verification Unsuccessful",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Identity Verification Unsuccessful</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Dear User,</p>
                <p>
                    Your ID verification was unsuccessful:
                </p>
                <p>
                    If you believe this is a mistake, please try again <a href="${process.env.CLIENT_DOMAIN}/seller/verify">Here</a>.
                </p>
                <p>Best Regards,<br>SwftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}

const sendStripeBoarded = async(User)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: User.email,
        subject: "Stripe Account Successfully Boarded",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Identity Verification Unsuccessful</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Account Boarded</h2>
                <p>Dear User,</p>
                <p>
                    Your stripe express account has successfully been boarded.
                </p>
                <p>
                    You are now eligible to create and sell tickets and transfer your profits to your bank account.
                </p>
                <p>Best Regards,<br>SwftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}

const sendTicketConfirmation = async(email, qrCodeData, ticket_title, tickets, total, fees, address)=>{
    // console.log(qrCodes)
    // let qrCodeImagesHTML = '';
    // qrCodes.forEach(qrCodeDataURL => {
    //     qrCodeImagesHTML += `<img style="width:500px; height:500px" src="${qrCodeDataURL}" alt="QR Code"></img><br>`;
    // });
    // console.log(qrCodeImagesHTML)
    let ticketGrid = ""
    tickets.map((ticket, index)=>{
        if(ticket.quantity > 0){

            ticketGrid += `<tr style = "border-top: 1px solid rgba(0,0,0,.1); border-bottom: 1px solid rgba(0,0,0,.1);">`;
            ticketGrid += `<td align="left" width="50%">${ticket.name}</td>`;
            ticketGrid += `<td align="right" width="50%">$${ticket.price*ticket.quantity} x${ticket.quantity}</td>`;
            ticketGrid += `</tr>`;
        }
    })


    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: email,
        subject: `Ticket Confirmation Email ${ticket_title}`,
        attachments: qrCodeData.map((data, index)=>{
            return(
                {
                    filename: `${data.ticket_title+data.quantity}.png`,
                    encoding: "base64",
                    content: data.content
                }

            )
        }),
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation Email</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style = "text-align: center">Purhcase Successful</h1> 
                <h2  style = "text-align: center">${ticket_title}</h2> 
                <table cellpadding="15px" cellspacing="10px"   width= "100%" style="border-collapse: collapse;">
                    <tr>
                        <td style = "font-weight: bold" align = "left" width = "50%">Name</td>
                        <td style = "font-weight: bold" align = "right" width = "50%">Amount</td>
                    </tr>
                    ${ticketGrid}
                    <tr>
                        <td style = "" align = "left" width = "50%">Fees</td>
                        <td style = "" align = "right" width = "50%">$${fees/100}</td>
                    </tr>
                    <tr>
                        <td style = "font-weight: bold" align = "left" width = "50%">Total</td>
                        <td style = "font-weight: bold" align = "right" width = "50%">$${total/100}</td>
                    </tr>
                </table>
                <p  style = "font-weight:bold; text-align: center; ">${address}</p>
                <p  style = "text-align: center; ">You can check in with the QR codes attached.</p>

            </div>
        </body>
        </html>
        
        `
    })
}

const sendSignUpConfirmation = async(User)=>{
    // console.log(qrCodes)
    // let qrCodeImagesHTML = '';
    // qrCodes.forEach(qrCodeDataURL => {
    //     qrCodeImagesHTML += `<img style="width:500px; height:500px" src="${qrCodeDataURL}" alt="QR Code"></img><br>`;
    // });
    // console.log(qrCodeImagesHTML)
    await transporter.sendMail({
        from: process.env.EMAIL_DOMAIN,
        to: User.email,
        subject: `Sign Up Confirmation`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation Email</title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Account Created</h2>
                <p>Dear User,</p>
                <p>
                    Your account was created successfully on our platform.
                </p>
                <p>
                    You now have access to sign up as a seller, or you can continue to use our platform regularly as a buyer.
                    
                </p>
                
                <p>Best Regards,<br>SwftT</p>
            </div>
        </body>
        </html>
        
        `
    })
}



module.exports = {sendStripeVerifcationProcessing, sendStripeVerificationVerified, sendStripeVerificationDenied, sendStripeBoarded, sendTicketConfirmation, sendSignUpConfirmation}