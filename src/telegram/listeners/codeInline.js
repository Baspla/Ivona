const db = require("../../data/db");
exports.setupCodeInline = setupCodeInline;

function setupCodeInline(bot) {
    bot.on("inline_query", ((ctx) => {
        const result = [];
        let offset = Number(ctx.inlineQuery.offset);
        if (ctx.inlineQuery.query === "") {
            db.getCodes(10, offset).forEach((code) => {
                result.push(new InlineQueryResultArticle(code.code_id, code.code_code, code.code_description, "<b>" + code.code_code + "</b>\n" + code.code_description, "HTML"))
            });
            offset += 10;
        } else {
            const code = db.getCodeByCode(ctx.inlineQuery.query);
            if (code !== undefined)
                result.push(new InlineQueryResultArticle(code.code_id, code.code_code, code.code_description, "<b>" + code.code_code + "</b>\n" + code.code_description, "HTML"))
        }
        if (offset + "" !== ctx.inlineQuery.offset)
            ctx.answerInlineQuery(result, {next_offset: offset + ""})
    }));
}

class InlineQueryResultArticle {
    constructor(id, title, description, content, parse_mode) {
        this.type = "article";
        this.id = id;
        this.title = title;
        this.input_message_content = {message_text: content, parse_mode: parse_mode};
        this.description = description;
    }
}