import { getUserFlags } from "../../../data/data";

export const checkUserFlags = (... required_flags:string[]) => {
    return (ctx, next) => {
        getUserFlags(ctx.from.id).then((user_flags)=>{
            if(required_flags.every((val)=>user_flags.includes(val))){
                next();
            }else{
                ctx.reply("Keine Berechtigung")
            }
        })
    };
};