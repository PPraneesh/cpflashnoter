const db = require('../config/db');

function cp_controller(req, res) {
    let user_email = req.body.email;
    const userRef = db.collection("users").doc(user_email);

    userRef.get()
        .then((doc) => {
            if (doc.exists) {
                let userData = doc.data();
                let currentTime = Date.now();
                let timeDiff = currentTime - userData.saves.last_save;
                let timeRemaining = 24 * 60 * 60 * 1000 - timeDiff; // 24 hours in milliseconds
                
                // Reset quests if more than 24 hours have passed since the last save
                if (timeDiff >= 24 * 60 * 60 * 1000) {
                    userData.saves.quests = 3;
                }

                if (userData.saves.quests > 0) {
                    let cp = {
                        question: req.body.question,
                        code: req.body.code,
                        ...req.body.output
                    };
                    let cpRef = userRef.collection("cp").doc(cp.name);
                    cpRef.get()
                        .then((cpDoc) => {
                            if (cpDoc.exists) {
                                res.send({ status: false, reason: "already exists" });
                            } else {
                                cpRef.set({
                                    cp: cp,
                                }).then(() => {
                                    // Update the user's saves count and last save time
                                    userData.saves.quests -= 1;
                                    userData.saves.last_save = currentTime;

                                    userRef.update({
                                        saves: userData.saves
                                    });

                                    res.send({ status: true });
                                });
                            }
                        })
                        .catch((error) => {
                            console.error("Error adding document: ", error);
                            res.send({ status: false });
                        });
                } else {
                    
                    let nextSaveTime = new Date(currentTime + timeRemaining);
                    res.send({ status: false, reason: `try at this time: ${nextSaveTime.toLocaleString()}` });
                }
            } else {
                res.send({ status: false, reason: "user doesn't exists : /" });
            }
        })
        .catch((error) => {
            console.error("Error fetching user document: ", error);
            res.send({ status: false, reason: "some error occurred, reload and try again" });
        });
}

module.exports = { cp_controller };
