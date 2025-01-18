const db = require("../config/db");
const { tier } = require("../helper/tierDeterminer");
const { userDataMasker } = require("../helper/dataMasker");
async function handleUser(req, res) {
  const email = req.body.email;
  const { name, photo } = req.body;
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
          lastSave: Date.now(),
        },
        generations: {
          count: 3,
          lastGen: Date.now(),
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
      let output = tier(userData);
      output.userData = userDataMasker(output.userData);
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
    output.userData = userDataMasker(output.userData);
    if(output.status)
    res.send({ status: true, userData: output.userData, newUser: output.newUser });
  } catch (error) {
    console.error("Error in getUpdatedData:", error);
    res.send({ status: false, reason: "Error in getUpdatedData" });
  }
}

module.exports = { handleUser, onboarding, getUserData };
