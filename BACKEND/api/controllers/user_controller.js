const db = require("../config/db");
const { tier } = require("../helper/tierDeterminer");

async function handleUser(req, res) {
  const email = req.body.email;
  const { name, photo } = req.body;
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
        freeTier: {
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        saves: {
          quests: 3,
          lastSave: new Date(currentTime),
        },
        generations: {
          count: 3,
          lastGen: new Date(currentTime),
        },
      };
      await userRef.set(newUser);
      res.send({ status: true, userData: newUser, newUser: true });

    } else {

      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return res.send({ status: false, reason: "User not found" });
      }

      let userData = userDoc.data();
      const output = tier(userData);
      await userRef.update(output.userData);
      res.send(output)
    }
  } catch (error) {
    console.error("Error in handleUser:", error);
    res.send({ status: false, reason: "Error in handleUser" });
  }
}

async function onboarding(req, res) {
  const email = req.user.email;
  const { userPreferences } = req.body;
  const userRef = db.collection("users").doc(email);
  try {
    await userRef.update({
      userPreferences: userPreferences,
    });
    res.send({ status: true });
  } catch (error) {
    console.error("Error in onboarding:", error);
    res.send({ status: false, reason: "Error in onboarding" });
  }
}

async function getUserData(req, res) {
  const { email } = req.user;
  const userRef = db.collection("users").doc(email);
  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.send({ status: false, reason: "User not found" });
    }
    const userDataStats = userDoc.data();
    const output = tier(userDataStats);
    await userRef.update(output.userData);
    if(output.status)
    res.send({ status: true, userData: output.userData });
    else
    res.send({ status: false, reason: output.reason, userData: output.userData });
  } catch (error) {
    console.error("Error in getUpdatedData:", error);
    res.send({ status: false, reason: "Error in getUpdatedData" });
  }
}

module.exports = { handleUser, onboarding, getUserData };
