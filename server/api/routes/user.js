const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/userController');
const checkAuth =require('./../middleware/check-auth');

router.get('/', UserController.getUsers);

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.get('/autoSignIn', checkAuth, UserController.autoSignIn);

router.get('/:userId', UserController.getUserById);

router.patch('/:userId', UserController.updateUser);

router.delete('/:userId', UserController.deleteUser);

router.post('/:userId/climbedBoulders/:boulderId', UserController.editClimbedBoulders);

module.exports = router;