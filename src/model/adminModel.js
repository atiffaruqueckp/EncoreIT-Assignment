const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
        match: [/^([+]\d{2})?\d{10}$/, "please fill a valid mobile Number"],
        minLength: 10,
        maxLength: 10
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/,  //+ = valid character for email
            "Please fill a valid email address",],

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 15,
    },
    address: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('admin', adminSchema);