const Database = require("better-sqlite3");
const db = new Database("ivona.db", {verbose: console.debug});
const crypto = require("crypto");
const fs = require("fs");
const constants = require("../constants");

const schemaFile = fs.readFileSync("schema.sql", "utf8");
db.exec(schemaFile);

class Award {
	constructor(id, title, description, icon) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.icon = icon;
	}

	static parse(res) {
		return (res && res.award) ? new Award(res.award.id, res.award.title, res.award.description, res.award.icon) : null;
	}
}

class Collection {
	constructor(id, item_id, name) {
		this.id = id;
		this.item_id = item_id;
		this.name = name;
	}

	//Item nicht auflösen (Kann bei ItemCollection 2x Auftreten)
	static parse(res) {
		return (res && res.collection) ? new Collection(res.collection.id, res.collection.item_id, res.collection.name) : null;
	}
}

class Group {
	constructor(id, tgid, type, title) {
		this.id = id;
		this.tgid = tgid;
		this.type = type;
		this.title = title;
	}

	static parse(res) {
		return (res && res.group) ? new Group(res.group.id, res.group.tgid, res.group.type, res.group.title) : null;
	}
}

class GroupSetting {
	constructor(group, setting, value) {
		this.group = group;
		this.setting = setting;
		this.value = value;
	}

	static parse(res) {
		return (res && res.group_setting) ? new GroupSetting(Group.parse(res), Setting.parse(res), res.group_setting.value) : null;
	}
}

class Item {
	constructor(id, name, description, icon, rarity) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.icon = icon;
		this.rarity = rarity;
	}

	static parse(res) {
		return (res && res.item) ? new Item(res.item.id, res.item.name, res.item.description, res.item.icon, res.item.rarity) : null;
	}
}

class ItemCollection {
	constructor(item, collection, chance) {
		this.item = item;
		this.collection = collection;
		this.chance = chance;
	}

	static parse(res) {
		return (res && res.item_collection) ? new ItemCollection(Item.parse(res), Collection.parse(res), res.item_collection.chance) : null;
	}
}

class Permission {
	constructor(id, name, description) {
		this.id = id;
		this.name = name;
		this.description = description;
	}

	static parse(res) {
		return (res && res.permission) ? new Permission(res.permission.id, res.permission.name, res.permission.description) : null;
	}
}

class Role {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	static parse(res) {
		return (res && res.role) ? new Role(res.role.id, res.role.name) : null;
	}
}

class RolePermission {
	constructor(role, permission) {
		this.role = role;
		this.permission = permission;
	}

	static parse(res) {
		return (res && res.role_permission) ? new RolePermission(Role.parse(res), Permission.parse(res)) : null;
	}
}

class Setting {
	constructor(id, name, type, options, defaultValue) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.options = options;
		this.defaultValue = defaultValue;
	}

	static parse(res) {
		return (res && res.setting) ? new Setting(res.setting.id, res.setting.name, res.setting.type, res.setting.options, res.setting.defaultValue) : null;
	}
}

class ShopEntry {
	constructor(id, item, price, sale) {
		this.id = id;
		this.item = item;
		this.price = price;
		this.sale = sale;
	}

	static parse(res) {
		return (res && res.shopEntry) ? new ShopEntry(res.shopEntry.id, Item.parse(res), res.shopEntry.price, res.shopEntry.sale) : null;
	}
}

class Token {
	constructor(id, user, text, app) {
		this.id = id;
		this.user = user;
		this.text = text;
		this.app = app;
	}

	static parse(res) {
		return (res && res.token) ? new Token(res.token.id, User.parse(res), res.token.text, res.token.app) : null;
	}
}

class Transaction {
	constructor(id, user, amount, purpose, item, date) {
		this.id = id;
		this.user = user;
		this.amount = amount;
		this.purpose = purpose;
		this.item = item;
		this.date = date;
	}

	static parse(res) {
		return (res && res.transaction) ? new Transaction(res.transaction.id, User.parse(res), res.transaction.amount, res.transaction.purpose, Item.parse(res), res.transaction.date) : null;
	}
}

