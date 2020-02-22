db = require("../../data/db.js");

exports.validTokenNeeded = (req,res,next) => {
    if (req.headers['authorization']) {
        id = db.getUserIdFromToken(req.headers['authorization']);
        if(id!==undefined){
            req.user_id=id;
            return next();
        }else{
            return res.status(403).send({code: "403",message:"Ungültiger Token"});
        }
    } else {
        return res.status(401).send({code: "401",message:"Fehlender authorization Header"});
    }
}
