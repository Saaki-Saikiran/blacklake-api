var express = require('express');
var router = express.Router();
var Users = require('../models/users');

var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

var shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

var config = require('config');
var secretkey = config.get('secretkey');
var tokenExpireTime = config.get('tokenExpireTime');

var verifyToken = require('../auth/tokenValidator');

const saltRounds = 10;


router.post('/create', function (req, res, next) {
    var data = req.body;
    var result = {
        success: false,
        result: [],
        errors: []
    }
    var errors = [];
    var loggedUser = req.loggedUser;
    if (!data.name) {
        errors.push("name is required");
    }
    if (!data.address) {
        errors.push("address is required");
    }
    if (!data.username) {
        errors.push("username is required");
    }
    if (!data.email) {
        errors.push("email is required");
    }
    if (!data.password) {
        errors.push("password is required");
    }
    if (!data.confirmPassword) {
        errors.push("Confirm Password is required");
    }
    if (!data.role) {
        errors.push("role is required");
    }
    if (!data.phone) {
        errors.push("phone is required");
    }
    if (typeof data.isActive !== "boolean") {
        errors.push("isActive(boolean type) is required");
    }
    // data.createdBy = loggedUser._id;

    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        data.createdOn = new Date();
        bcrypt.hash(data.password, saltRounds, function (err, hash) {
            if (err) {
                result.errors.push(err);
                return res.json(result);
            } else {
                data.password = hash;
                var userInfo = new Users(data);
                userInfo.save(function (err, newUser) {
                    if (err) {
                        result.errors.push(err.message);
                        return res.json(result);
                    } else {
                        result.success = true;
                        // console.log(JSON.stringify(newUser));
                        // var test = JSON.stringify(newUser);
                        // var test2 = JSON.parse(test);
                        // console.log(test2);

                        // test2.x = '999';
                        // result.result.push(test2);
                        result.result.push(newUser);
                        return res.json(result);
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
    var updateObj = {};
    var loggedUser = req.loggedUser;
    if (!data._id) {
        errors.push("_id is required");
    }
    updateObj.updatedOn = new Date();
    updateObj.updatedBy = loggedUser._id;
    if (data.fname) {
        updateObj.fname = data.fname;
    }
    if (data.lname) {
        updateObj.lname = data.lname;
    }
    if (data.phone) {
        updateObj.phone = data.phone;
    }
    if (data.profilepic) {
        updateObj.profilepic = data.profilepic
    }
    if (data.email) {
        updateObj.email = data.email
    }

    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        Users.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upObj) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upObj.nModified) {
                result.success = true;
                result.result.push("User updated successfully");
                return res.json(result);
            } else {
                result.errors.push("No document found with this id");
                return res.json(result);
            }
        });
    }

});

router.put('/updateProfile', verifyToken, function (req, res, next) {
    var data = req.body;
    var errors = [];
    var result = {
        success: false,
        errors: [],
        result: []
    };
    var updateObj = {};
    var loggedUser = req.loggedUser;
    updateObj.updatedOn = new Date();
    updateObj.updatedBy = loggedUser._id;
    if (data.fname) {
        updateObj.fname = data.fname;
    }
    if (data.lname) {
        updateObj.lname = data.lname;
    }
    if (data.phone) {
        updateObj.phone = data.phone;
    }
    if (data.profilepic) {
        updateObj.profilepic = data.profilepic
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        Users.updateOne({
            _id: loggedUser._id
        }, {
            $set: updateObj
        }, function (err, upObj) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upObj.nModified) {
                result.success = true;
                result.result.push("User updated successfully");
                return res.json(result);
            } else {
                result.errors.push("No User found with this id");
                return res.json(result);
            }
        });
    }
});

router.put('/changePassword', verifyToken, function (req, res, next) {
    var result = {
        success: false,
        errors: [],
        result: []
    }
    var errors = [];
    var data = req.body;
    var loggedUser = req.loggedUser;
    if (!data.currentPassword) {
        errors.push("currentPassword is required");
    }
    if (!data.newPassword) {
        errors.push("newPassword is required");
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        Users.findOne({
            _id: loggedUser._id
        }, function (err, resUser) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (resUser) {
                bcrypt.compare(data.currentPassword, resUser.password, function (err, isValid) {
                    if (err) {
                        result.errors.push(err);
                        return res.json(result);
                    } else if (isValid) {
                        bcrypt.hash(data.newPassword, saltRounds, function (err, hash) {
                            if (err) {
                                result.errors.push(err);
                                return res.json(result);
                            } else {
                                Users.updateOne({
                                    _id: loggedUser._id
                                }, {
                                    $set: {
                                        password: hash
                                    }
                                }, function (err, upUser) {
                                    if (err) {
                                        result.errors.push(err.message);
                                        return res.json(result);
                                    } else if (upUser.nModified) {
                                        result.result.push("Password updated successfully");
                                        result.success = true;
                                        return res.json(result);
                                    } else {
                                        result.errors.push("Password updation failed");
                                        return res.json(result);
                                    }
                                });
                            }
                        });
                    } else {
                        result.errors.push("Please enter valid current password");
                        return res.json(result);
                    }
                });
            } else {
                result.errors.push("No user found with your token");
                return res.json(result);
            }
        });
    }
});


router.post('/auth/login', function (req, res, next) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({
            "success": false,
            "result": [],
            errors: ['Missing Authorization Header']
        });
    } else {
        var data = {};
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        [data.username, data.password] = credentials.split(':');

        var result = {
            success: false,
            errors: [],
            result: []
        }
        var errors = [];
        if (!data.username) {
            errors.push("username is required");
        }
        if (!data.password) {
            errors.push("password is required");
        }
        console.log(data, '-----------');

        if (errors.length) {
            result.errors = errors;
            return res.json(result);
        } else {
            Users.findOne({
                $or: [{
                    username: data.username
                }, {
                    email: data.email
                }]
            }).lean().exec(function (err, resUser) {
                console.log(resUser, '-----------');
                if (err) {
                    result.errors.push(err.message);
                    return res.json(result);
                } else if (resUser) {
                    bcrypt.compare(data.password, resUser.password, function (err, isValid) {
                        if (err) {
                            result.errors.push(err);
                            return res.json(result);
                        } else if (isValid) {
                            delete resUser.password;
                            if (resUser.active) {
                                jwt.sign({
                                    resUser
                                }, secretkey, {
                                    expiresIn: tokenExpireTime
                                }, function (err, token) {
                                    if (err) {
                                        result.errors.push(err);
                                        return res.json(result);
                                    } else {
                                        result.success = true;
                                        result.result.push(resUser);
                                        result.token = token;
                                        return res.json(result);
                                    }
                                })
                            } else {
                                result.errors.push("Your account has been deactivated, Kindly contact administrator.");
                                return res.json(result);
                            }
                        } else {
                            result.errors.push("Invalid Credentials-------------");
                            return res.json(result);
                        }
                    })
                } else {
                    result.errors.push("Invalid Credentials");
                    return res.json(result);
                }
            })
        }
    }
});


module.exports = router;