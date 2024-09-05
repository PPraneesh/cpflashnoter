const db = require("../config/db");

async function user_controller(req, res) {
  const { name, email, photo } = req.body;
  const currentTime = Date.now();
  const userRef = db.collection("users").doc(email);

  try {
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        name,
        email,
        photo,
        saves: {
          quests: 3,
          last_save: currentTime,
        },
        generations: {
          count: 5,
          last_gen: currentTime,
        },
      });
      res.send({ status: true });
    } else {
      res.send({ status: true, userData: doc.data() });
    }
  } catch (error) {
    console.error("Error in user_controller:", error);
    res.send({ status: false, reason: "Error in userController" });
  }
}

async function user_cp(req, res) {
  const { email } = req.body;
  const userRef = db.collection("users").doc(email);

  try {
    const [userDoc, cpSnapshot] = await Promise.all([
      userRef.get(),
      userRef.collection("cp").get()
    ]);

    if (!userDoc.exists) {
      return res.send({ status: false, reason: "User not found" });
    }

    const userData = userDoc.data();
    const cp = cpSnapshot.docs.map(doc => doc.data().cp);

    res.send({ status: true, cp, userData });
  } catch (error) {
    console.error("Error in user_cp:", error);
    res.send({ status: false, reason: "Error in user_cp" });
  }
}

module.exports = { user_controller, user_cp };