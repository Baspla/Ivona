db = require("../../data/db.js");

exports.validTokenNeeded = (req,res,next) => {

    if (req.headers['authorization']) {
        const user = db.getUserByToken(req.headers['authorization']);
        if(user!==undefined){
            req.user_id=user.user_id;
            return next();
        }else{
            return res.status(403).send({code: "403",message:"Ungültiger Token"});
        }
    } else {
        return res.status(401).send({code: "401",message:"Fehlender authorization Header"});
    }
};
