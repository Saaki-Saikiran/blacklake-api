var express = require('express');
var router = express.Router();

var Users = require('../models/users');
var Company = require('../models/companies');
var shortid = require('shortid');
var _ = require("underscore");
var verifyToken = require('../auth/tokenValidator');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/list', verifyToken, function (req, res, next) {
    var result = {
        success: false,
        errors: [],
        result: []
    };
    var errors = [];
    var data = req.body;
    var loggedUser = req.loggedUser;
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        var query = data.match ? data.match : {};
        var fields = (data.fields) ? data.fields : {};
        var pagination = (data.pagination) ? data.pagination : {};
        var sort = (data.sort) ? data.sort : undefined;
        Company.find(query, fields, pagination).sort(sort).populate('createdBy', {
            username: 1
        }).lean().exec(function (err, resVehicles) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else {
                result.result = resVehicles;
                result.success = true;
                return res.json(result);
            }
        });
    }
});


// router.get('/:id', verifyToken, function (req, res, next) {
//     var _id = req.params.id;
//     var result = {
//         success: false,
//         errors: [],
//         result: []
//     };
//     var errors = [];
//     var loggedUser = req.loggedUser;
//     if (_id != loggedUser.companyID && loggedUser.role != "superAdmin") {
//         errors.push("Given _id is not your companyID");
//     }
//     if (errors.length) {
//         result.errors = errors;
//         return res.json(result);
//     } else {
//         Company.findOne({
//             _id: _id
//         }).populate('country', 'name').populate('state', 'name').populate('district', 'name').exec(function (err, resCompany) {
//             if (err) {
//                 result.errors.push(err.message);
//                 return res.json(result);
//             } else if (resCompany) {
//                 result.result.push(resCompany);
//                 result.success = true;
//                 return res.json(result);
//             } else {
//                 result.errors.push("Company not found with this id");
//                 return res.json(result);
//             }
//         });
//     }
// });

router.post('/create', function (req, res, next) {
    var data = req.body;
    var result = {
        success: false,
        result: [],
        errors: []
    }
    var errors = [];
    var companyObj = {};
    var userObj = {};
    if (!data.name) {
        errors.push("name is required");
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        bcrypt.hash(data.password, saltRounds, function (err, hash) {
            if (err) {
                result.errors.push(err);
                return res.json(result);
            } else {
                var companyID = shortid.generate();
                var userID = shortid.generate();

                userObj = Object.assign({}, data);
                userObj.password = hash;
                userObj._id = userID;
                userObj.companyID = companyID;
                userObj.createdBy = userID;
                userObj.role = "admin";
                userObj.createdOn = new Date();

                companyObj._id = companyID;
                companyObj.createdBy = userID;
                companyObj.createdOn = new Date();

                var companyInfo = new Company(companyObj);
                var userInfo = new Users(userObj);

                companyInfo.save(function (err, newCompany) {
                    if (err) {
                        result.errors.push(err.message);
                        res.json(result);
                    } else {
                        userInfo.save(function (err, newUser) {
                            if (err) {
                                result.errors.push(err.message);
                                Company.remove({
                                    _id: companyID
                                }, function (err, rmCompany) {
                                    console.log(err);
                                    console.log(rmCompany);
                                    res.json(result);
                                })
                            } else {
                                result.success = true;
                                result.result = {
                                    user: newUser,
                                    company: newCompany
                                };
                                return res.json(result);
                            }
                        });
                    }
                });
            }
        });
    }
});

router.put('/update', verifyToken, function (req, res, next) {
    var data = req.body;
    var errors = [];
    var result = {
        success: false,
        errors: [],
        result: []
    };
    var loggedUser = req.loggedUser;
    var updateObj = {};
    if (data.name) {
        updateObj.name = data.name;
    }
    // if (typeof data.active == "boolean") {
    //     updateObj.active = data.active
    // }
    // if (typeof data.showIncidents == "boolean") {
    //     updateObj.showIncidents = data.showIncidents
    // }
    if (!data._id) {
        errors.push("_id is required")
    } else if (data._id != loggedUser.companyID && loggedUser.role != "superAdmin") {
        errors.push("Given _id is not your companyID");
    }
    updateObj.updatedBy = loggedUser._id;
    updateObj.updatedOn = new Date();
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        Company.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upObj) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upObj.nModified) {
                result.success = true;
                result.result.push("Updated successfully");
                return res.json(result)
            } else {
                result.errors.push("No document found");
                return res.json(result)
            }
        });
    }
});

module.exports = router;