import { RedisClientType } from '@node-redis/client';
import { RedisCommandRawReply } from '@node-redis/client/dist/lib/commands';
import { createClient} from 'redis';
let client:RedisClientType
(async () => {
    client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on('connect', () => console.log('Verbunden'));
    await client.connect();
   })();

//
// User
//
export function createUser(id: number, first_name: string, last_name: string="", username: string, alias:string):Promise<number>{
    return client.HSET("user:"+id+":info",{"first_name":first_name,"last_name":last_name,"username":username,"alias":alias})
}

export function getAlias(id:number|string){
    return client.hGet("user:"+id+":info","alias");
}

export function getUserFlags(id: number){
    return client.SMEMBERS("user:"+id+":flags");
}

export function setUserFlag(id:number,flag:string) {
    return client.SADD("user:"+id+":flags",flag);
}
export function setUserFlags(id:number,...flags:string[]) {
    return client.SADD("user:"+id+":flags",flags);
}
export function removeUserFlag(id:number,flag:string){
    //TODO
}

export function hasUserFlag(id:number,flag:string){
    //TODO
}

//
// Gruppen
//

export function groupExists(id: number):Promise<number>{
    return client.EXISTS("group:"+id+":info");
}

export function createGroup(id: number,title:string){
    return client.HSET("group:"+id+":info",{"title":title})
}

export function getGroupFlags(id: number){
    return client.SMEMBERS("group:"+id+":flags");
}

export function addUserToGroup(user_id: number,group_id: number):Promise<RedisCommandRawReply>{
    return client.multi().SADD("user:"+user_id+":groups",group_id.toString()).SADD("group:"+group_id+":users",user_id.toString()).exec();
}

export function setGroupFlag(id:number,flag:string) {
    return client.SADD("group:"+id+":flags",flag);
}

export function removeGroupFlag(id:number,flag:string){
    return client.SREM("group:"+id+":flags",flag);
}

export function hasGroupFlag(id:number,flag:string){
    return client.SISMEMBER("group:"+id+":flags",flag);
}

//
// Karma
//

/**
 * 
 * @param user_id 
 * @param group_id 
 * @returns 0 Falls er ehren kann 1 Falls nicht
 */
export function isOnSuperEhrenCooldown(user_id: number,group_id: number){
    return client.EXISTS("group:"+group_id+":user:"+user_id+":cooldowns:super")
}

export function setSuperEhrenCooldown(user_id:number,group_id: number,time:number){
    return client.SET("group:"+group_id+":user:"+user_id+":cooldowns:super","true").then(()=>client.EXPIRE("group:"+group_id+":user:"+user_id+":cooldowns:super",time));
}

/**
 * 
 * @param user_id 
 * @param group_id 
 * @returns 0 Falls er ehren kann 1 Falls nicht
 */
 export function isOnEhrenCooldown(user_id: number,group_id: number){
    return client.EXISTS("group:"+group_id+":user:"+user_id+":cooldowns:up")
}

export function setEhrenCooldown(user_id:number,group_id: number,time:number){
    return client.SET("group:"+group_id+":user:"+user_id+":cooldowns:up","true").then(()=>client.EXPIRE("group:"+group_id+":user:"+user_id+":cooldowns:up",time));
}

/**
 * 
 * @param user_id 
 * @param group_id 
 * @returns 0 Falls er ehren kann 1 Falls nicht
 */
 export function isOnEntehrenCooldown(user_id: number,group_id: number){
    return client.EXISTS("group:"+group_id+":user:"+user_id+":cooldowns:down")
}

export function setEntehrenCooldown(user_id:number,group_id: number,time:number){
    return client.SET("group:"+group_id+":user:"+user_id+":cooldowns:down","true").then(()=>client.EXPIRE("group:"+group_id+":user:"+user_id+":cooldowns:down",time));
}

export function incKarma(user_id:number,group_id: number, inc:number){
    return client.multi().ZINCRBY("user:"+user_id+":karma",inc,group_id.toString()).ZINCRBY("group:"+group_id+":karma",inc,user_id.toString()).exec()
}

export function getGroupKarmaOrdered(group_id:number){
    return client.zRangeWithScores("group:"+group_id+":karma",0,9)
}

//
//Points
//

export function isOnRewardCooldown(user_id: number,group_id: number){
    return client.EXISTS("group:"+group_id+":user:"+user_id+":cooldowns:reward")
}

export function setRewardCooldown(user_id:number,group_id: number,time:number){
    return client.SET("group:"+group_id+":user:"+user_id+":cooldowns:reward","true").then(()=>client.EXPIRE("group:"+group_id+":user:"+user_id+":cooldowns:reward",time));
}

export function getGroupPointsOrdered(group_id:number){
    return client.zRangeWithScores("group:"+group_id+":points",0,9)
}

export function incPoints(user_id:number,group_id: number, inc:number){
    return client.multi().ZINCRBY("user:"+user_id+":points",inc,group_id.toString()).ZINCRBY("group:"+group_id+":points",inc,user_id.toString()).exec().then((values)=>{return values[1]})
}