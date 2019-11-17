var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var tenants = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    tenantName: {
        type: String,
        required: true,
        unique: true
    },
    contactPersonName: {
        type: String,
        required: true,
        unique: true
    },
    contactNumber: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => props.value + ' is not a valid email!'
        }
    },
    comments: {
        type: String,
        required: true
    },
    active: {
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
    removedBy: {
        type: String
    },
    removedOn: {
        type: Date
    },
}, {
    strict: true
});

module.exports = mongoose.model("tenants", tenants);