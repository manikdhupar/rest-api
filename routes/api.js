const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const Contact = require('../model/Contact');
const User = require('../model/User');
const dotenv = require("dotenv");
dotenv.config();
const messagebird = require("messagebird")(process.env.ACCESS_KEY_MESSAGEBIRD);

const router = express.Router();

router.post("/addcontact", verifyToken, (req, res) => {
    const phone = Number(req.body.phone);
    const name = req.body.name;
    console.log(typeof phone);
    console.log(phone);
    if (name == "") return res.status(400).json({
        success: false,
        message: "Name is empty"
    })
    messagebird.lookup.read(phone, function (err, response) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                success: false,
                message: "Invalid Number",
            });
        }

        const contactS = new Contact({
            phone: phone,
            name: name,
            userId: req.user.userId
        })

        let contact;
        contactS.save().then(el => {
                contact = el;
                return User.findById(req.user.userId);
            })
            .then(user => {
                return user.addContact(contact)
            })
            .then(result => {
                res.status(201).json({
                    success: true,
                    message: "Successfully Added Contact",
                    contact: contact
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                })
            })

    });
});

module.exports = router;