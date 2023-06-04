const express = require('express')
const userController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roleList');
const verifyRoles = require('../../middleware/verifyRoles')

const router = express.Router();

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), userController.getAllUser)
    .post(verifyRoles(ROLES_LIST.Admin), userController.createUser)
    .put(verifyRoles(ROLES_LIST.Admin), userController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser)

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), userController.getUser)

module.exports = router;