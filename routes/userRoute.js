
const userControll = require('../controllers/userControll');
const express = require('express');
const router = express.Router();


// router user
router.get('/login', userControll.login_get);
router.post('/login', userControll.login_post);
router.get('/signup',userControll.signup_get);
router.post('/signup', userControll.signup_post);
router.get('/logout', userControll.userLogout);
//export
module.exports = router;