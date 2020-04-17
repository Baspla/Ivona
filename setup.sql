BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "user_award" (
	"user_id"	INTEGER NOT NULL,
	"award_id"	INTEGER NOT NULL,
	"user_award_date"	INTEGER,
	PRIMARY KEY("user_id","award_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("user_id"),
	FOREIGN KEY("award_id") REFERENCES "award"("award_id")
);
CREATE TABLE IF NOT EXISTS "award" (
	"award_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"award_title"	TEXT NOT NULL UNIQUE,
	"award_description"	TEXT
);
CREATE TABLE IF NOT EXISTS "role" (
	"role_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"role_name"	TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS "user_group" (
	"user_id"	INTEGER NOT NULL,
	"group_id"	INTEGER NOT NULL,
	"user_group_karma"	INTEGER DEFAULT 0,
	"user_group_points"	INTEGER DEFAULT 0,
	"user_group_last_up"	INTEGER DEFAULT 0,
	"user_group_last_down"	INTEGER DEFAULT 0,
	"user_group_last_super"	INTEGER DEFAULT 0,
	"user_group_last_reward"	INTEGER DEFAULT 0,
	FOREIGN KEY("group_id") REFERENCES "group"("group_id"),
	PRIMARY KEY("group_id","user_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("user_id")
);
CREATE TABLE IF NOT EXISTS "group" (
	"group_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"group_tgid"	INTEGER NOT NULL UNIQUE,
	"group_name"	INTEGER NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS "code_config" (
	"k"	TEXT,
	"v"	TEXT,
	PRIMARY KEY("k")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "code_docsize" (
	"id"	INTEGER,
	"sz"	BLOB,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "code_content" (
	"id"	INTEGER,
	"c0"	TEXT,
	"c1"	TEXT,
	"c2"	TEXT,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "code_idx" (
	"segid"	TEXT,
	"term"	TEXT,
	"pgno"	TEXT,
	PRIMARY KEY("segid","term")
) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS "code_data" (
	"id"	INTEGER,
	"block"	BLOB,
	PRIMARY KEY("id")
);
CREATE VIRTUAL TABLE IF NOT EXISTS "code" USING fts5(code_name, code_description, code_creator);
CREATE TABLE IF NOT EXISTS "user" (
	"user_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"user_tgid"	INTEGER NOT NULL UNIQUE,
	"user_name"	TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS "token" (
	"token_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"token_text"	TEXT NOT NULL,
	FOREIGN KEY("user_id") REFERENCES "user"("user_id")
);
CREATE TABLE IF NOT EXISTS "user_role" (
	"user_id"	INTEGER NOT NULL,
	"role_id"	INTEGER NOT NULL,
	FOREIGN KEY("role_id") REFERENCES "role"("role_id"),
	PRIMARY KEY("user_id","role_id"),
	FOREIGN KEY("user_id") REFERENCES "user"("user_id")
);
COMMIT;
