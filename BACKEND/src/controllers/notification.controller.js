const db = require("../config/db");

async function notification_controller(req, res) {
    const user_email = req.user.email;
    const token = req.body.token;

    const userRef = db.collection("users").doc(user_email);
    await userRef.set({ fcmToken: {token: token, createdAt: Date.now()} }, { merge: true })
    .then(()=>{
        res.send({ status: true });
    })
    .catch((error)=>{
        console.error(error);
        res.send({ status: false });
    });
}

async function remove_notification_token (req,res){
    const user_email = req.user.email;
    const userRef = db.collection("users").doc(user_email);
    await userRef.set({ fcmToken: {
        token: "",
        createdAt: 0
    } }, { merge: true })
    .then(()=>{
        res.send({ status: true });
    })
    .catch((error)=>{
        console.error(error);
        res.send({ status: false });
    });
}

module.exports={notification_controller, remove_notification_token}