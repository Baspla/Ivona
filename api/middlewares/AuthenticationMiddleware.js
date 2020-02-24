db = require("../../data/db.js");

exports.roleRequired = (role) => {
    return (req, res, next) => {
        if (db.hasUserRole(req.user_id, role)) {
            return next();
        } else {
            return res.status(403).send({code: "403",message:"Ungültige Rolle"});
        }
    }
};
