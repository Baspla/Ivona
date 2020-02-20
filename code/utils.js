function isCreator(id) {
    return id===67025299;
}

module.exports={isGroup,isCreator};

function isGroup(type) {
    return type === "group" || type === "supergroup";
}