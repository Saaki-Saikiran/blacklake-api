var express = require('express');
var router = express.Router();
var Gatewaymaster = require('../models/gatewaymaster');
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
        Gatewaymaster.find(query, fields, pagination).sort(sort)
            .populate('location', {
                location: 1
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
    if (!data.gatewayId) {
        errors.push("gatewayId is required");
    }
    if (!data.name) {
        errors.push("name is required");
    }
    if (!data.gatewayModel) {
        errors.push("gatewayModel is required");
    }
    if (!data.location) {
        errors.push("location is required");
    }
    if (!data.tcp_COM_Type) {
        errors.push("tcp_COM_Type is required");
    }
    if (!data.ip) {
        errors.push("ip is required");
    }
    if (!data.tcp_COM_PortNo) {
        errors.push("tcp_COM_PortNo is required");
    }
    if (!data.baudRate) {
        errors.push("baudRate is required");
    }
    if (!data.parity) {
        errors.push("parity is required");
    }
    if (!data.stopBits) {
        errors.push("stopBits is required");
    }
    if (!data.dataSize) {
        errors.push("dataSize is required");
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
        var gatewaymaster = new Gatewaymaster(data);
        gatewaymaster.save(function (err, resMeter) {
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
    if (data.gatewayId) {
        updateObj.gatewayId = data.gatewayId;
    }
    if (data.name) {
        updateObj.name = data.name;
    }
    if (data.gatewayModel) {
        updateObj.gatewayModel = data.gatewayModel;
    }
    if (data.location) {
        updateObj.location = data.location;
    }
    if (data.tcp_COM_Type) {
        updateObj.tcp_COM_Type = data.tcp_COM_Type;
    }
    if (data.ip) {
        updateObj.ip = data.ip;
    }
    if (data.tcp_COM_PortNo) {
        updateObj.tcp_COM_PortNo = data.tcp_COM_PortNo;
    }
    if (data.baudRate) {
        updateObj.baudRate = data.baudRate;
    }
    if (data.parity) {
        updateObj.parity = data.parity;
    }
    if (data.stopBits) {
        updateObj.stopBits = data.stopBits;
    }
    if (data.dataSize) {
        updateObj.dataSize = data.dataSize;
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
        Gatewaymaster.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upMeter) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upMeter.nModified) {
                result.success = true;
                result.result.push("Gatewaymaster updated successfully");
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
    // if (loggedUser.role = "admin") {
    //     result.errors.push("You are not authorized to delete Gatewaymaster");
    //     return res.json(result);
    // } else {
    updateObj.removedBy = loggedUser._id;
    updateObj.removedOn = new Date();
    updateObj.active = false;
    Gatewaymaster.updateOne({
        _id: id
    }, {
        $set: updateObj
    }, function (err, upMeter) {
        if (err) {
            result.errors.push(err.message);
            return res.json(result);
        } else if (upMeter.nModified) {
            result.success = true;
            result.result.push("Gatewaymaster deleted successfully");
            return res.json(result);
        } else {
            result.errors.push("No record found with this id");
            return res.json(result);
        }
    });
    // }
});

module.exports = router;