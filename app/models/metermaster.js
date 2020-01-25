var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var metermaster = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    // meterModelId: {
    //     type: Number,
    //     required: true
    // },
    meterModelName: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    startingRegister: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    dataType: {
        type: String,
        required: true
    },
    isSupported: {
        type: Boolean,
        required: true,
        default: false
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
        type: String,
        ref: "users"
    },
    removedOn: {
        type: Date
    },
}, {
    strict: true
});

module.exports = mongoose.model("meterModel-master", metermaster);