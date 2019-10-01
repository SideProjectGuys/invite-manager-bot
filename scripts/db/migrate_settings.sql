/* Create new settings table */
CREATE TABLE IF NOT EXISTS `settings_new` (`id` INTEGER auto_increment , `guildId` VARCHAR(32), `value` JSON, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `deletedAt` DATETIME, PRIMARY KEY (`id`), FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;
ALTER TABLE `settings_new` ADD UNIQUE INDEX `settings_guild_id` (`guildId`);

/* Populate new settings table */
INSERT INTO settings_new (guildId, createdAt, updatedAt, `value`)
SELECT
	guildId,
	NOW() AS createdAt,
	NOW() AS updatedAt,
	CONCAT(
		'{',
		GROUP_CONCAT(
			CONCAT(
				'"',
				`key`,
				'":',
				CASE
					WHEN `value` IS NULL THEN 'null'
					WHEN `key` IN (
						'channels',
						'ignoredChannels',
						'autoModModeratedChannels',
						'autoModModeratedRoles',
						'autoModIgnoredChannels',
						'autoModIgnoredRoles',
						'autoModLinksWhitelist',
						'autoModLinksBlacklist',
						'autoModWordsBlacklist'
					) THEN CONCAT('["', REPLACE(`value`, ',', '","'), '"]')
					WHEN `key` NOT IN(
						'prefix',
						'lang',
						'logChannel',
						'joinMessage',
						'joinMessageChannel',
						'leaveMessage',
						'leaveMessageChannel',
						'leaderboardStyle',
						'rankAssignmentStyle',
						'rankAnnouncementChannel',
						'rankAnnouncementMessage',
						'mutedRole',
						'captchaVerificationWelcomeMessage',
						'captchaVerificationSuccessMessage',
						'captchaVerificationFailedMessage',
						'modLogChannel',
						'announcementVoice'
					) THEN `value`
					WHEN `key` IN (
						'joinMessage',
						'leaveMessage',
						'rankAnnouncementMessage'
					) AND JSON_VALID(`value`) THEN `value`
					ELSE CONCAT('"', REPLACE(REPLACE(REPLACE(REPLACE(`value`, '\n', '\\n'), '\\', '\\\\'), '"', '\\"'), '\t', '\\t'), '"')
				END
			)
		),
		'}'
	)
FROM settings
GROUP BY guildId;

/* Create new member settings table */
CREATE TABLE IF NOT EXISTS `memberSettings_new` (`id` INTEGER auto_increment , `guildId` VARCHAR(32), `memberId` VARCHAR(32), `value` JSON, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `deletedAt` DATETIME, PRIMARY KEY (`id`), FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (`memberId`) REFERENCES `members` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;
ALTER TABLE `memberSettings_new` ADD UNIQUE INDEX `member_settings_guild_id_member_id` (`guildId`, `memberId`);

/* Populate new member settings table */
INSERT INTO memberSettings_new (guildId, memberId, createdAt, updatedAt, `value`)
SELECT
	guildId,
	memberId,
	NOW() AS createdAt,
	NOW() AS updatedAt,
	CONCAT(
		'{',
		GROUP_CONCAT(
			CONCAT(
				'"',
				`key`,
				'":',
				CASE
					WHEN `value` IS NULL THEN 'null'
					WHEN `key` NOT IN(
						'hideFromLeaderboard'
					) THEN `value`
					ELSE CONCAT('"', `value`, '"')
				END
			)
		),
		'}'
	)
FROM memberSettings
GROUP BY guildId, memberId;

/* Create new invite code settings table */
CREATE TABLE IF NOT EXISTS `inviteCodeSettings_new` (`id` INTEGER auto_increment , `guildId` VARCHAR(32), `inviteCode` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_bin, `value` JSON, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `deletedAt` DATETIME, PRIMARY KEY (`id`), FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (`inviteCode`) REFERENCES `inviteCodes` (`code`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;
ALTER TABLE `inviteCodeSettings_new` ADD UNIQUE INDEX `invite_code_settings_guild_id_invite_code` (`guildId`, `inviteCode`);

/* Populate new invite code settings table */
INSERT INTO inviteCodeSettings_new (guildId, inviteCode, createdAt, updatedAt, `value`)
SELECT
	guildId,
	inviteCode,
	NOW() AS createdAt,
	NOW() AS updatedAt,
	CONCAT(
		'{',
		GROUP_CONCAT(
			CONCAT(
				'"',
				`key`,
				'":',
				CASE
					WHEN `value` IS NULL THEN 'null'
					WHEN `key` IN (
						'roles'
					) THEN CONCAT('["', REPLACE(`value`, ',', '","'), '"]')
					ELSE CONCAT('"', REPLACE(`value`, '\n', '\\n'), '"')
				END
			)
		),
		'}'
	)
FROM inviteCodeSettings
GROUP BY guildId, inviteCode;

/* Enable all tables */
RENAME TABLE settings TO settings_old;
RENAME TABLE memberSettings TO memberSettings_old;
RENAME TABLE inviteCodeSettings TO inviteCodeSettings_old;

RENAME TABLE settings_new TO settings;
RENAME TABLE memberSettings_new TO memberSettings;
RENAME TABLE inviteCodeSettings_new TO inviteCodeSettings;