class User {
	constructor(id, name, money, tgid, tgfirstname, tglastname, tgusername, onetime) {
		this.id = id;
		this.name = name;
		this.money = money;
		this.tgid = tgid;
		this.tgfirstname = tgfirstname;
		this.tglastname = tglastname;
		this.tgusername = tgusername;
		this.onetime = onetime;
	}

	static parse(res) {
		return (res && res.user) ? new User(res.user.id, res.user.name, res.user.money, res.user.tgid, res.user.tgfirstname, res.user.tglastname, res.user.tgusername, res.user.onetime) : null;
	}
}

class UserAward {
	constructor(user, award, date) {
		this.user = user;
		this.award = award;
		this.date = date;
	}

	static parse(res) {
		return (res && res.user_award) ? new UserAward(User.parse(res), Award.parse(res), res.user_award.date) : null;
	}
}

class UserGroup {
	constructor(user, group, karma, points, lastUp, lastDown, lastSuper, lastReward) {
		this.user = user;
		this.group = group;
		this.karma = karma;
		this.points = points;
		this.lastUp = lastUp;
		this.lastUp = lastUp;
		this.lastDown = lastDown;
		this.lastSuper = lastSuper;
		this.lastReward = lastReward;
	}

	get level() {
		for (let i = 0; i < constants.levels.length; i++) {
			if (this.points < constants.levels[i]) return i;
		}
		return constants.levels.length - 1;
	}

	get titel() {
		if (constants.titles.length === 0) return "Keine Titel";
		return constants.titles[Math.min(constants.titles.length - 1, Math.max(0, this.level))];
	}

	get levelZiel() {
		if (this.level >= constants.levels.length)
			return "∞";
		return constants.levels[Math.max(0, this.level)];
	}

	static parse(res) {
		return (res && res.user_group) ? new UserGroup(User.parse(res), Group.parse(res), res.user_group.karma, res.user_group.points, res.user_group.lastUp, res.user_group.lastDown, res.user_group.lastSuper, res.user_group.lastReward) : null;
	}
}

class UserItem {
	constructor(id, user, item) {
		this.id = id;
		this.user = user;
		this.item = item;
	}

	static parse(res) {
		return (res && res.user_item) ? new UserItem(res.user_item.id, User.parse(res), Item.parse(res)) : null;
	}
}

class UserRole {
	constructor(user, role) {
		this.user = user;
		this.role = role;
	}

	static parse(res) {
		return (res && res.user_role) ? new UserRole(User.parse(res), Role.parse(res)) : null;
	}
}

class UserSetting {
	constructor(user, setting, value) {
		this.user = user;
		this.setting = setting;
		this.value = value;
	}

	static parse(res) {
		return (res && res.user_setting) ? new UserSetting(User.parse(res), Setting.parse(res), res.user_setting.value) : null;
	}
}

class UserMatch {
	constructor(user, match, place, deck_id) {
		this.user = user;
		this.match = match;
		this.place = place;
		this.deck_id = deck_id;
	}

	//Deck nicht Auflösen (2x User)
	static parse(res) {
		return (res && res.user_match) ? new UserMatch(User.parse(res), Match.parse(res), res.user_match.place, res.user_match.deck_id) : null;
	}
}

class Deck {
	constructor(id, user, title, description, type) {
		this.id = id;
		this.user = user;
		this.title = title;
		this.description = description;
		this.type = type;
	}

	static parse(res) {
		return (res && res.deck) ? new Deck(res.deck.id, User.parse(res), res.deck.title, res.deck.description, res.deck.type) : null;
	}
}

class Match {
	constructor(id, date, type, title) {
		this.id = id;
		this.date = date;
		this.type = type;
		this.title = title;
	}

	static parse(res) {
		return (res && res.match) ? new Token(res.match.id, res.match.date, res.match.type, res.match.title) : null;
	}
}


process.on("exit", () => db.close());
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));


