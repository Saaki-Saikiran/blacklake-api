var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var meterTenants = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    // deptMeterNumberID: {
    //     type: String,
    //     required: true,
    //     ref: "deptMeters"
    // },
    meterSerialNumberID: {
        type: String,
        required: true,
        ref: "meters"
    },
    assignTenant: {
        type: Boolean,
        required: true
    },
    // meterType: {
    //     type: String,
    //     required: true
    // },
    // gatewayName: {
    //     type: String,
    //     required: true
    // },
    // block: {
    //     type: String,
    //     required: true
    // },
    // floorID: {
    //     type: String,
    //     required: true,
    //     ref: "floors"
    // },
    tenantID: {
        type: String,
        required: true,
        ref: "tenants"
    },
    // contactNumber: {
    //     type: String,
    //     // required: true
    // },
    // started: {
    //     type: String,
    //     required: true
    // },
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

module.exports = mongoose.model("meterTenants", meterTenants);