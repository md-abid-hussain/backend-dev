const express = require('express')
const router = express.Router();
const { handleLogout } = require('../controllers/logoutController')

router.post('/', handleLogout);

module.exports = router