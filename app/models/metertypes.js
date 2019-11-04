var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var meterTypes = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    type: {
        type: String,
        required: true
    },
    isBillable: {
        type: Boolean,
        default: true
    },
    isCommon: {
        type: Boolean,
        default: true
    },
    description: {
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

// yards.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("metertypes", meterTypes);