const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: {
        type: Number,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    contacts: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Contact'
            }
        }]
    }
});

userSchema.methods.addContact = function (Contact) {
    this.contacts.items.push(Contact);
    return this.save();
};

module.exports = mongoose.model('User', userSchema);