var express = require('express');
var router = express.Router();
var Roles = require('../models/roles');
var verifyToken = require('../auth/tokenValidator');


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
        Roles.find(query, fields, pagination, function (err, resRoles) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else {
                result.result = resRoles;
                result.success = true;
                return res.json(result);
            }
        });
    }
});



router.post('/create', verifyToken, function (req, res, next) {
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
    // if (!data.code) {
    //     errors.push("code is required");
    // }
    data.createdBy = loggedUser._id;
    data.createdOn = new Date();
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
        // } else if (loggedUser.role != "superAdmin"){
        // 	result.errors.push("You are not authorized to create new role");
        // 	return res.json(result);
    } else {
        var roleInfo = new Roles(data);
        roleInfo.save(function (err, resRole) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else {
                result.result.push(resRole);
                result.success = true;
                return res.json(result);
            }
        });
    }
});

router.put('/update', verifyToken, function (req, res, next) {
    var result = {
        success: false,
        result: [],
        errors: []
    }
    var errors = [];
    var loggedUser = req.loggedUser;
    var data = req.body;
    var updateObj = {};
    if (!data._id) {
        errors.push("_id is required");
    }
    if (data.name) {
        updateObj.name = data.name;
    }
    // if (data.desc) {
    //     updateObj.desc = data.desc;
    // }
    if (data.permissions) {
        updateObj.menus = data.menus
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
        // } else if (loggedUser.role != "superAdmin") {
        //     result.errors.push("You are not authorized to update role");
        //     return res.json(result);
    } else {
        updateObj.updatedBy = loggedUser._id;
        updateObj.updatedOn = new Date();
        Roles.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upRole) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upRole.nModified) {
                result.success = true;
                result.result.push("Role updated successfully");
                return res.json(result);
            } else {
                result.errors.push("No record found with this _id");
                return res.json(result);
            }
        });
    }
});

module.exports = router;