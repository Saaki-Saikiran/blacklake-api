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
        type: String,
    },
    sqFts: {
        type: Number,
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

floors.index({
    building: 1,
    block: 1,
    floor: 1,
    occupantNumber: 1
}, {
    unique: true
})


module.exports = mongoose.model("floors", floors);