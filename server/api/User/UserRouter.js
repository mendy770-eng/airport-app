const express = require('express');
const router = express.Router();// create a router
const User = require('./UserModel');

const UserController = require('./UserController.js');

const {verifyUser} = require('../middlewares/loginMiddlewares.js');

//נתיב ליצירת משתמש
router.post('/register', UserController.register);

//נתיב לשליפת כל המשתמשים (מאובטח)
router.get('/', verifyUser, UserController.getAllUsers);

// נתיב לשליפת כל המשתמשים (ציבורי)
router.get('/all', UserController.getAllUsersPublic);

//נתיב להתחברות
router.post('/login', UserController.login);

// נתיב למחיקת משתמש
router.delete('/:id', UserController.deleteUser);

module.exports = router;