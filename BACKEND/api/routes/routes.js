const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middlewares/auth.middleware");

const { notes_generator, generatePrepAnalysis } = require("../controllers/llm.controller");

const {
  handleUser,
  onboarding,
  getUserData,
} = require("../controllers/userdata.controller");

const {
  get_cp,
  delete_cp_controller,
  share_cp_controller,
  get_public_cp_controller,
  delete_public_cp_controller,
  edit_cp,
  get_cp_category,
  save_cp,
} = require("../controllers/questions.controller");

const {
  getRevise,
  updateRev,
  getAnalytics,
} = require("../controllers/revise.controller");

const { payment_controller, payment_success_handler } = require("../controllers/payment.controller");

router.get("/", (req, res) => {
  res.send("welcome to the backend of cpflashnoter");
});


router.post("/onboarding", authenticateUser, onboarding);
router.post("/user_login", handleUser);

router.get("/get_cp", authenticateUser,get_cp);
router.post("/get_cp_category", authenticateUser, get_cp_category);

router.get("/get_user_data", authenticateUser, getUserData);

router.post("/process_code", authenticateUser, notes_generator);
router.post("/prep_analysis",authenticateUser, generatePrepAnalysis);

router.post("/save_cp", authenticateUser, save_cp);


router.delete("/delete_cp", authenticateUser, delete_cp_controller);
router.put("/edit_cp", authenticateUser, edit_cp);
router.post("/share_cp", authenticateUser, share_cp_controller);
router.post("/get_public_cp", get_public_cp_controller);
router.put("/delete_public_cp", authenticateUser, delete_public_cp_controller);

router.get("/rev", authenticateUser, getRevise);
router.post("/sch_next_rev", authenticateUser, updateRev);
router.get("/analytics", authenticateUser, getAnalytics);

router.get("/payment", authenticateUser, payment_controller);
router.post("/success", authenticateUser, payment_success_handler);
module.exports = router;
