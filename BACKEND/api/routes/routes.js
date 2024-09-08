const express = require('express');
const router = express.Router();
const { llm_controller } = require('../controllers/llm_controller');
const { handleUser } = require('../controllers/user_controller');  
const { cp_controller } = require('../controllers/cp_controller');

router.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

router.post('/process_code',llm_controller);

router.post('/user_login',handleUser);

router.post('/save_cp',cp_controller);

module.exports = router;