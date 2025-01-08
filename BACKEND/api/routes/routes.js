const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { llm_controller } = require("../controllers/llm_controller");
const {
  handleUser,
  onboarding,
  getUserData,
} = require("../controllers/user_controller");
const {
  cp_controller,
  get_cp,
  delete_cp_controller,
  share_cp_controller,
  get_public_cp_controller,
  delete_public_cp_controller,
  edit_cp,
  get_cp_category,
} = require("../controllers/cp_controller");
const { getRevise, updateRev } = require("../controllers/revise.controller");

router.get("/", (req, res) => {
  res.send("welcome to the backend of cpflashnoter");
});

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

router.post("/process_code", authenticateUser, llm_controller);
router.post("/user_login", handleUser);
router.get("/get_user_data", authenticateUser, getUserData);
router.post("/onboarding", authenticateUser, onboarding);
router.get("/get_cp", authenticateUser, get_cp);
router.post("/get_cp_category", authenticateUser, get_cp_category);
router.post("/save_cp", authenticateUser, cp_controller);
router.delete("/delete_cp", authenticateUser, delete_cp_controller);
router.put("/edit_cp", authenticateUser, edit_cp);
router.post("/share_cp", authenticateUser, share_cp_controller);
router.post("/get_public_cp", get_public_cp_controller);
router.put("/delete_public_cp", authenticateUser, delete_public_cp_controller);

router.get("/rev",authenticateUser, getRevise)
router.post("/sch_next_rev",authenticateUser,updateRev)
module.exports = router;
