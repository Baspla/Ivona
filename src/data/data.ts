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

export function createUser(id: number, first_name: string, last_name: string="", username: string, alias:string):Promise<number>{
    return client.HSET("user:"+id+":info",{"first_name":first_name,"last_name":last_name,"username":username,"alias":alias})
}

export function getAlias(id:number|string){
    return client.hGet("user:"+id+":info","alias");
}

export function groupExists(id: number):Promise<number>{
    return client.EXISTS("group:"+id+":info");
}

export function addUserToGroup(user_id: number,group_id: number):Promise<RedisCommandRawReply>{
    return client.multi().SADD("user:"+user_id+":groups",group_id.toString()).SADD("group:"+group_id+":users",user_id.toString()).exec();
}
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

export function getGroupPointsOrdered(group_id:number){
    return client.zRangeWithScores("group:"+group_id+":points",0,9)
}