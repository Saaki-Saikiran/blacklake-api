const jwt = require("jsonwebtoken");

var config = require('config');
var secretkey = config.get('secretkey');

// Format of token
//Authorization: Bearer < access token >
//verify token

module.exports = function(req, res, next) {
    //get auth header value
    const bearerHeader = req.headers['authorization'];

    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //split at the space
        const bearer = bearerHeader.split(' ');
        if(bearer.length == 2 ){
            //get token from array
            const bearerToken = bearer[1];
            //Set the token
            req.token = bearerToken;
            //next middileware
            jwt.verify(req.token, secretkey,function(err, decoded) {
                if (err) {
                	// console.log(err)
                    return res.status(401).json({"success": false, "result":[], errors:[err.message ] });
                }else{
                    req.loggedUser = decoded.resUser;
                    // console.log(req.loggedUser);
                    next();
                }
            })
        }else{
            return res.status(401).json({"success": false, "result":[], errors:['Unauthorized access.' ] });
        }
    } else {
        return  res.status(403).json({"success": false, "result":[], errors:['No token provided..' ] });
    }
}


