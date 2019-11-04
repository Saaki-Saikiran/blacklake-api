var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var users = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => props.value + ' is not a valid email!'
        }
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        ref: "users"
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    updatedBy: {
        type: String,
        ref: "users"
    },
    updatedOn: {
        type: Date
    },
    // companyID: {
    //     type: String,
    //     required: true,
    //     ref: "companies"
    // },
    removedBy: {
        type: String
    },
    removedOn: {
        type: Date
    }
}, {
    strict: true
});

users.index({
    username: 1
}, {
    unique: true
});
users.index({
    email: 1
}, {
    unique: true
});

module.exports = mongoose.main.model("users", users);