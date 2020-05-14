const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User')

router.post('/register', (req, res) => {

    const phone = req.body.phone;
    const password = req.body.password;

    User.findOne({
            phone: phone
        })
        .then(user => {
            if (user) {
                const error = new Error('User with this phone number already exists');
                error.statusCode = 422;
                throw error;
            }
            return bcrypt
                .hash(password, 12)
        })
        .then(hashedPassword => {
            const userObj = new User({
                phone: phone,
                password: hashedPassword
            });
            return userObj.save();
        })
        .then(result => {
            res.status(201).json({
                success: true,
                message: 'Created User',
                userId: result._id
            });
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.statusCode ? err.statusCode : 500;
            res.status(statusCode).json({
                success: false,
                message: err.message
            });
        });
});

router.post('/login', (req, res) => {
    const phone = req.body.phone;
    const password = req.body.password;
    let loadedUser;
    User.findOne({
            phone: phone
        })
        .then(user => {
            if (!user) {
                const error = new Error('No User Found with that phone number');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Incorrect password');
                console.log(error);
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                    phone: loadedUser.phone,
                    userId: loadedUser._id.toString()
                },
                process.env.AUTH_SECRET, {
                    expiresIn: '2h'
                }
            );
            res.status(200).json({
                success: true,
                token: token,
                userId: loadedUser._id.toString()
            });
        })
        .catch(err => {
            console.log(err);
            const statusCode = err.statusCode ? err.statusCode : 500;
            res.status(statusCode).json({
                success: false,
                message: err.message
            });
        });
})

module.exports = router;