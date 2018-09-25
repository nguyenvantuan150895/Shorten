const urlControll = require('../controllers/urlControll');
const express = require('express');
const router = express.Router();


// a simple test url to check that all of our files are communicating correctly.
router.get('/shortUrl',urlControll.shortUrl_get );
router.post('/shortUrl',urlControll.shortUrl_post);
router.get('/manager/:page', urlControll.urlManager);
router.post('/manager', urlControll.urlManager_post);
router.get('/delete/:id', urlControll.urlDelete);
router.get('/*',urlControll.get_oldUrl);


//export
module.exports = router;