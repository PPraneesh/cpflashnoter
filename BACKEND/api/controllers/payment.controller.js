const razorpay = require("../config/razorpay");
const db = require("../config/db");

function generateCompactTimestamp() {
const timestamp = Date.now().toString(36);
const random = Math.random().toString(36).substring(2, 6);
return `rt_${timestamp}_${random}`;
}
  
const payment_controller = async (req, res) => {
    const user_email = req.user.email;
    const options = {
        amount: 50 * 100,
        currency: "INR",
        receipt: generateCompactTimestamp(), 
      };
      const userRef = db.collection("users").doc(user_email);
      await userRef
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        razorpay.orders.create(options, async function (err, order) {
            if (err) {
                console.log("erhe",err);
                res.send({ status: false, reason: "payment gateway issue" });
            } else {
                res.send({ status: true, order_id: order.id });
            }
            });
      }else{
            res.send({ status: false, reason: "User not found" });
      }})
    .catch((error) => {
        console.error("errr",error);
        res.send({ status: false, reason: "Error in payment" });
    });
}   

const payment_success_handler = async (req,res)=>{
    const { order_id, payment_id, payment_signature } = req.body;
    const user_email = req.user.email;
    const userRef = db.collection("users").doc(user_email);
    
    try{
        await razorpay.payments.fetch(payment_id)
        .then(async function (payment) {
            if(payment.status === "captured"){
                await userRef
                .get()
                .then(async (doc) => {
                    if (doc.exists) {
                        const userDataStats = doc.data();
                        userDataStats.premium = {
                            startDate:  new Date(),
                            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                            paymentId: payment_id,
                            orderId: order_id
                        };
                        userDataStats.saves = {
                            quests: 10,
                            lastSave: Date.now(),
                        };
                        userDataStats.generations = {
                            count: 10,
                            lastGen: Date.now(),
                        };

                        await userRef.update(userDataStats);
                        res.send({ status: true });
                    }else{
                        res.send({ status: false, reason: "User not found" });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    res.send({ status: false, reason: "Error in payment" });
                });
            }else{
                res.send({ status: false, reason: "Payment not captured" });
            }
        });
    }catch(error){
        console.error("nid",error);
        res.send({ status: false, reason: "Error in payment" });
    }
}
module.exports = { payment_controller, payment_success_handler };