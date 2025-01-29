const db = require("../config/db");

async function notification_controller(req, res) {
    const user_email = req.user.email;
    const token = req.body.token;

    const userRef = db.collection("users").doc(user_email);
    await userRef.set({ fcmToken: token }, { merge: true })
    .then(()=>{
        res.send({ status: true });
    })
    .catch((error)=>{
        console.error(error);
        res.send({ status: false });
    });
}


module.exports={notification_controller}