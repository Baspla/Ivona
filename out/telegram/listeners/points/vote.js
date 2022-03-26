"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupVote = void 0;
const utils = __importStar(require("../../utils/utils"));
const config = __importStar(require("../../../config"));
const data_1 = require("../../../data/data");
const superEhrenHandler = (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
        (0, data_1.groupExists)(ctx.chat.id).then((num) => {
            if (num == 1) {
                const reply = ctx.message.reply_to_message;
                if (reply !== undefined && !reply.from.is_bot) {
                    (0, data_1.isOnSuperEhrenCooldown)(ctx.from.id, ctx.chat.id).then((num) => {
                        if (num == 0) {
                            if (reply.from.id !== ctx.from.id) {
                                (0, data_1.setSuperEhrenCooldown)(ctx.from.id, ctx.chat.id, config.cooldown.voteSuper);
                                Promise.all([(0, data_1.getAlias)(ctx.from.id), (0, data_1.getAlias)(reply.from.id)]).then((values) => {
                                    ctx.reply("<a href=\"tg://user?id=" + ctx.from.id + "\">" + values[0] + "</a> ehrt <a href=\"tg://user?id=" + reply.from.id + "\">" + values[1] + "</a> absolut hart!", {
                                        parse_mode: "HTML",
                                        disable_notification: true
                                    });
                                    (0, data_1.incKarma)(reply.from.id, ctx.chat.id, 3);
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    next();
};
const ehrenHandler = (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
        (0, data_1.groupExists)(ctx.chat.id).then((num) => {
            if (num == 1) {
                const reply = ctx.message.reply_to_message;
                if (reply !== undefined && !reply.from.is_bot) {
                    (0, data_1.isOnEhrenCooldown)(ctx.from.id, ctx.chat.id).then((num) => {
                        if (num == 0) {
                            if (reply.from.id !== ctx.from.id) {
                                (0, data_1.setEhrenCooldown)(ctx.from.id, ctx.chat.id, config.cooldown.voteUp);
                                Promise.all([(0, data_1.getAlias)(ctx.from.id), (0, data_1.getAlias)(reply.from.id)]).then((values) => {
                                    ctx.reply("<a href=\"tg://user?id=" + ctx.from.id + "\">" + values[0] + "</a> ehrt <a href=\"tg://user?id=" + reply.from.id + "\">" + values[1] + "</a>", {
                                        parse_mode: "HTML",
                                        disable_notification: true
                                    });
                                    (0, data_1.incKarma)(reply.from.id, ctx.chat.id, 1);
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    next();
};
const entehrenHandler = (ctx, next) => {
    if (utils.isReply(ctx) && utils.isGroupChat(ctx.chat.type)) {
        (0, data_1.groupExists)(ctx.chat.id).then((num) => {
            if (num == 1) {
                const reply = ctx.message.reply_to_message;
                if (reply !== undefined && !reply.from.is_bot) {
                    (0, data_1.isOnEntehrenCooldown)(ctx.from.id, ctx.chat.id).then((num) => {
                        if (num == 0) {
                            if (reply.from.id !== ctx.from.id) {
                                (0, data_1.setEntehrenCooldown)(ctx.from.id, ctx.chat.id, config.cooldown.voteUp);
                                Promise.all([(0, data_1.getAlias)(ctx.from.id), (0, data_1.getAlias)(reply.from.id)]).then((values) => {
                                    ctx.reply("<a href=\"tg://user?id=" + ctx.from.id + "\">" + values[0] + "</a> entehrt <a href=\"tg://user?id=" + reply.from.id + "\">" + values[1] + "</a>", {
                                        parse_mode: "HTML",
                                        disable_notification: true
                                    });
                                    (0, data_1.incKarma)(reply.from.id, ctx.chat.id, -1);
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    next();
};
const superEhrenRegex = /^(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4).*|.*(\u2764\ufe0f|\ud83d\udc96|\ud83e\udde1|\ud83d\udc9b|\ud83d\udc9a|\ud83d\udc99|\ud83d\udc9c|\ud83d\udda4)$/;
const ehrenRegex = /^(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38).*|.*(\u002b|\u261d|\ud83d\udc46|\ud83d\udc4f|\ud83d\ude18|\ud83d\ude0d|\ud83d\udc4c|\ud83d\udc4d|\ud83d\ude38)$/;
const entehrenRegex = /^(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47).*|.*(\u2639\ufe0f|\ud83d\ude20|\ud83d\ude21|\ud83e\udd2c|\ud83e\udd2e|\ud83d\udca9|\ud83d\ude3e|\ud83d\udc4e|\ud83d\udc47)$/;
function setupVote(bot) {
    // Super Ehren
    bot.hears(superEhrenRegex, superEhrenHandler);
    // Ehren
    bot.hears(ehrenRegex, ehrenHandler);
    // Entehren
    bot.hears(entehrenRegex, entehrenHandler);
}
exports.setupVote = setupVote;
//# sourceMappingURL=vote.js.map