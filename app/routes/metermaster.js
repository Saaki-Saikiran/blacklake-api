var express = require('express');
var router = express.Router();
var Metermaster = require('../models/metermaster');
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
        Metermaster.find(query, fields, pagination).sort(sort).populate('createdBy', {
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
    // if (!data.meterModelId) {
    //     errors.push("meterModelId is required");
    // }
    if (!data.meterModelName) {
        errors.push("meterModelName is required");
    }
    if (!data.manufacturer) {
        errors.push("manufacturer is required");
    }
    if (!data.startingRegister) {
        errors.push("startingRegister is required");
    }
    if (!data.length) {
        errors.push("length is required");
    }
    if (!data.dataType) {
        errors.push("dataType is required");
    }
    if (typeof data.isSupported !== "boolean") {
        errors.push("isSupported(Boolean Type) is required");
    }
    if (!data.comments) {
        errors.push("comments is required");
    }
    data.createdBy = loggedUser._id;
    data.createdOn = new Date();
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        var metermaster = new Metermaster(data);
        metermaster.save(function (err, resMeter) {
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
    // if (data.meterModelId) {
    //     updateObj.meterModelId = data.meterModelId;
    // }
    if (data.meterModelName) {
        updateObj.meterModelName = data.meterModelName;
    }
    if (data.manufacturer) {
        updateObj.manufacturer = data.manufacturer;
    }
    if (data.startingRegister) {
        updateObj.startingRegister = data.startingRegister;
    }
    if (data.length) {
        updateObj.length = data.length;
    }
    if (data.dataType) {
        updateObj.dataType = data.dataType;
    }
    if (typeof data.isSupported !== "boolean") {
        errors.push("isSupported(Boolean Type) is required");
    } else {
        updateObj.isSupported = data.isSupported;
    }
    if (data.comments) {
        updateObj.comments = data.comments;
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        updateObj.updatedBy = loggedUser._id;
        updateObj.updatedOn = new Date();
        Metermaster.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upMeter) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upMeter.nModified) {
                result.success = true;
                result.result.push("Metermaster updated successfully");
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
    //     result.errors.push("You are not authorized to delete Metermaster");
    //     return res.json(result);
    // } else {
    updateObj.removedBy = loggedUser._id;
    updateObj.removedOn = new Date();
    updateObj.active = false;
    Metermaster.updateOne({
        _id: id
    }, {
        $set: updateObj
    }, function (err, upMeter) {
        if (err) {
            result.errors.push(err.message);
            return res.json(result);
        } else if (upMeter.nModified) {
            result.success = true;
            result.result.push("Metermaster deleted successfully");
            return res.json(result);
        } else {
            result.errors.push("No record found with this id");
            return res.json(result);
        }
    });
    // }
});

module.exports = router;