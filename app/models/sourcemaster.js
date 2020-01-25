var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var sourcemaster = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    // sourceTypeId: {
    //     type: Number,
    //     required: true
    // },
    isAutomated: {
        type: Boolean,
        required: true,
        default: false
    },
    isUtilitySupported: {
        type: Boolean,
        required: true,
        default: false
    },
    isGeneratorSupported: {
        type: Boolean,
        required: true,
        default: false
    },
    sourceType: {
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

module.exports = mongoose.model("source-master", sourcemaster);