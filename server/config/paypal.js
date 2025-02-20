const axios = require("axios")
const cyrpto = require("crypto")
const dotenv = require("dotenv")
dotenv.config()
console.log(process.env.PAYPAL_CLIENT_ID)
// PayPal API Base URL
const PAYPAL_API = process.env.PAYPAL_MODE === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

console.log(PAYPAL_API)
// Get OAuth Token
const getAccessToken = async () => {
  
  const response = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, "grant_type=client_credentials", {
    auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET
    },
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
});
  console.log("Good scope")
  return response.data.access_token;
};
const getPartnerAccessToken = async () => {
  const auth = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`;
  const response = await axios.post(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        scope: "partner.referrals", // Request this scope
      },
    }
  );
  return response.data.access_token;
};

async function verifyWebhook(req) {
  const webhookHeaders = req.headers;
  const webhookPayload = JSON.stringify(req.body);

  const transmissionId = webhookHeaders['paypal-transmission-id'];
  const transmissionTime = webhookHeaders['paypal-transmission-time'];
  const certUrl = webhookHeaders['paypal-cert-url'];
  const transmissionSig = webhookHeaders['paypal-transmission-sig'];

  // Download the PayPal certificate (this URL is from the headers)
  const certificate = await axios.get(certUrl, { responseType: 'text' });

  // Construct the string for signature verification
  const verificationString = `${transmissionId}|${transmissionTime}|${webhookPayload}`;

  // Create the signature with the public certificate
  crypto
  const verify = crypto.subtle.verify('SHA256');
  verify.update(verificationString);
  const isValid = verify.verify(certificate.data, transmissionSig, 'base64');

  return isValid;
}


async function transferFundsToSeller(amount, email= "sb-oq43k037905362@personal.example.com") {
  try {
      // Get PayPal OAuth token
      const accessToken = await getAccessToken();

      // Define the payout payload
      const payoutData = {
          sender_batch_header: {
              sender_batch_id: `batch_${Date.now()}`, // Unique batch ID
              email_subject: 'You have received a payment',
          },
          items: [
              {
                  recipient_type: 'EMAIL', // PayPal account type
                  amount: {
                      value: amount,
                      currency: 'USD', // Currency code
                  },
                  receiver: email, // Seller's PayPal email
                  note: 'Payment for the order', // Optional note to the seller
                  sender_item_id: `item_${Date.now()}`, // Unique item ID for the transaction
              },
          ],
      };

      // Send payout request to PayPal
      const response = await axios.post(
          `${PAYPAL_API}/v1/payments/payouts`,
          payoutData,
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
              },
          }
      );

      // Check the response and handle accordingly
      if (response.data.batch_header.batch_status === 'PENDING') {
          console.log('Payout created successfully, waiting for processing.');
      } else {
          console.log('Payout failed:', response.data);
      }
  } catch (error) {
      console.error('Error transferring funds to seller:', error.response?.data || error.message);
      throw new Error('Failed to transfer funds to the seller');
  }
}


module.exports = {PAYPAL_API,getAccessToken,verifyWebhook,transferFundsToSeller}