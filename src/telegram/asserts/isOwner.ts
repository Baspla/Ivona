import { Composer } from "telegraf";
import { owner } from "../hubs/owner";
import { IsOwner } from "../predicates/IsOwner";
import { UserExists } from "../predicates/UserExists";
import { chatIsGroup } from "./chatIsGroup";

export const isOwner = Composer.optional(IsOwner,owner)