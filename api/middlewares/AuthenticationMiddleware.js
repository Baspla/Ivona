db = require("../../data/db.js");

exports.roleRequired = (...roles) => {
    return (req, res, next) => {
        for (var i = 0; i < arguments.length; i++) {
            if (db.hasUserRole(req.user_id, roles))
                return next();
        }
        return res.status(403).send({code: "403", message: "Ungültige Rolle"});
    }
};
