var config = require('config');
var dbConfig = config.get('dbConfig');

module.exports = {
	// url: "mongodb://localhost/blacklake"
	url: "mongodb://" + dbConfig.username + ":" + dbConfig.password + "@" + dbConfig.host + ":" + dbConfig.port + "/" + dbConfig.dbName
}