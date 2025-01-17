const db = require("../config/db");
const crypto = require("crypto");
const { tier } = require("../helper/tierDeterminer");
const {userDataMasker} = require("../helper/dataMasker");

async function save_cp(req, res) {
  let user_email = req.user.email;
  const userRef = db.collection("users").doc(user_email);

  await userRef
    .get()
    .then(async (doc) => {
      if (doc.exists) {
        let userData = doc.data();
        const output = tier(userData);
        userData = output.userData;
        if (userData.saves.quests > 0) {
          let uuid_code = crypto.randomBytes(16).toString("hex");
          let nextRevision = new Date();
          nextRevision.setHours(0, 0, 0, 0);

          let cp = {
            id: uuid_code,
            question: req.body.question,
            code: req.body.code,
            isPublic: false,
            ...req.body.output,
            revObj: {
              revNum: 1,
              nextRev: nextRevision,
              lastRev: Date.now(),
            },
          };
          let categories = cp.categories || [];
          // Initialize userData.categories as an array if it doesn't exist
          userData.categories = userData.categories || [];
          // Update category counts
          categories.forEach((categoryName) => {
            let existingCategory = userData.categories.find(
              (c) => c.categoryName === categoryName
            );
            if (existingCategory) {
              existingCategory.count++;
            } else {
              userData.categories.push({ categoryName, count: 1 });
            }
          });

          let cpRef = userRef.collection("cp").doc(uuid_code);
          try {
            await cpRef.set(cp);
            userData.saves.quests -= 1;
            userData.saves.lastSave = Date.now();

            //update the data
            await userRef.update(userData);
            // only send required data to the client
            userData = userDataMasker(userData);
            res.send({ status: true, userData: userData });
          } catch (error) {
            console.error("Error updating user data:", error);
            res.status(500).send({ status: false, reason: error.message });
          }
        } else {
          const currentTime = Date.now();
          const timeRemaining = 24 * 60 * 60 * 1000 - (currentTime - userData.saves.lastSave);
          let nextSaveTime = new Date(currentTime + timeRemaining);
          res.send({
            status: false,
            reason: `try at this time: ${nextSaveTime.toLocaleString()}`,
          });
        }
      } else {
        res.send({ status: false, reason: "user doesn't exists : /" });
      }
    })
    .catch((error) => {
      console.error("Error fetching user document: ", error);
      res.send({
        status: false,
        reason: "some error occurred, reload and try again",
      });
    });
}

async function get_cp(req, res) {
  let user_email = req.user.email;
  if (user_email) {
    const userRef = db.collection("users").doc(user_email);
    const cpSnapshot = await userRef.collection("cp").get();
    const cpList = cpSnapshot.docs.map((doc) => doc.data());
    return res.send({
      status: true,
      cp_docs: cpList,
    });
  }
}

async function get_cp_category(req, res) {
  let { email } = req.user;
  let category = req.body.category;
  if (email && category) {
    const userRef = db.collection("users").doc(email);
    const cpSnapshot = await userRef
      .collection("cp")
      .where("categories", "array-contains", category)
      .get();
    const cpList = cpSnapshot.docs.map((doc) => doc.data());
    return res.send({
      status: true,
      cp_docs: cpList,
    });
  }
}

async function delete_cp_controller(req, res) {
  let { email } = req.user;
  let cp_id = req.body.cp_id;

  if (!email || !cp_id) {
    return res
      .status(400)
      .send({ status: false, reason: "Missing required parameters" });
  }

  try {
    const userRef = db.collection("users").doc(email);
    const cpRef = userRef.collection("cp").doc(cp_id);
    // upon deletion handle that categories which is in user data, find that category and decrement the count if count is 1 then remove that category from user data
    const userData = (await userRef.get()).data();
    const cpData = (await cpRef.get()).data();
    const categories = cpData.categories || [];
    categories.forEach((categoryName) => {
      let existingCategory = userData.categories.find(
        (c) => c.categoryName === categoryName
      );
      if (existingCategory) {
        existingCategory.count--;
        if (existingCategory.count === 0) {
          userData.categories = userData.categories.filter(
            (c) => c.categoryName !== categoryName
          );
        }
      }
    });
    await userRef.update(userData);
    await cpRef.delete();
    res.send({ status: true });
  } catch (error) {
    res.send({ status: false, reason: error });
  }
}

