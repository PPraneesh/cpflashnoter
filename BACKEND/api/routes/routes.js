const express = require('express');
const router = express.Router();
const { llm_controller } = require('../controllers/llm_controller');
const { handleUser } = require('../controllers/user_controller');  
const { cp_controller,get_cp, delete_cp_controller,share_cp_controller,get_public_cp_controller, delete_public_cp_controller, edit_cp, get_cp_category } = require('../controllers/cp_controller');

router.get('/', (req, res) => {
    res.send('welcome to the backend of cpflashnoter');
    }
);

router.post('/process_code',llm_controller);
router.post('/user_login',handleUser);
router.post('/get_cp',get_cp);
router.post('/get_cp_category',get_cp_category);
router.post('/save_cp',cp_controller);
router.post("/delete_cp",delete_cp_controller)
router.post("/edit_cp",edit_cp)
router.post("/share_cp",share_cp_controller);
router.post("/get_public_cp",get_public_cp_controller);
router.post("/delete_public_cp",delete_public_cp_controller);
module.exports = router;