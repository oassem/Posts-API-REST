const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const User = require('../models/user')
const { body } = require('express-validator')

router.put('/signup', [
    body('name').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    body('email').trim().isEmail().custom(async (value) => {
        return User.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject('Email already exists!')
            }
        })
    }).normalizeEmail()
], authController.signup)

router.post('/login', authController.login)

module.exports = router