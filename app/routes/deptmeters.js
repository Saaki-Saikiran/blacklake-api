var express = require('express');
var router = express.Router();
var Deptmeters = require('../models/deptmeters');
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
        var sort = (data.sort) ? data.sort : undefined;
        Deptmeters.find(query, fields, pagination).sort(sort).populate('createdBy', {
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

router.post('/create', verifyToken, function (req, res, next) {
    var data = req.body;
    var result = {
        success: false,
        result: [],
        errors: []
    }
    var errors = [];
    var loggedUser = req.loggedUser;
    if (!data.deptMeterNumber) {
        errors.push("dept Meter Number is required");
    }
    // if (!data.location) {
    //     errors.push("location is required");
    // }
    // if (!data.provider) {
    //     errors.push("provider is required");
    // }
    // if (!data.description) {
    //     errors.push("description is required");
    // }
    data.createdBy = loggedUser._id;
    data.createdOn = new Date();
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        var deptmeters = new Deptmeters(data);
        deptmeters.save(function (err, resMeter) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else {
                result.result.push(resMeter);
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
    if (data.deptMeterNumber) {
        updateObj.deptMeterNumber = data.deptMeterNumber;
    }
    if (data.location) {
        updateObj.location = data.location;
    }
    if (data.provider) {
        updateObj.provider = data.provider;
    }
    if (data.description) {
        updateObj.description = data.description;
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        updateObj.updatedBy = loggedUser._id;
        updateObj.updatedOn = new Date();
        Deptmeters.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upMeter) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upMeter.nModified) {
                result.success = true;
                result.result.push("Meter type updated successfully");
                return res.json(result);
            } else {
                result.errors.push("No record found with this _id");
                return res.json(result);
            }
        });
    }
});

router.delete('/:id', verifyToken, function (req, res) {
    var result = {
        success: false,
        result: [],
        errors: []
    }
    var id = req.params.id;
    var errors = [];
    var loggedUser = req.loggedUser;
    var updateObj = {};
    // if (loggedUser.role != "admin") {
    //     result.errors.push("You are not authorized to delete Meter Type");
    //     return res.json(result);
    // } else {
    updateObj.removedBy = loggedUser._id;
    updateObj.removedOn = new Date();
    updateObj.active = false;
    Deptmeters.updateOne({
        _id: id
    }, {
        $set: updateObj
    }, function (err, upMeter) {
        if (err) {
            result.errors.push(err.message);
            return res.json(result);
        } else if (upMeter.nModified) {
            result.success = true;
            result.result.push("Deptmeters deleted successfully");
            return res.json(result);
        } else {
            result.errors.push("No record found with this id");
            return res.json(result);
        }
    });
    // }
});

module.exports = router;