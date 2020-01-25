var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var meters = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    meterSerialNumber: {
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String,
        required: true,
        ref: "meterModel-master"
    },
    meterType: {
        type: String,
        required: true
    },
    // deptMeterNumber: {
    //     type: Number,
    //     required: true
    // },
    deptMeterNumberID: {
        type: String,
        required: true,
        ref: "deptMeters"
    },
    sourceType: {
        type: String,
        required: true
    },
    panel: {
        type: String,
        // required: true
    },
    gateway: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        // required: true
    },
    multifyingFactor: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        // required: true
    },
    assignedToTenant: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model("meters", meters);