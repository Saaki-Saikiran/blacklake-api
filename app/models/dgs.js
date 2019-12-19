var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var DGs = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    dgSerialNumber: {
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String,
        // required: true
    },
    // meterSerialNumber: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    meterSerialNumberID: {
        type: String,
        required: true,
        ref: "meters"
    },
    yearMake: {
        type: Number,
    },
    description: {
        type: String,
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

module.exports = mongoose.model("dgs", DGs);