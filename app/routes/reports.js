var express = require('express');
var router = express.Router();
var MeterTenants = require('../models/mapmetertenant');
var ModbusLogs = require('../models/modbusLogging');
var verifyToken = require('../auth/tokenValidator');
var async = require('async');

router.post('/meterLogsReport', verifyToken, function (req, res, next) {
    var data = req.body;
    var result = {
        success: false,
        result: [],
        errors: []
    }
    var errors = [];
    var loggedUser = req.loggedUser;
    if (!data.meterID) {
        result.errors.push("meter ID is required");
        return res.json(result);
    }
    if (!data.fromDate) {
        result.errors.push("fromDate is required");
        return res.json(result);
    }
    if (!data.toDate) {
        result.errors.push("toDate is required");
        return res.json(result);
    }
    async.parallel([
        function (callback) {
            ModbusLogs.aggregate([{
                    $addFields: {
                        date: {
                            $dateFromString: {
                                dateString: '$date',
                                format: "%Y-%m-%d"
                            }
                        }
                    }
                },
                {
                    $match: {
                        "meterId": data.meterID,
                        date: {
                            $gte: new Date(data.fromDate),
                            $lte: new Date(data.toDate)
                        }
                    }
                },
                {
                    $unwind: '$modbusObj'
                },
                {
                    $group: {
                        _id: '$meterId',
                        modbusObj: {
                            $push: '$modbusObj'
                        }
                    }
                }
            ]).exec(function (err, resModLogs) {
                if (err) {
                    return callback(err.message);
                } else {
                    return callback(null, resModLogs);
                }
            });



        },
        function (callback) {

            MeterTenants.aggregate([{
                    $match: {
                        "meterSerialNumberID": data.meterID
                    }
                },
                {
                    $project: {
                        "buildingBlock": 1,
                        "floorID": 1,
                        "tenantID": 1,
                        "meterSerialNumberID": 1
                    }
                },

                {
                    $lookup: {
                        from: "floors",
                        let: {
                            "gateID1": "$floorID"
                        },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [{
                                            $eq: ["$_id", "$$gateID1"]
                                        }]
                                    }
                                }
                            },
                            {
                                $project: {
                                    floor: 1,
                                    block: 1
                                }
                            }
                        ],
                        as: "test"
                    }
                },
                {
                    $unwind: '$test'
                },
                {
                    $project: {
                        floor: '$test.floor',
                        block: '$test.block',
                        "tenantID": 1,
                        "meterSerialNumberID": 1
                    }
                },

                {
                    $lookup: {
                        from: "tenants",
                        let: {
                            "gateID1": "$tenantID"
                        },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [{
                                            $eq: ["$_id", "$$gateID1"]
                                        }]
                                    }
                                }
                            },
                            {
                                $project: {
                                    tenantName: 1
                                }
                            }
                        ],
                        as: "test"
                    }
                },
                {
                    $unwind: '$test'
                },
                {
                    $project: {
                        floor: 1,
                        block: 1,
                        tenantName: '$test.tenantName',
                        "meterSerialNumberID": 1
                    }
                },


                {
                    $lookup: {
                        from: "meters",
                        let: {
                            "gateID": "$meterSerialNumberID"
                        },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [{
                                            $eq: ["$_id", "$$gateID"]
                                        }]
                                    }
                                }
                            },
                            {
                                $project: {
                                    meterSerialNumber: 1,
                                    model: 1,
                                    meterType: 1
                                }
                            }
                        ],
                        as: "test"
                    }
                },
                {
                    $unwind: '$test'
                },

                {
                    $project: {
                        floor: 1,
                        block: 1,
                        tenantName: 1,
                        meterSerialNumberID: '$test.meterSerialNumber',
                        model: '$test.model',
                        meterType: '$test.meterType'
                    }
                },

                {
                    $lookup: {
                        from: "metertypes",
                        let: {
                            "gateID": "$meterType"
                        },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [{
                                            $eq: ["$_id", "$$gateID"]
                                        }]
                                    }
                                }
                            },
                            {
                                $project: {
                                    type: 1
                                }
                            }
                        ],
                        as: "test"
                    }
                },
                {
                    $unwind: '$test'
                },

                {
                    $project: {
                        floor: 1,
                        block: 1,
                        tenantName: 1,
                        meterSerialNumberID: 1,
                        model: 1,
                        meterType: '$test.type'
                    }
                },

                {
                    $lookup: {
                        from: "metermodel-masters",
                        let: {
                            "gateID": "$model"
                        },
                        pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [{
                                            $eq: ["$_id", "$$gateID"]
                                        }]
                                    }
                                }
                            },
                            {
                                $project: {
                                    meterModelName: 1
                                }
                            }
                        ],
                        as: "test"
                    }
                },
                {
                    $unwind: '$test'
                },

                {
                    $project: {
                        floor: 1,
                        block: 1,
                        tenantName: 1,
                        meterSerialNumberID: 1,
                        model: '$test.meterModelName',
                        meterType: 1
                    }
                },
            ]).exec(function (err, resMeterDetails) {
                if (err) {
                    return callback(err.message);
                } else {
                    return callback(null, resMeterDetails);
                }
            });


        }
    ], function (err, resAsyc) {
        if (err) {
            result.errors.push(err);
            return res.json(result);
        } else {
            result.success = true;
            result.modbusLogs = resAsyc[0];
            result.meterDetails = resAsyc[1];
            return res.json(result);
        }
    });
});

module.exports = router;