BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "api_token" (
	"token_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"token_text"	TEXT NOT NULL,
	FOREIGN KEY("user_id") REFERENCES "user"("user_id")
);
CREATE TABLE IF NOT EXISTS "group" (
	"group_id"	INTEGER NOT NULL UNIQUE,
	PRIMARY KEY("group_id")
);
CREATE TABLE IF NOT EXISTS "user_award" (
	"user_id"	INTEGER NOT NULL,
	"award_id"	INTEGER NOT NULL,
	PRIMARY KEY("user_id","award_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("user_id"),
	FOREIGN KEY("award_id") REFERENCES "award"("award_id")
);
CREATE TABLE IF NOT EXISTS "code" (
	"code_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"code_code"	TEXT NOT NULL UNIQUE,
	"code_description"	TEXT NOT NULL,
	"code_creator"	INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS "role" (
	"role_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"role_name"	TEXT
);
CREATE TABLE IF NOT EXISTS "award" (
	"award_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"award_title"	TEXT NOT NULL,
	"award_description"	TEXT
);
CREATE TABLE IF NOT EXISTS "user" (
	"user_id"	INTEGER NOT NULL UNIQUE,
	"user_name"	TEXT NOT NULL UNIQUE,
	"user_points"	INTEGER DEFAULT 0,
	"user_karma"	INTEGER DEFAULT 0,
	PRIMARY KEY("user_id")
);
CREATE TABLE IF NOT EXISTS "user_role" (
	"user_id"	INTEGER NOT NULL,
	"role_id"	INTEGER NOT NULL,
	FOREIGN KEY("role_id") REFERENCES "role"("role_id"),
	PRIMARY KEY("user_id","role_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("user_id")
);
COMMIT;
