var express = require('express');
var router = express.Router();
var Metertypes = require('../models/metertypes');
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
        Metertypes.find(query, fields, pagination).sort(sort).populate('createdBy', {
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
    if (!data.type) {
        errors.push("type is required");
    }
    if (!data.attribute) {
        errors.push("attribute is required");
    }
    // if (typeof data.isCommon !== "boolean") {
    //     errors.push("isCommon(boolean type) is required");
    // }
    // if (typeof data.isBillable !== "boolean") {
    //     errors.push("isBillable(boolean type) is required");
    // }
    if (!data.description) {
        errors.push("description is required");
    }

    data.createdBy = loggedUser._id;
    data.createdOn = new Date();
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        var meterTypes = new Metertypes(data);
        meterTypes.save(function (err, resMeter) {
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
    if (data.type) {
        updateObj.type = data.type;
    }
    // if (typeof data.isCommon === "boolean") {
    //     updateObj.isCommon = data.isCommon;
    // } else {
    //     errors.push("isCommon(boolean type) is required");
    // }

    // if (typeof data.isBillable === "boolean") {
    //     updateObj.isBillable = data.isBillable;
    // } else {
    //     errors.push("isBillable(boolean type) is required");
    // }

    if (data.description) {
        updateObj.description = data.description;
    }
    if (data.attribute) {
        updateObj.attribute = data.attribute;
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        updateObj.updatedBy = loggedUser._id;
        updateObj.updatedOn = new Date();
        Metertypes.updateOne({
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

router.delete('/:id', verifyToken, function (req, res, next) {
    var id = req.params.id;
    var result = {
        success: false,
        result: [],
        errors: []
    }
    var loggedUser = req.loggedUser;
    var errors = [];
    var updateObj = {
        active: false,
        removedBy: loggedUser._id,
        removedOn: new Date()
    }
    console.log(id, '--id--');
    // if (loggedUser.role != "admin") {
    //     result.errors.push("You are not authorized to delete Meter Type");
    //     return res.json(result);
    // } else {
    Metertypes.updateOne({
        _id: id
    }, {
        $set: updateObj
    }, function (err, upMeter) {
        if (err) {
            result.errors.push(err.message);
            return res.json(result);
        } else if (upMeter.nModified) {
            result.success = true;
            result.result.push("Metertypes deleted successfully");
            return res.json(result);
        } else {
            result.errors.push("No record found with this id");
            return res.json(result);
        }
    });
    // }
});


module.exports = router;