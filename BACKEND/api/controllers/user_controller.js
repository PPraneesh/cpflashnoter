const db = require("../config/db");
function user_controller(req, res) {
  const { name, email, photo } = req.body;
  let currentTime = Date.now();
  const userRef = db.collection("users").doc(email);
  userRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        userRef.set({
          name: name,
          email: email,
          photo: photo,
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
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      res.send({ status: false, reason: "some error :/ userController" });
    });
}

async function user_cp(req, res) {
  const { email } = req.body;
  const userRef = db.collection("users").doc(email);
  let userData = null;
  await userRef.get()
  .then((doc) => {
    userData = doc.data();
  })
  .catch((error)=>{
    res.send({status: false, reason:"error while getting user data : /"})
  });
  await userRef
    .collection("cp")
    .get()
    .then((querySnapshot) => {
      let cp = [];
      querySnapshot.forEach((doc) => {
        cp.push(doc.data().cp);
      });
      res.send({ status: true, cp: cp, userData: userData });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      res.send({ status: false, reason: "some error : / user_cp" });
    });
}
module.exports = { user_controller, user_cp };
