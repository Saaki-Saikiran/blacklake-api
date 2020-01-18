var schedule = require('node-schedule');
var ModbusRTU = require("modbus-serial");

var Loggings = require('../../app/models/modbusLogging');
var loggingObj = {};
var result = {
    success: false,
    errors: [],
    result: []
};

function getDAta() {
    console.log('-----------modbus------------');
    // create an empty modbus client
    var client = new ModbusRTU();
    // open connection to a tcp line
    //Gateway IP and Port Number as parameters
    for (var i = 1; i <= 50; i++) {
        console.log('meter serial number...', i);
        client.connectTCP("192.168.1.42", 4357);
        //Meter Serial No as Parameter ID
        client.setID(i); //loop for 1 - 50
        // read the values of 10 registers starting at address 0
        // on device number 1. and log the values to the console.
        // setInterval(function () {
        //Starting Register and Register Length as parameters
        client.readHoldingRegisters(4, 10, function (err, data) {
            console.log("data------->", data);
            loggingObj.data = data;
            loggingObj.createdOn = new Date();
            var logging = new Loggings(loggingObj);
            logging.save(function (err, resWeather) {
                if (err) {
                    result.errors.push(err.message);
                    return result;
                } else {
                    result.success = true;
                    result.result.push("Updated successfully");
                    return result;
                }
            })
        });
    }
}


var j = schedule.scheduleJob("getModbusData", '*/1 * * * *', function () {
    getDAta();
    console.log('deviceHealthMonitor function called', new Date());
});