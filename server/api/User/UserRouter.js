const express = require('express');
const router = express.Router();// create a router

const UserController = require('./UserController.js');

const {verifyUser} = require('../middlewares/loginMiddlewares.js');

//נתיב ליצירת משתמש
router.post('/register', UserController.register);

//נתיב לשליפת כל המשתמשים
router.get('/', verifyUser, UserController.getAllUsers);
//נתיב להתחברות
router.post('/login', UserController.login);

module.exports = router;