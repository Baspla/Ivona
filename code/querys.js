module.exports.getUser = "SELECT * FROM user WHERE id = ?";
module.exports.listTopPoints = "SELECT * FROM user ORDER BY points DESC LIMIT ?";
module.exports.listTopKarma = "SELECT * FROM user ORDER BY karma DESC LIMIT ?";
module.exports.addUser = "INSERT INTO user (id,username,points,karma) VALUES (?,?,?,?)";
module.exports.increasePoints = "UPDATE user SET points = points + ? WHERE id = ?";