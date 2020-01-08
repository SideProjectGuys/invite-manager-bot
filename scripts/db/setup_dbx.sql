SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `im_x`
--

-- --------------------------------------------------------

--
-- Table structure for table `channels`
--

CREATE TABLE `channels` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commandUsages`
--

CREATE TABLE `commandUsages` (
  `id` int(11) NOT NULL,
  `command` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `args` text COLLATE utf8mb4_unicode_ci,
  `time` float DEFAULT NULL,
  `errored` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customInvites`
--

CREATE TABLE `customInvites` (
  `id` int(11) NOT NULL,
  `amount` bigint(11) DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cleared` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creatorId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guilds`
--

CREATE TABLE `guilds` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberCount` int(11) DEFAULT NULL,
  `banReason` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guildSettings`
--

CREATE TABLE `guildSettings` (
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `id` int(11) NOT NULL,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `error` text COLLATE utf8mb4_unicode_ci,
  `details` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inviteCodes`
--

CREATE TABLE `inviteCodes` (
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maxAge` int(11) DEFAULT NULL,
  `maxUses` int(11) DEFAULT NULL,
  `uses` int(11) DEFAULT NULL,
  `temporary` tinyint(1) DEFAULT NULL,
  `clearedAmount` int(11) NOT NULL DEFAULT '0',
  `isVanity` tinyint(4) NOT NULL DEFAULT '0',
  `isWidget` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channelId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inviterId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inviteCodeSettings`
--

CREATE TABLE `inviteCodeSettings` (
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inviteCode` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `value` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `joins`
--

CREATE TABLE `joins` (
  `id` int(11) NOT NULL,
  `invalidatedReason` enum('fake','leave') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cleared` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `exactMatchCode` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joinId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `action` enum('addInvites','addRank','clearInvites','config','memberConfig','removeRank','updateRank','restoreInvites','owner') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `data` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discriminator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `memberSettings`
--

CREATE TABLE `memberSettings` (
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `punishmentConfigs`
--

CREATE TABLE `punishmentConfigs` (
  `id` int(11) NOT NULL,
  `type` enum('ban','kick','softban','warn','mute') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `args` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `punishments`
--

CREATE TABLE `punishments` (
  `id` int(11) NOT NULL,
  `type` enum('ban','kick','softban','warn','mute') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `args` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creatorId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ranks`
--

CREATE TABLE `ranks` (
  `numInvites` int(11) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rolePermissions`
--

CREATE TABLE `rolePermissions` (
  `command` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `roleId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scheduledActions`
--

CREATE TABLE `scheduledActions` (
  `id` int(11) NOT NULL,
  `actionType` enum('unmute') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `args` json DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `strikeConfigs`
--

CREATE TABLE `strikeConfigs` (
  `id` int(11) NOT NULL,
  `type` enum('invites','links','words','allCaps','duplicateText','quickMessages','mentionUsers','mentionRoles','emojis', 'hoist') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `strikes`
--

CREATE TABLE `strikes` (
  `id` int(11) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` enum('invites','links','words','allCaps','duplicateText','quickMessages','mentionUsers','mentionRoles','emojis','hoist') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channelId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `content` text COLLATE utf8mb4_unicode_ci,
  `embeds` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reactionRoles`
--

CREATE TABLE `reactionRoles` (
  `channelId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `messageId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleId` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emoji` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

--
-- Indexes for table `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guildId` (`guildId`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `commandUsages`
--
ALTER TABLE `commandUsages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guildId` (`guildId`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `customInvites`
--
ALTER TABLE `customInvites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`),
  ADD KEY `creatorId` (`creatorId`),
  ADD KEY `guildId` (`guildId`,`memberId`);

--
-- Indexes for table `guilds`
--
ALTER TABLE `guilds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `deletedAt` (`deletedAt`);
ALTER TABLE `guilds` ADD FULLTEXT KEY `name` (`name`);

--
-- Indexes for table `guildSettings`
--
ALTER TABLE `guildSettings`
  ADD PRIMARY KEY (`guildId`);

--
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guildId` (`guildId`);

--
-- Indexes for table `inviteCodes`
--
ALTER TABLE `inviteCodes`
  ADD PRIMARY KEY (`code`),
  ADD KEY `channelId` (`channelId`),
  ADD KEY `inviterId` (`inviterId`),
  ADD KEY `guildId_inviterId` (`guildId`,`inviterId`);

--
-- Indexes for table `inviteCodeSettings`
--
ALTER TABLE `inviteCodeSettings`
  ADD PRIMARY KEY (`inviteCode`),
  ADD UNIQUE KEY `invite_code_settings_guild_id_invite_code` (`guildId`,`inviteCode`);

--
-- Indexes for table `joins`
--
ALTER TABLE `joins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `joins_guild_id_member_id_created_at` (`guildId`,`memberId`,`createdAt`),
  ADD KEY `memberId` (`memberId`),
  ADD KEY `guildId_invalidatedReason` (`guildId`,`invalidatedReason`) USING BTREE,
  ADD KEY `exactMatchCode_guildId` (`exactMatchCode`,`guildId`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`),
  ADD KEY `joinId` (`joinId`),
  ADD KEY `leaves_guild_id_member_id_join_id` (`guildId`,`memberId`,`joinId`) USING BTREE;

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guildId` (`guildId`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `memberSettings`
--
ALTER TABLE `memberSettings`
  ADD PRIMARY KEY (`memberId`),
  ADD UNIQUE KEY `member_settings_guild_id_member_id` (`guildId`,`memberId`);

--
-- Indexes for table `punishmentConfigs`
--
ALTER TABLE `punishmentConfigs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `punishment_configs_guild_id_punishment_type` (`guildId`,`type`),
  ADD UNIQUE KEY `punishment_configs_guild_id_type` (`guildId`,`type`);

--
-- Indexes for table `punishments`
--
ALTER TABLE `punishments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guildId` (`guildId`),
  ADD KEY `memberId` (`memberId`),
  ADD KEY `creatorId` (`creatorId`);

--
-- Indexes for table `ranks`
--
ALTER TABLE `ranks`
  ADD PRIMARY KEY (`roleId`),
  ADD UNIQUE KEY `ranks_guild_id_role_id` (`guildId`,`roleId`);

--
-- Indexes for table `rolePermissions`
--
ALTER TABLE `rolePermissions`
  ADD PRIMARY KEY (`roleId`,`command`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guildId` (`guildId`);

--
-- Indexes for table `scheduledActions`
--
ALTER TABLE `scheduledActions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guildId` (`guildId`);

--
-- Indexes for table `strikeConfigs`
--
ALTER TABLE `strikeConfigs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `strike_configs_guild_id_violation_type` (`guildId`,`type`),
  ADD UNIQUE KEY `strike_configs_guild_id_type` (`guildId`,`type`);

--
-- Indexes for table `strikes`
--
ALTER TABLE `strikes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `guildId` (`guildId`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`guildId`, `channelId`, `id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `reactionRoles`
--
ALTER TABLE `reactionRoles`
  ADD PRIMARY KEY (`guildId`, `channelId`, `messageId`, `emoji`);


--
-- AUTO_INCREMENT for table `commandUsages`
--
ALTER TABLE `commandUsages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `customInvites`
--
ALTER TABLE `customInvites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `joins`
--
ALTER TABLE `joins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `punishmentConfigs`
--
ALTER TABLE `punishmentConfigs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `punishments`
--
ALTER TABLE `punishments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `scheduledActions`
--
ALTER TABLE `scheduledActions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `strikeConfigs`
--
ALTER TABLE `strikeConfigs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `strikes`
--
ALTER TABLE `strikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
