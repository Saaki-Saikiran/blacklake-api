var express = require('express');
var router = express.Router();
var Meterparamsmaster = require('../models/meterparamsmaster');
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
        Meterparamsmaster.find(query, fields, pagination).sort(sort)
            .populate('meterModelId', {
                meterModelId: 1
            }).populate('createdBy', {
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
    if (!data.meterParamsId) {
        errors.push("meterParamsId is required");
    }
    if (!data.meterModelId) {
        errors.push("meterModelId is required");
    }
    if (!data.parameterName) {
        errors.push("parameterName is required");
    }
    if (!data.description) {
        errors.push("description is required");
    }
    if (!data.units) {
        errors.push("units is required");
    }
    if (!data.dataType) {
        errors.push("dataType is required");
    }
    if (!data.scaling) {
        errors.push("scaling is required");
    }
    if (!data.modRegister) {
        errors.push("modRegister is required");
    }
    if (!data.registerLength) {
        errors.push("registerLength is required");
    }
    if (typeof data.isSupported !== "boolean") {
        errors.push("isSupported(Boolean Type) is required");
    }
    data.createdBy = loggedUser._id;
    data.createdOn = new Date();
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        var meterparamsmaster = new Meterparamsmaster(data);
        meterparamsmaster.save(function (err, resMeter) {
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
    if (data.meterParamsId) {
        updateObj.meterParamsId = data.meterParamsId;
    }
    if (data.meterModelId) {
        updateObj.meterModelId = data.meterModelId;
    }
    if (data.parameterName) {
        updateObj.parameterName = data.parameterName;
    }
    if (data.description) {
        updateObj.description = data.description;
    }
    if (data.units) {
        updateObj.units = data.units;
    }
    if (data.dataType) {
        updateObj.dataType = data.dataType;
    }
    if (data.scaling) {
        updateObj.meterParams = data.meterParams;
    }
    if (data.modRegister) {
        updateObj.modRegister = data.modRegister;
    }
    if (data.registerLength) {
        updateObj.registerLength = data.registerLength;
    }
    if (typeof data.isSupported !== "boolean") {
        errors.push("isSupported(Boolean Type) is required");
    } else {
        updateObj.isSupported = data.isSupported;
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        updateObj.updatedBy = loggedUser._id;
        updateObj.updatedOn = new Date();
        Meterparamsmaster.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upMeter) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upMeter.nModified) {
                result.success = true;
                result.result.push("Meterparamsmaster updated successfully");
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
    //     result.errors.push("You are not authorized to delete Meterparamsmaster");
    //     return res.json(result);
    // } else {
    updateObj.removedBy = loggedUser._id;
    updateObj.removedOn = new Date();
    updateObj.active = false;
    Meterparamsmaster.updateOne({
        _id: id
    }, {
        $set: updateObj
    }, function (err, upMeter) {
        if (err) {
            result.errors.push(err.message);
            return res.json(result);
        } else if (upMeter.nModified) {
            result.success = true;
            result.result.push("Meterparamsmaster deleted successfully");
            return res.json(result);
        } else {
            result.errors.push("No record found with this id");
            return res.json(result);
        }
    });
    // }
});

module.exports = router;