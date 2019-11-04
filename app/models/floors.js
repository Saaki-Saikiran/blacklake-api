var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var floors = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    building: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    occupantNumber: {
        type: Number,
        default: true
    },
    sqFts: {
        type: Number,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model("floors", floors);