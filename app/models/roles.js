var mongoose = require('mongoose');
var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var roles = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    // code: { type: String, required: true, unique: true },
    // desc: { type: String },
    menus: {
        options: [{
            slug: {
                type: String
            },
            add: {
                type: Boolean
            },
            edit: {
                type: Boolean
            },
            link: {
                type: Boolean
            },
            delete: {
                type: Boolean
            }
        }]
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
}, {
    strict: true
});

module.exports = mongoose.model("roles", roles);