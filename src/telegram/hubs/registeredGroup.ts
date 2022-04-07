import { Composer } from "telegraf";
import { VoteListener } from "../listeners/points/vote";
import { PointListener } from "../listeners/points/points";
import { ehreCommand } from "../commands/points/ehre";
import { topCommand } from "../commands/points/top";
import { groupAdmin } from "./groupAdmin";
import { minecraftCommand } from "../commands/fun/minecraft";

export const registeredGroup = Composer.compose([
    groupAdmin,
    //statsCommand,
    topCommand,
    ehreCommand,
    minecraftCommand,
    //cardCommand,
    //HaikuListener,
    //MagicListener,
    //AnimeListener,
    PointListener,
    VoteListener
]);