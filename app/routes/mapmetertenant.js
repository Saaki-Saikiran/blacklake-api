var express = require('express');
var router = express.Router();
var meterTenants = require('../models/mapmetertenant');
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
        meterTenants.aggregate([

                {
                    $lookup: {
                        from: "users",
                        let: {
                            "user": "$createdBy"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: ["$_id", "$$user"]
                                    }, ]
                                }
                            }
                        }, {
                            $project: {
                                username: 1
                            }
                        }],
                        as: "userDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$userDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },


                {
                    $lookup: {
                        from: "meters",
                        let: {
                            "meter": "$meterSerialNumberID"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: ["$_id", "$$meter"]
                                    }, ]
                                }
                            }
                        }],
                        as: "meterdet"
                    }
                },
                {
                    $unwind: {
                        path: "$meterdet",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$tenantID",
                        data: {
                            $push: "$$ROOT"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "tenants",
                        let: {
                            "tenant": "$_id"
                        },
                        pipeline: [{
                            $match: {
                                $expr: {
                                    $and: [{
                                        $eq: ["$_id", "$$tenant"]
                                    }, ]
                                }
                            }
                        }],
                        as: "tenentdet"
                    }
                },
                {
                    $unwind: {
                        path: "$tenentdet",
                        preserveNullAndEmptyArrays: true
                    }
                },


            ])
            .exec(function (err, resVehicles) {
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
    // if (!data.deptMeterNumberID) {
    //     errors.push("dept Meter Number is required");
    // }
    if (!data.meterSerialNumberID) {
        errors.push("meterSerialNumberID is required");
    }
    // if (!data.meterType) {
    //     errors.push("meterType is required");
    // }
    // if (!data.gatewayName) {
    //     errors.push("gatewayName is required");
    // }
    // if (!data.block) {
    //     errors.push("block is required");
    // }
    // if (!data.floorID) {
    //     errors.push("floorID is required");
    // }
    if (!data.assignTenant) {
        errors.push("assignTenant is required");
    }
    if (!data.tenantID) {
        errors.push("tenantID is required");
    }
    // if (!data.contactNumber) {
    //     errors.push("contactNumber is required");
    // }
    // if (!data.started) {
    //     errors.push("started is required");
    // }

    data.createdBy = loggedUser._id;
    data.createdOn = new Date();
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        var metertenants = new meterTenants(data);
        metertenants.save(function (err, resMeter) {
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
    // if (data.deptMeterNumberID) {
    //     updateObj.deptMeterNumberID = data.deptMeterNumberID;
    // }
    if (data.meterSerialNumberID) {
        updateObj.meterSerialNumberID = data.meterSerialNumberID;
    }
    // if (data.meterType) {
    //     updateObj.meterType = data.meterType;
    // }
    // if (data.gatewayName) {
    //     updateObj.gatewayName = data.gatewayName;
    // }
    // if (data.block) {
    //     updateObj.block = data.block;
    // }
    // if (data.floorID) {
    //     updateObj.floorID = data.floorID;
    // }
    if (data.assignTenant) {
        updateObj.assignTenant = data.assignTenant;
    }
    if (data.tenantID) {
        updateObj.tenantID = data.tenantID;
    }
    // if (data.contactNumber) {
    //     updateObj.contactNumber = data.contactNumber;
    // }
    // if (data.started) {
    //     updateObj.started = data.started;
    // }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    } else {
        updateObj.updatedBy = loggedUser._id;
        updateObj.updatedOn = new Date();
        meterTenants.updateOne({
            _id: data._id
        }, {
            $set: updateObj
        }, function (err, upMeter) {
            if (err) {
                result.errors.push(err.message);
                return res.json(result);
            } else if (upMeter.nModified) {
                result.success = true;
                result.result.push("meterTenants updated successfully");
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
    //     result.errors.push("You are not authorized to delete meterTenants");
    //     return res.json(result);
    // } else {
    updateObj.removedBy = loggedUser._id;
    updateObj.removedOn = new Date();
    updateObj.active = false;
    meterTenants.updateOne({
        _id: id
    }, {
        $set: updateObj
    }, function (err, upMeter) {
        if (err) {
            result.errors.push(err.message);
            return res.json(result);
        } else if (upMeter.nModified) {
            result.success = true;
            result.result.push("meterTenants deleted successfully");
            return res.json(result);
        } else {
            result.errors.push("No record found with this id");
            return res.json(result);
        }
    });
    // }
});

module.exports = router;