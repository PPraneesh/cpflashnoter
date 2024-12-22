const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

async function cp_controller(req, res) {
  let user_email = req.body.email;
  const userRef = db.collection("users").doc(user_email);

  await userRef
    .get()
    .then(async (doc) => {
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
          let uuid_code = uuidv4();
          let cp = {
            id: uuid_code,
            question: req.body.question,
            code: req.body.code,
            isPublic: false,
            ...req.body.output,
          };

          let cpRef = userRef.collection("cp").doc(uuid_code);
          try {
            await cpRef.set(cp);
            userData.saves.quests -= 1;
            userData.saves.last_save = currentTime;

            await userRef.update({ saves: userData.saves });

            res.send({ status: true, userData: userData });
          } catch (error) {
            console.error("Error updating user data:", error);
            res.status(500).send({ status: false, reason: error.message });
          }
        } else {
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
  let user_email = req.body.email;
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
async function delete_cp_controller(req, res) {
  let user_email = req.body.email;
  let cp_id = req.body.cp_id;
  const userRef = db.collection("users").doc(user_email);
  const cpRef = userRef.collection("cp").doc(cp_id);
  await cpRef
    .delete()
    .then(() => {
      res.send({ status: true });
    })
    .catch((error) => {
      res.send({ status: false, reason: error });
    });
}

async function share_cp_controller(req, res) {
  let user_email = req.body.email;
  let cp_id = req.body.cp_id;
   const userRef = db.collection("users").doc(user_email);
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
    const userData = data.data();

    let publicLinks = userData.publicLinks || [];
    publicLinks = [...publicLinks, {cp_id: cp_id, name: cp.name}];
    userData.publicLinks = publicLinks;
     // Update both documents and user data in parallel
    await Promise.all([
      publicCpRef.set(cp),
      cpRef.set(cp),
      userRef.update({
        publicLinks: publicLinks
      })
    ]);
     return res.send({ status: true, userDataStats:userData });
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
  let user_email = req.body.email;
  const userRef = db.collection("users").doc(user_email);
  const cpRef = userRef.collection("cp").doc(cp_id);
  cpRef.get()
  .then(async (doc)=>{
    if (doc.exists){
      const publicCpRef = db.collection("public_cp").doc(cp_id);
      let cp = doc.data();
      cp.isPublic = false;
      cpRef.set(cp);
      
      const userDoc = await userRef.get();
      const userData = userDoc.data();
      let publicLinks = userData.publicLinks || [];
      publicLinks = publicLinks.filter((link) => link.cp_id !== cp_id);
      await userRef.update({ publicLinks: publicLinks });
      userData.publicLinks = publicLinks;
      await publicCpRef
        .delete()
        .then(() => {
          res.send({ status: true, userDataStats:userData });
        })
        .catch((error) => {
          console.log(error)
          res.send({ status: false, reason: error });
        });
    }else{
      console.log("cp not found")
      res.send({ status: false, reason: "cp not found" });
    }
  })
}

async function edit_cp(req,res){
  let cp_id = req.body.cp_id;
  let user_email = req.body.email;
  let cp_data = req.body.cp_data;
  const userRef = db.collection("users").doc(user_email);
  const cpRef = userRef.collection("cp").doc(cp_id);
  await cpRef.get()
    .then(async (doc) => {
      if (doc.exists) {
        await cpRef.update(cp_data)
          .then(() => {
            return res.send({ status: true });
          })
          .catch((error) => {
            console.log(error)
            res.send({ status: false, reason: error });
          });
      } else {
        res.send({ status: false, reason: "cp not found" });
      }
    })
}
module.exports = {
  cp_controller,
  get_cp,
  edit_cp,
  delete_cp_controller,
  share_cp_controller,
  get_public_cp_controller,
  delete_public_cp_controller
};
