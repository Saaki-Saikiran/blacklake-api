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
    roleCode: {
        type: String,
    },
    isActive: {
        type: Boolean,
        required: true
    },
    menus: {
        options: [{
            slug: {
                type: String
            },
            add: {
                type: Boolean
            },
            update: {
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
    strict: false
});

module.exports = mongoose.model("roles", roles);