var express = require('express');
var router = express.Router();
var Sourcemaster = require('../models/sourcemaster');
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
        Sourcemaster.find(query, fields, pagination).sort(sort).populate('createdBy', {
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
    // if (!data.sourceTypeId) {
    //     errors.push("sourceTypeId is required");
    // }
    if (typeof data.isAutomated !== "boolean") {
        errors.push("isAutomated(Boolean Type) is required");
    }
    if (typeof data.isUtilitySupported !== "boolean") {
        errors.push("isUtilitySupported(Boolean Type) is required");
    }
    if (typeof data.isGeneratorSupported !== "boolean") {
        errors.push("isGeneratorSupported(Boolean Type) is required");
    }
    if (!data.sourceType) {
        errors.push("SourceType is required");
    }

    data.createdBy = loggedUser._id;
    data.createdOn = new Date();
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        var sourcemaster = new Sourcemaster(data);
        sourcemaster.save(function (err, resMeter) {
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
    // if (data.sourceTypeId) {
    //     updateObj.sourceTypeId = data.sourceTypeId;
    // }
    if (typeof data.isAutomated === "boolean") {
        updateObj.isAutomated = data.isAutomated;
    } else {
        errors.push("isAutomated(boolean type) is required");
    }

    if (typeof data.isUtilitySupported === "boolean") {
        updateObj.isUtilitySupported = data.isUtilitySupported;
    } else {
        errors.push("isUtilitySupported(boolean type) is required");
    }

    if (typeof data.isGeneratorSupported === "boolean") {
        updateObj.isGeneratorSupported = data.isGeneratorSupported;
    } else {
        errors.push("isGeneratorSupported(boolean type) is required");
    }
    if (data.sourceType) {
        updateObj.sourceType = data.sourceType;
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        updateObj.updatedBy = loggedUser._id;
        updateObj.updatedOn = new Date();
        Sourcemaster.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upMeter) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upMeter.nModified) {
                result.success = true;
                result.result.push("Sourcemaster updated successfully");
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
    //     result.errors.push("You are not authorized to delete Sourcemaster");
    //     return res.json(result);
    // } else {
    updateObj.removedBy = loggedUser._id;
    updateObj.removedOn = new Date();
    updateObj.active = false;
    Sourcemaster.updateOne({
        _id: id
    }, {
        $set: updateObj
    }, function (err, upMeter) {
        if (err) {
            result.errors.push(err.message);
            return res.json(result);
        } else if (upMeter.nModified) {
            result.success = true;
            result.result.push("Sourcemaster deleted successfully");
            return res.json(result);
        } else {
            result.errors.push("No record found with this id");
            return res.json(result);
        }
    });
    // }
});

module.exports = router;