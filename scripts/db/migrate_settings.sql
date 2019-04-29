RENAME TABLE settings TO settings_old;
RENAME TABLE memberSettings TO memberSettings_old;
RENAME TABLE inviteCodeSettings TO inviteCodeSettings_old;
RENAME TABLE botSettings TO botSettings_old;

/* Start bot */

INSERT INTO settings (guildId, createdAt, updatedAt, `value`)
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
					WHEN `key` = 'channels' OR `key` = 'ignoredChannels' OR `key` = 'autoModModeratedChannels' OR `key` = 'autoModIgnoredChannels' THEN `value`
					WHEN `value` = 'true' OR `value` = 'false' THEN `value`
					WHEN `value` REGEXP '^-?([0-9]{1,10})$' THEN `value`
					ELSE CONCAT('"', `value`, '"')
				END
			)
		),
		'}'
	)
FROM settings_old
GROUP BY guildId
