const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/userController');

router.get('/', UserController.getUsers);

router.post('/register', UserController.register);

router.post('/login', UserController.login);

//router.get('/:slug', UserController.getUserBySlug);

//router.patch('/:userId', UserController.updateUser);

router.delete('/:userId', UserController.deleteUser);

module.exports = router;