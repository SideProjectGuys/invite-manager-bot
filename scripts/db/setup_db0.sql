SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `im_0`
--

-- --------------------------------------------------------

--
-- Table structure for table `botSettings`
--

CREATE TABLE `botSettings` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dbStats`
--

CREATE TABLE `dbStats` (
  `key` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` double DEFAULT NULL,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `musicNodes`
--

CREATE TABLE `musicNodes` (
  `id` int(11) NOT NULL,
  `host` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `port` int(11) DEFAULT NULL,
  `region` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRegular` tinyint(1) DEFAULT NULL,
  `isPremium` tinyint(1) DEFAULT NULL,
  `isCustom` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `premiumSubscriptionGuilds`
--

CREATE TABLE `premiumSubscriptionGuilds` (
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guildId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `premiumSubscriptions`
--

CREATE TABLE `premiumSubscriptions` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `amount` decimal(10,2) DEFAULT NULL,
  `maxGuilds` int(11) NOT NULL DEFAULT '5',
  `isFreeTier` tinyint(1) NOT NULL DEFAULT '0',
  `isPatreon` tinyint(1) NOT NULL DEFAULT '0',
  `validUntil` datetime DEFAULT NULL,
  `memberId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `botSettings`
--
ALTER TABLE `botSettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dbStats`
--
ALTER TABLE `dbStats`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `musicNodes`
--
ALTER TABLE `musicNodes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `premiumSubscriptionGuilds`
--
ALTER TABLE `premiumSubscriptionGuilds`
  ADD PRIMARY KEY (`memberId`, `guildId`),
  ADD KEY `guildId` (`guildId`);

--
-- Indexes for table `premiumSubscriptions`
--
ALTER TABLE `premiumSubscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `musicNodes`
--
ALTER TABLE `musicNodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `premiumSubscriptions`
--
ALTER TABLE `premiumSubscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
