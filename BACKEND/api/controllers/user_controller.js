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
      // update the saves, generations based on the current time
      const lastSave = userDataStats.saves.last_save;
      const lastGen = userDataStats.generations.last_gen;
      const timeDiffSave = Math.floor((currentTime - lastSave) / 1000);
      const timeDiffGen = Math.floor((currentTime - lastGen) / 1000);

      if (timeDiffSave >= 86400 || timeDiffGen >= 86400) {
        userDataStats.saves.quests = 3;
        userDataStats.generations.count = 5;
        userDataStats.saves.last_save = currentTime;
        userDataStats.generations.last_gen = currentTime;
      }

      // Update the document in Firestore
      await userRef.update(userDataStats);

      res.send({ status: true, userData: userDataStats });
    }
  } catch (error) {
    console.error("Error in handleUser:", error);
    res.send({ status: false, reason: "Error in handleUser" });
  }
}

module.exports = { handleUser };