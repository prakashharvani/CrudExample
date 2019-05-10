const express = require('express');

const router = express.Router();

const jsonMiddleware = require('../middleware/jsonMiddleWare');
const middleware = require('../middleware/fileMiddleware');

const userController = require('../controller/userController');

router.post('/api/user',jsonMiddleware.verifyToken,middleware.any(),userController.insertUser);

router.get('/api/user',jsonMiddleware.verifyToken,userController.getallUser);

router.post('/api/user/login',userController.login);

router.get('/api/user/:userId',jsonMiddleware.verifyToken,userController.getUserById);

router.delete('/api/user/delete/:userId',jsonMiddleware.verifyToken,userController.deleteUserById);

router.put('/api/user/update/:userId',jsonMiddleware.verifyToken,middleware.any(),userController.findByIdAndUpdate);

module.exports = router; 