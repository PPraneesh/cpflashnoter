const Razorpay = require("razorpay");
require("dotenv").config();

var razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY_LIVE,
    key_secret: process.env.RAZORPAY_API_SECRET_LIVE,
  });

module.exports = razorpay;