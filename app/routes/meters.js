var express = require('express');
var router = express.Router();
var Meters = require('../models/meters');
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
        Meters.find(query, fields, pagination).sort(sort).populate('createdBy', {
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
    if (!data.meterSerialNumber) {
        errors.push("meterSerialNumber is required");
    }
    if (!data.model) {
        errors.push("model is required");
    }
    if (!data.meterType) {
        errors.push("meterType is required");
    }
    if (!data.deptMeterNumber) {
        errors.push("deptMeterNumber is required");
    }
    if (!data.sourceType) {
        errors.push("sourceType is required");
    }
    if (!data.panel) {
        errors.push("panel is required");
    }
    if (!data.gateway) {
        errors.push("gateway is required");
    }
    if (!data.provider) {
        errors.push("provider is required");
    }
    if (!data.multifyingFactor) {
        errors.push("multifyingFactor is required");
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
        var meters = new Meters(data);
        meters.save(function (err, resMeter) {
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
    if (data.meterSerialNumber) {
        updateObj.meterSerialNumber = data.meterSerialNumber;
    }
    if (data.model) {
        updateObj.model = data.model;
    }
    if (data.meterType) {
        updateObj.meterType = data.meterType;
    }
    if (data.deptMeterNumber) {
        updateObj.deptMeterNumber = data.deptMeterNumber;
    }
    if (data.sourceType) {
        updateObj.sourceType = data.sourceType;
    }
    if (data.panel) {
        updateObj.panel = data.panel;
    }
    if (data.gateway) {
        updateObj.gateway = data.gateway;
    }
    if (data.provider) {
        updateObj.provider = data.provider;
    }
    if (data.multifyingFactor) {
        updateObj.multifyingFactor = data.multifyingFactor;
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
        Meters.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upMeter) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upMeter.nModified) {
                result.success = true;
                result.result.push("Meter updated successfully");
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
    Meters.updateOne({
        _id: id
    }, {
        $set: updateObj
    }, function (err, upMeter) {
        if (err) {
            result.errors.push(err.message);
            return res.json(result);
        } else if (upMeter.nModified) {
            result.success = true;
            result.result.push("Meter deleted successfully");
            return res.json(result);
        } else {
            result.errors.push("No record found with this id");
            return res.json(result);
        }
    });
    // }
});

module.exports = router;