module.exports = {
	backup(filename) {
		return db.backup(filename);
	},
	getUserGroups(userId) {
		return db.prepare("SELECT * FROM \"user_group\" JOIN \"group\" ON \"user_group\".group_id = \"group\".id WHERE \"user_group\".user_id = ?")
			.expand().all(userId).map(UserGroup.parse);
	},
	createUser(tgid, name, firstname, lastname, username) {
		db.prepare("INSERT INTO user (tgid, name, tgfirstname, tglastname, tgusername) VALUES (?,?,?,?,?)").run(tgid, name, firstname, lastname, username);
	},
	getUserByTGID(id) {
		return User.parse(db.prepare("SELECT * FROM \"user\" WHERE tgid = ?").expand().get(id));
	},
	getUserGroupByTGID(userId, groupId) {
		return UserGroup.parse(db.prepare("SELECT * FROM \"user_group\" JOIN \"user\" ON \"user_group\".user_id = \"user\".id JOIN \"group\" ON \"user_group\".group_id = \"group\".id WHERE \"user\".tgid = ? AND \"group\".tgid = ?")
			.expand().get(userId, groupId));
	},
	getUser(id) {
		return User.parse(db.prepare("SELECT * FROM \"user\" WHERE id = ?").expand().get(id));
	},
	getGroups() {
		return db.prepare("SELECT * FROM \"group\"").expand().all().map(Group.parse);
	},
	setUserGroupLastSuper(userId, groupId, last) {
		db.prepare("UPDATE \"user_group\" SET lastSuper = ? WHERE user_id = ? AND group_id = ?").run(last, userId, groupId);
	},
	setUserGroupKarma(userId, groupId, karma) {
		db.prepare("UPDATE \"user_group\" SET karma = ? WHERE user_id = ? AND group_id = ?").run(karma, userId, groupId);
	},
	setUserGroupLastUp(userId, groupId, last) {
		db.prepare("UPDATE \"user_group\" SET lastUp = ? WHERE user_id = ? AND group_id = ?").run(last, userId, groupId);
	},
	setUserGroupLastDown(userId, groupId, last) {
		db.prepare("UPDATE \"user_group\" SET lastDown = ? WHERE user_id = ? AND group_id = ?").run(last, userId, groupId);
	},
	setUserGroupPoints(userId, groupId, points) {
		db.prepare("UPDATE \"user_group\" SET points = ? WHERE user_id = ? AND group_id = ?").run(points, userId, groupId);
	},
	setUserGroupLastReward(userId, groupId, last) {
		db.prepare("UPDATE \"user_group\" SET lastReward = ? WHERE user_id = ? AND group_id = ?").run(last, userId, groupId);
	},
	getUserGroupsOrderedByTGIDByPoints(groupTGID, limit, offset) {
		return db.prepare("SELECT * FROM \"user_group\" JOIN \"user\" ON \"user_group\".user_id = \"user\".id JOIN \"group\" ON \"user_group\".group_id = \"group\".id WHERE \"group\".tgid = ? ORDER BY \"user_group\".points DESC LIMIT ? OFFSET ?").expand().all(groupTGID, limit, offset).map(UserGroup.parse);
	},
	getUsersOrderedByTGIDByKarma(groupTGID, limit, offset) {
		return db.prepare("SELECT * FROM \"user_group\" JOIN \"user\" ON \"user_group\".user_id = \"user\".id JOIN \"group\" ON \"user_group\".group_id = \"group\".id WHERE \"group\".tgid = ? ORDER BY \"user_group\".karma DESC LIMIT ? OFFSET ?").expand().all(groupTGID, limit, offset).map(UserGroup.parse);
	},
	getGroupByTGID(tgid) {
		return Group.parse(db.prepare("SELECT * FROM \"group\" WHERE tgid = ?").expand().get(tgid));
	},
	addMoney(userid, amount, purpose, item) {
		db.transaction(() => {
			db.prepare("UPDATE \"user\" SET \"money\" = \"money\" + ? WHERE \"id\" = ?").run(amount, userid);
			db.prepare("INSERT INTO \"transaction\" (\"user_id\",\"amount\",\"purpose\",\"item_id\",\"date\") VALUES (?,?,?,?,?)").run(userid, amount, purpose, item, new Date().getTime());
		})();
		console.log(constants.logs.db + amount + "$ zu " + userid + " hinzugefügt wegen " + purpose + ((item != null) ? (" mit Item " + item + ".") : "."));
	},
	removeMoney(userid, amount, purpose, item) {
		db.transaction(() => {
			db.prepare("UPDATE \"user\" SET \"money\" = \"money\" - ? WHERE \"id\" = ?").run(amount, userid);
			db.prepare("INSERT INTO \"transaction\" (\"user_id\",\"amount\",\"purpose\",\"item_id\",\"date\") VALUES (?,?,?,?,?)").run(userid, amount, purpose, item, new Date().getTime());
		})();
		console.log(constants.logs.db, amount, "$ von", userid, "abgezogen wegen", purpose + ((item != null) ? (" mit Item " + item + ".") : "."));
	},
	getUserGroup(userId, groupId) {
		return UserGroup.parse(db.prepare("SELECT * FROM \"user_group\" JOIN \"user\" ON \"user_group\".user_id = \"user\".id JOIN \"group\" ON \"user_group\".group_id = \"group\".id WHERE \"user\".id = ? AND \"group\".id = ?")
			.expand().get(userId, groupId));
	},
	getUserPermissionsByTGID(tgid) {
		return db.prepare("SELECT permission.* FROM user JOIN user_role ON user_role.user_id = user.id JOIN role_permission ON role_permission.role_id = user_role.role_id JOIN permission ON permission.id = role_permission.permission_id WHERE user.tgid = ? GROUP BY permission.id").expand().all(tgid).map(Permission.parse);
	},
	hasPermissionByTGID(tgid, permissionName) {
		return db.prepare("SELECT permission.* FROM user JOIN user_role ON user_role.user_id = user.id JOIN role_permission ON role_permission.role_id = user_role.role_id JOIN permission ON permission.id = role_permission.permission_id WHERE user.tgid = ? AND permission.name = ? GROUP BY permission.id").get(tgid, permissionName) != null;
	},
	getGroupSettingsByTGID(tgid) {
		return db.prepare("SELECT group_setting.* FROM group_setting JOIN setting ON setting.id = group_setting.setting_id JOIN \"group\" ON \"group\".id = group_setting.group_id WHERE \"group\".tgid = ? AND setting.type = ?").expand().all(tgid,constants.settings.types.group).map(Setting.parse);
	},
	getGroupSettingByTGID(tgid, settingName) {
		return GroupSetting.parse(db.prepare("SELECT group_setting.* FROM group_setting JOIN setting ON setting.id = group_setting.setting_id JOIN \"group\" ON \"group\".id = group_setting.group_id WHERE \"group\".tgid = ? AND setting.name = ? AND setting.type = ?").expand().get(tgid, settingName,constants.settings.types.group));
	},
	getGroupSetting(id, settingName) {
		return GroupSetting.parse(db.prepare("SELECT group_setting.* FROM group_setting JOIN setting ON setting.id = group_setting.setting_id JOIN \"group\" ON \"group\".id = group_setting.group_id WHERE \"group\".id = ? AND setting.name = ? AND setting.type = ?").expand().get(id, settingName,constants.settings.types.group));
	},
	createUserGroup(userId, groupId) {
		db.prepare("INSERT INTO user_group (user_id,group_id) VALUES (?,?)").run(userId,groupId);
	},
	setUserName(id, name) {
		db.prepare("UPDATE user SET name = ? WHERE id = ? ").run(name,id);
	},
	getDecksByUser(id) {
		return db.prepare("SELECT * FROM deck JOIN user ON user.id = deck.user_id WHERE user_id = ?").expand().all(id).map(Deck.parse);
	},
	createDeck(titel, id, desc, type) {
		db.prepare("INSERT INTO deck (title, user_id, description, type) VALUES (?,?,?,?)").run(titel,id,desc,type);
	}
};