
export default { isGroupChat, isUserChat, isCreator, isReply }
export function isGroupChat(type) {
    return type === "group" || type === "supergroup";
}

export function isUserChat(type) {
    return type === "private";
}

export function isCreator(id) {
    return id === 67025299;
}

export function isReply(ctx) {
    if (ctx.message.reply_to_message !== undefined) {
        return ctx.message.reply_to_message.from !== undefined;
    }
    return false;
}

export function errorHandler(reason:string){
    console.error("Promise rejected:",reason)
}

export function getLevelForPoints(value: number) {
    if(value<=1000)
        return Math.floor(value / 200);
    else
        return Math.floor(value / 500)+4;
}
export function getTitleForPoints(value: number) {
    return getTitleForLevel(getLevelForPoints(value));
}
export function getTitleForLevel(value: number) {
    let rank = (value - (value % 5)) / 5
    let stage = (value % 5) + 1;
    return "Rang: " + rank + " Stufe: " + roman(stage);
}
export function getTargetForLevel(value: number) {
    if(value<5){
        return Math.floor(value+1)*200
    }else{
        return Math.floor(value-3)*500
    }
}
export function getTargetForPoints(value: number) {
    return getTargetForLevel(getLevelForPoints(value));
}
function roman(stage: number) {
    if (stage < 1 || stage > 5)
        return stage;
    else switch (stage) {
        case 1:
            return "I"
        case 2:
            return "II"
        case 3:
            return "III"
        case 4:
            return "IV"
        case 5:
            return "V"
    }
}

