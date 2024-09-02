const express = require('express');
const router = express.Router();
const { llm_controller } = require('../controllers/llm_controller');
const { user_controller, user_cp } = require('../controllers/user_controller');  
const { cp_controller } = require('../controllers/cp_controller');

router.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
router.post('/process_code',llm_controller);

router.post('/user_login',user_controller);

router.post('/add_cp',cp_controller);

router.post('/get_cp',user_cp);

module.exports = router;