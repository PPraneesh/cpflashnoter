const db = require("../config/db");

async function handleUser(req, res) {
  const email = req.body.email;
  const { name,  photo } = req.body;
  const currentTime = Date.now();
  const userRef = db.collection("users").doc(email);

  try {
    const doc = await userRef.get();

    if (!doc.exists) {
      // Create new user
      const newUser = {
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
      };
      await userRef.set(newUser);
      res.send({ status: true, userData: newUser, newUser: true });

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
      await userRef.update(userDataStats);
    let userOnboarded = userDataStats.userPreferences === undefined
    console.log(userDataStats.userPreferences)

      res.send({ status: true, userData: userDataStats, newUser: userOnboarded });
    }
  } catch (error) {
    console.error("Error in handleUser:", error);
    res.send({ status: false, reason: "Error in handleUser" });
  }
}

async function onboarding(req,res){
  const email = req.user.email;
  const { userPreferences} = req.body;
  const userRef = db.collection("users").doc(email);
  try {
    await userRef.update({
      userPreferences: userPreferences
    });
    res.send({status: true});
  } catch (error) {
    console.error("Error in onboarding:", error);
    res.send({ status: false, reason: "Error in onboarding" });
  }
}

async function getUserData(req,res){
  const {email} = req.user
  const userRef = db.collection("users").doc(email);
  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.send({ status: false, reason: "User not found" });
    }
    const userDataStats = userDoc.data();
    res.send({ status: true, userData: userDataStats });
  } catch (error) {
    console.error("Error in getUpdatedData:", error);
    res.send({ status: false, reason: "Error in getUpdatedData" });
  }
}
module.exports = { handleUser, onboarding, getUserData };