async function share_cp_controller(req, res) {
  let { email } = req.user;
  let cp_id = req.body.cp_id;
  const userRef = db.collection("users").doc(email);
  const cpRef = userRef.collection("cp").doc(cp_id);
  const publicCpRef = db.collection("public_cp").doc(cp_id);
  try {
    const doc = await cpRef.get();
    if (!doc.exists) {
      return res.send({ status: false, reason: "cp not found" });
    }
    let cp = doc.data();
    cp.isPublic = true;
    const data = await userRef.get();
    let userData = data.data();

    let publicLinks = userData.publicLinks || [];
    publicLinks = [...publicLinks, { cp_id: cp_id, name: cp.name }];
    userData.publicLinks = publicLinks;
    // Update both documents and user data in parallel
    await Promise.all([
      publicCpRef.set(cp),
      cpRef.set(cp),
      userRef.update({
        publicLinks: publicLinks,
      }),
    ]);

    userData = userDataMasker(userData);
    return res.send({ status: true, userDataStats: userData });
  } catch (error) {
    return res.send({ status: false, reason: error.message });
  }
}

async function get_public_cp_controller(req, res) {
  let cp_id = req.body.cp_id;
  const publicCpRef = db.collection("public_cp").doc(cp_id);
  await publicCpRef.get().then((doc) => {
    if (doc.exists) {
      res.send({ status: true, cp: doc.data() });
    } else {
      res.send({ status: false, reason: "cp not found" });
    }
  });
}

async function delete_public_cp_controller(req, res) {
  let cp_id = req.body.cp_id;
  let user_email = req.user.email;
  const userRef = db.collection("users").doc(user_email);
  const cpRef = userRef.collection("cp").doc(cp_id);
  cpRef.get().then(async (doc) => {
    if (doc.exists) {
      const publicCpRef = db.collection("public_cp").doc(cp_id);
      let cp = doc.data();
      cp.isPublic = false;
      cpRef.set(cp);

      const userDoc = await userRef.get();
      let userData = userDoc.data();
      let publicLinks = userData.publicLinks || [];
      publicLinks = publicLinks.filter((link) => link.cp_id !== cp_id);
      await userRef.update({ publicLinks: publicLinks });
      userData.publicLinks = publicLinks;
      await publicCpRef
        .delete()
        .then(() => {
          userData = userDataMasker(userData);
          res.send({ status: true, userDataStats: userData });
        })
        .catch((error) => {
          console.log(error);
          res.send({ status: false, reason: error });
        });
    } else {
      console.log("cp not found");
      res.send({ status: false, reason: "cp not found" });
    }
  });
}

async function edit_cp(req, res) {
  let cp_id = req.body.cp_id;
  let user_email = req.user.email;
  let cp_data = req.body.cp_data;
  const userRef = db.collection("users").doc(user_email);
  const cpRef = userRef.collection("cp").doc(cp_id);
  await cpRef.get().then(async (doc) => {
    if (doc.exists) {
      await cpRef
        .update(cp_data)
        .then(() => {
          return res.send({ status: true });
        })
        .catch((error) => {
          console.log(error);
          res.send({ status: false, reason: error });
        });
    } else {
      res.send({ status: false, reason: "cp not found" });
    }
  });
}

module.exports = {
  save_cp,
  get_cp,
  get_cp_category,
  edit_cp,
  delete_cp_controller,
  share_cp_controller,
  get_public_cp_controller,
  delete_public_cp_controller,
};
