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
    console.log(data, '----');
    var loggedUser = req.loggedUser;
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        var query = data.match ? data.match : {};
        var fields = (data.fields) ? data.fields : {};
        var pagination = (data.pagination) ? data.pagination : {};
        var sort = (data.sort) ? data.sort : undefined;
        Roles.find(query, fields, pagination).sort(sort).populate('createdBy', {
            username: 1
        }).lean().exec(function (err, resVehicles) {
            console.log(err);
            console.log(resVehicles);
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




router.post('/create', verifyToken, function (req, res, next) {
    var data = req.body;
    console.log(data, '---sai===');
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
    if (typeof data.isActive !== "boolean") {
        errors.push("isActive(boolean type) is required");
    }
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
    if (data.menus) {
        updateObj.menus = data.menus
    }
    if (data.isActive) {
        updateObj.isActive = data.isActive
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