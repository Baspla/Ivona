const db = require("../../data/db");
module.exports = {
    points: db.getFeatureByName("points").id,
    karma: db.getFeatureByName("karma").id,
    anime: db.getFeatureByName("anime").id,
    magic: db.getFeatureByName("magic").id,
    magicDaily: db.getFeatureByName("magicDaily").id,
    justThings: db.getFeatureByName("justThings").id,
    quote: db.getFeatureByName("quote").id,
    steam: db.getFeatureByName("steam").id,
};