/*import http from 'http';
import * as constants from '../../constants.js';
import * as config from '../../config.js';
export { steamTest };

const STEAMID = config.steam.id;
const STEAMKEY = config.steam.key;

function steamTest(bot) {
    if (STEAMKEY !== undefined) {
        try {
            http.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + STEAMKEY + "&steamids=" + STEAMID, res => {
                var body = "";

                res.on("data", function (chunk) {
                    body += chunk;
                });

                res.on("end", function () {
                    let response = JSON.parse(body);
                    let appid = response.response.players[0].gameid;
                    let game = response.response.players[0].gameextrainfo;
                    if (appid !== undefined) {
                        if (appid !== 0) {
                            http.get("http://api.steampowered.com/IPlayerService/IsPlayingSharedGame/v0001/?key=" + STEAMKEY + "&steamid=" + STEAMID + "&appid_playing=" + appid, res => {
                                var body = "";

                                res.on("data", function (chunk) {
                                    body += chunk;
                                });

                                res.on("end", function () {
                                    let response = JSON.parse(body);
                                    let lender = response.response.lender_steamid;
                                    if (lender !== undefined) {
                                        if (lender !== 0) {
                                            http.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + STEAMKEY + "&steamids=" + lender, res => {
                                                var body = "";

                                                res.on("data", function (chunk) {
                                                    body += chunk;
                                                });

                                                res.on("end", function () {
                                                    let response = JSON.parse(body);
                                                    if (response.response.players[0] !== undefined) {
                                                        let lendername = response.response.players[0].personaname;
                                                        db.getGroups().forEach((g) => {
                                                            if (db.getGroupSetting(g.id, constants.settings.features.steam))
                                                                bot.telegram.sendMessage(g.tgid, "Henning schnorrt sich " + game + " von " + lendername);
                                                        });
                                                    }
                                                });
                                            }).on("error", function (e) {
                                                console.error("Got an error: ", e);
                                            });
                                        }
                                    }
                                });
                            }).on("error", function (e) {
                                console.error("Got an error: ", e);
                            });
                        }
                    }
                });
            }).on("error", function (e) {
                console.error("Got an error: ", e);
            });
        } catch (e) {

        }
    }
}
*/ 
//# sourceMappingURL=steamTest.js.map