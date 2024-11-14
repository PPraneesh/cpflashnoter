const db = require("../config/db");

async function handleUser(req, res) {
  const { name, email, photo } = req.body;
  const currentTime = Date.now();
  const userRef = db.collection("users").doc(email);

  try {
    const doc = await userRef.get();

    if (!doc.exists) {
      // Create new user
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
      // Retrieve user data
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.send({ status: false, reason: "User not found" });
      }

      const userDataStats = userDoc.data();
      res.send({ status: true, userData: userDataStats });
    }
  } catch (error) {
    console.error("Error in handleUser:", error);
    res.send({ status: false, reason: "Error in handleUser" });
  }
}

module.exports = { handleUser };