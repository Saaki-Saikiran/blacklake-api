var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var meterparamsmaster = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    meterParamsId: {
        type: Number,
        required: true
    },
    meterModelId: {
        type: Number,
        required: true
    },
    parameterName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    units: {
        type: String,
        required: true
    },
    dataType: {
        type: String,
        required: true
    },
    scaling: {
        type: Number,
        required: true,
    },
    modRegister: {
        type: Number,
        required: true
    },
    registerLength: {
        type: Number,
        required: true
    },
    isSupported: {
        type: Boolean,
        required: true,
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
        type: String,
        ref: "users"
    },
    removedOn: {
        type: Date
    },
}, {
    strict: true
});

module.exports = mongoose.model("meterparamsmaster", meterparamsmaster);