var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var gatewaymaster = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    gatewayId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gatewayModel: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        // ref: "deptmeters"
    },
    tcp_COM_Type: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    tcp_COM_PortNo: {
        type: Number,
        required: true,
    },
    baudRate: {
        type: Number,
        required: true
    },
    parity: {
        type: String,
        required: true
    },
    stopBits: {
        type: Number,
        required: true
    },
    dataSize: {
        type: Number,
        required: true,
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

module.exports = mongoose.model("gateway-master", gatewaymaster);