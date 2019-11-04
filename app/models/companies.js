var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var companies = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: String
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    updatedBy: {
        type: String
    },
    updatedOn: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    },
}, {
    strict: true
});

companies.index({
    name: 1
}, {
    unique: true
});

module.exports = mongoose.main.model("companies", companies);