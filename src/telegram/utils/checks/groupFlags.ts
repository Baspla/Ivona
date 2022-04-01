import { getGroupFlags } from "../../../data/data";

export const checkGroupFlags = (... required_flags:string[]) => {
    return (ctx, next) => {
        getGroupFlags(ctx.chat.id).then((group_flags)=>{
            if(required_flags.every((val)=>group_flags.includes(val))){
                next();
            }
        })
    };
};