# Commands

To get a list of available commands, do !help on your server.

## Arguments & Flags

Most commands accept arguments and/or flags.  
According to the **Type** of the argument or flag you can provide different values.

### Booléen

Cet argument prend la valeur `vrai` ou `faux`. Vous pouvez aussi utiliser `oui` ou `non`.

### Nombre

Veuillez spécifier un nombre

### Énumération

Cet argument attend une valeur d'une liste spécifique de valeurs.

> Selon la commande les valeurs valides peuvent changer. Utilisez `!help <command>` (ex : `!help addRank`) pour avoir plus d'informations sur la commande et les valeurs valides pour cette commande.

### Code d'invitation

Cet argument attend un code d'invitation Discord.

> Vous pouvez donner uniquement le code après `https://discord.gg/` pour annuler l'aperçu créé par Discord.

### Utilisateur

Cet argument attend un utilisateur Discord. Vous pouvez utiliser une de ces méthodes pour donner un utilisateur :

- Mentionner l'utilisateur `@Valandur`
- Utiliser l'ID : `102785693046026240`
- Utiliser le nom : `Valandur`
- Utiliser des guillemets si le nom contient un espace : `"Valandur avec des espaces"`

### Role

Cet argument attend un role Discord. Vous pouvez utiliser une de ces méthodes pour donner un role :

- Mentionner le role `@Admin`
- Utiliser l'ID : `102785693046026240`
- Utiliser le nom : `Admin`
- Utiliser des guillemets si le nom contient un espace : `"Admin avec des espaces"`

### Salon

Cet argument attend un salon Discord. Vous pouvez utiliser une de ces méthodes pour donner un salon :

- Mentionner le salon `#general`
- Utiliser l'ID : `409846838129197057`
- Utiliser le nom : `general`
- Utiliser des guillemets si le nom contient un espace : `"general avec des espaces"`

### Commande

Cet argument attend une commande de ce bot. Vous pouvez utiliser une de ces méthodes pour donner une commande :

- Utiliser le nom de la commande : `invites`
- Utiliser un alias de la commande : `p`

### Texte

Cet argument attend du texte. Vous pouvez utiliser des guillemets (`"Texte avec des guillemets") pour du texte avec des espaces.

> Si le texte est le dernier argument vous n'avez pas besoin d'utiliser des guillemets.

### Date

Cet argument attend une date. Vous pouvez utiliser différents formats, mais nous recommandons : `YYYY-MM-DD`

### Durée

Cet argument attend une durée. Les durées suivantes sont supportées :

- Secondes : `s` (`5s` = 5 secondes)
- Minutes : `min` (`3min` = 3 minutes)
- Heures : `h` (`4h` = 4 heures)
- Jours : `d` (`2d` = 2 jours)
- Semaines : `w` (`1w` = 1 semaine)
- Mois : `mo` (`6mo` = 6 mois)
- Années : `y` (`10y` = 10 ans)

## Overview

### Invites

| Command                           | Description                                                                                | Usage                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| [addInvites](#addInvites)         | Ajoute/supprime des invitations d'un membre.                                               | !addInvites \<user\> \<amount\> [reason]                         |
| [clearInvites](#clearInvites)     | Effacer les invitations du serveur/d'un utilisateur.                                       | !clearInvites [-d value\|--date=value][-cb\|--clearbonus] [user] |
| [createInvite](#createInvite)     | Crée des codes d'invitation uniques.                                                       | !createInvite \<name\> [channel]                                 |
| [info](#info)                     | Afficher des informations sur un membre spécifique.                                        | !info \<user\> [details][page]                                   |
| [inviteCodes](#inviteCodes)       | Obtenez une liste de tous vos codes d'invitation.                                          | !inviteCodes                                                     |
| [inviteDetails](#inviteDetails)   | Affiche des détails sur l'origine de vos invitations.                                      | !inviteDetails [user]                                            |
| [invites](#invites)               | Afficher les invitations personnelles.                                                     | !invites [user]                                                  |
| [leaderboard](#leaderboard)       | Afficher les membres avec le plus d'invitations.                                           | !leaderboard [page]                                              |
| [removeInvites](#removeInvites)   | Enlève un certain nombre d'invitations à un utilisateur.                                   | !removeInvites \<user\> \<amount\> [reason]                      |
| [restoreInvites](#restoreInvites) | Restaurez toutes les invitations précédemment effacées.                                    | !restoreInvites [user]                                           |
| [subtractFakes](#subtractFakes)   | Supprimez les fausses invitations de tous les utilisateurs.                                | !subtractFakes                                                   |
| [subtractLeaves](#subtractLeaves) | Supprimer le nombre des invitations des personne qui ont quitter de tous les utilisateurs. | !subtractLeaves                                                  |

### Ranks

| Command                   | Description                                              | Usage                                |
| ------------------------- | -------------------------------------------------------- | ------------------------------------ |
| [addRank](#addRank)       | Ajouter un nouveau Ranks.                                | !addRank \<role\> \<invites\> [info] |
| [fixRanks](#fixRanks)     | Supprime les rangs configurés si le rôle a été supprimé. | !fixRanks                            |
| [ranks](#ranks)           | Montrer tous les rangs.                                  | !ranks [page]                        |
| [removeRank](#removeRank) | Supprimer un rang.                                       | !removeRank \<rank\>                 |

### Config

| Command                                 | Description                                                            | Usage                                       |
| --------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| [botConfig](#botConfig)                 | Afficher et changer la configuration du bot.                           | !botConfig [key][value]                     |
| [config](#config)                       | Affiche et modifie la configuration du serveur.                        | !config [key][value]                        |
| [interactiveConfig](#interactiveConfig) | Configuration interactive                                              | !interactiveConfig                          |
| [inviteCodeConfig](#inviteCodeConfig)   | Affiche et modifie la configuration des codes d'invitation du serveur. | !inviteCodeConfig [key][invitecode] [value] |
| [memberConfig](#memberConfig)           | Affiche et modifie la configuration des membres du serveur.            | !memberConfig [key][user] [value]           |
| [permissions](#permissions)             | Configurez les permissions pour utiliser des commandes.                | !permissions [cmd][role]                    |

### Info

| Command             | Description                                                                                           | Usage           |
| ------------------- | ----------------------------------------------------------------------------------------------------- | --------------- |
| [botInfo](#botInfo) | Obtenez des informations à propos du bot.                                                             | !botInfo        |
| [credits](#credits) | Afficher les développeurs et les contributeurs du bot.                                                | !credits        |
| [getBot](#getBot)   | Obtenez un lien d'invitation pour le bot.                                                             | !getBot         |
| [help](#help)       | Afficher l'aide.                                                                                      | !help [command] |
| [members](#members) | Afficher le nombre de membres du serveur actuel.                                                      | !members        |
| [ping](#ping)       | Mentionner le bot                                                                                     | !ping           |
| [prefix](#prefix)   | Affiche le préfixe actuel du bot.                                                                     | !prefix         |
| [setup](#setup)     | Aide à la configuration du bot et à la recherche de problèmes (par exemple: autorisations manquantes) | !setup          |
| [support](#support) | Obtenez un lien d'invitation vers notre serveur d'assistance.                                         | !support        |

### Premium

| Command                   | Description                                                                     | Usage             |
| ------------------------- | ------------------------------------------------------------------------------- | ----------------- |
| [export](#export)         | Exportez les données d'InviteManager vers une feuille de calculs CSV.           | !export \<type\>  |
| [premium](#premium)       | Informations sur la version premium d'InviteManager.                            | !premium [action] |
| [tryPremium](#tryPremium) | Essayez gratuitement la version premium d’InviteManager pour une durée limitée. | !tryPremium       |

### Moderation

| Command                               | Description                                                                                                              | Usage                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| [ban](#ban)                           | Bannir un membre du serveur.                                                                                             | !ban [-d value\|--deleteMessageDays=value] \<user\> [reason]     |
| [caseDelete](#caseDelete)             | Supprimer un cas spécifique.                                                                                             | !caseDelete \<caseNumber\> [reason]                              |
| [caseView](#caseView)                 | Voir les informations sur un cas spécifique.                                                                             | !caseView \<caseNumber\>                                         |
| [check](#check)                       | Vérifier la violation et l'historique des punitions d'un utilisateur.                                                    | !check \<user\>                                                  |
| [clean](#clean)                       | Nettoyer un salon de certains messages.                                                                                  | !clean \<type\> [numberOfMessages]                               |
| [cleanShort](#cleanShort)             | Effacer les messages courts.                                                                                             | !cleanShort \<maxTextLength\> [numberOfMessages]                 |
| [cleanText](#cleanText)               | Supprimer les messages contenant certains mots clefs.                                                                    | !cleanText \<text\> [numberOfMessages]                           |
| [kick](#kick)                         | Expulser un membre du serveur.                                                                                           | !kick \<member\> [reason]                                        |
| [lockdown](#lockdown)                 | Bloque un salon spécifique (empêche tout le monde sans rôle spécial d'envoyer des messages)                              | !lockdown [-t value\|--timeout=value][channel]                   |
| [mute](#mute)                         | Rendre muet un utilisateur                                                                                               | !mute [-d value\|--duration=value] \<user\> [reason]             |
| [punishmentConfig](#punishmentConfig) | Configurez les punitions lorsque vous atteignez un certain nombre d'avertissements.                                      | !punishmentConfig [punishment][strikes] [args]                   |
| [purge](#purge)                       | Purger les messages dans un canal.                                                                                       | !purge \<quantity\> [user]                                       |
| [purgeUntil](#purgeUntil)             | Purger les messages dans un salon jusqu'à un message spécifié.                                                           | !purgeUntil \<messageID\>                                        |
| [softBan](#softBan)                   | Bannir puis automatiquement dé-bannir un membre du serveur.                                                              | !softBan [-d value\|--deleteMessageDays=value] \<user\> [reason] |
| [strike](#strike)                     | Ajouter des avertissements à un utilisateur                                                                              | !strike \<member\> \<type\> \<amount\>                           |
| [strikeConfig](#strikeConfig)         | Configurez les Strike reçues pour diverses violations.                                                                   | !strikeConfig [violation][strikes]                               |
| [unban](#unban)                       | Dé-bannir un utilisateur                                                                                                 | !unban \<user\> [reason]                                         |
| [unhoist](#unhoist)                   | Ajoute un caractère spécial devant le nom de chaque membre, donc ils seront affichés en dernier de la liste des membres. | !unhoist                                                         |
| [unmute](#unmute)                     | Démuter un utilisateur                                                                                                   | !unmute \<user\>                                                 |
| [warn](#warn)                         | Avertir un membre.                                                                                                       | !warn \<member\> [reason]                                        |

### Music

| Command                   | Description                                                                                    | Usage                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [disconnect](#disconnect) | Déconnecter le bot du salon actuel.                                                            | !disconnect                                             |
| [lyrics](#lyrics)         | Montrer les paroles de la chanson actuelle.                                                    | !lyrics [-l\|--live]                                    |
| [mashup](#mashup)         | Créer un mashup des 2 chansons.                                                                | !mashup \<videos\>                                      |
| [nowPlaying](#nowPlaying) | Montre les informations à propos de la musique en cours de lecture                             | !nowPlaying [-p\|--pin]                                 |
| [pause](#pause)           | Mettre en pause la chanson actuelle.                                                           | !pause                                                  |
| [play](#play)             | Joue la musique si la file d'attente est vide, et ajoute la musique à la fin de la file sinon. | !play [-p value\|--platform=value][-n\|--next] \<link\> |
| [queue](#queue)           | Affiche les musiques en attente.                                                               | !queue                                                  |
| [repeat](#repeat)         | Répète la musique indéfiniment.                                                                | !repeat                                                 |
| [resume](#resume)         | Reprendre la musique en cours.                                                                 | !resume                                                 |
| [rewind](#rewind)         | Rejoue la musique depuis le début.                                                             | !rewind                                                 |
| [search](#search)         | Recherche le nom et vous laisse choisir un des résultats.                                      | !search [-p value\|--platform=value] \<search\>         |
| [seek](#seek)             | Passer à une partie spécifique de la musique.                                                  | !seek [duration]                                        |
| [skip](#skip)             | Passe la musique jouée et joue la musique suivante dans la file d'attente.                     | !skip [amount]                                          |
| [volume](#volume)         | Défini le volume si une valeur est donnée, ou montre le volume actuel.                         | !volume [volume]                                        |

### Other

| Command         | Description                                                         | Usage                      |
| --------------- | ------------------------------------------------------------------- | -------------------------- |
| [graph](#graph) | Affiche des graphiques sur différentes statistiques sur ce serveur. | !graph \<type\> [from][to] |

<a name='addInvites'></a>

---

## !addInvites

Ajoute/supprime des invitations d'un membre.

### Usage

```text
!addInvites <user> <amount> [reason]
```

### Aliases

- `!add-invites`

### Arguments

| Argument | Type                        | Required | Description                                                                                                                      | Details |
| -------- | --------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- |
| user     | [Utilisateur](#Utilisateur) | Yes      | L'utilisateur recevra / perdra le bonus invite                                                                                   |         |
| amount   | [Nombre](#Nombre)           | Yes      | La quantité d'invitations que l'utilisateur va recevoir / perdre. Utilisez un nombre négatif (-) pour supprimer les invitations. |         |
| reason   | [Texte](#Texte)             | No       | La raison de l'ajout / suppression des invitations.                                                                              |         |

### Examples

```text
!addInvites @User 5
```

```text
!addInvites "Name with space" -30 Removed for cheating
```

<a name='addRank'></a>

---

## !addRank

Ajouter un nouveau Ranks.

### Usage

```text
!addRank <role> <invites> [info]
```

### Aliases

- `!add-rank`
- `!set-rank`
- `!setrank`

### Arguments

| Argument | Type              | Required | Description                                                                   | Details |
| -------- | ----------------- | -------- | ----------------------------------------------------------------------------- | ------- |
| role     | [Role](#Role)     | Yes      | Le rôle que l'utilisateur recevra lorsqu'il atteindra ce rang.                |         |
| invites  | [Nombre](#Nombre) | Yes      | La quantité d'invitations nécessaires pour atteindre le rang.                 |         |
| info     | [Texte](#Texte)   | No       | Une description que les utilisateurs verront pour en savoir plus sur ce rang. |         |

### Examples

```text
!addRank @Role 5
```

```text
!addRank "Role with space" 10 Wow, already 10 people!
```

<a name='ban'></a>

---

## !ban

Bannir un membre du serveur.

### Usage

```text
!ban [-d value|--deleteMessageDays=value] <user> [reason]
```

### Arguments

| Argument | Type                        | Required | Description                              | Details |
| -------- | --------------------------- | -------- | ---------------------------------------- | ------- |
| user     | [Utilisateur](#Utilisateur) | Yes      | Utilisateur à bannir.                    |         |
| reason   | [Texte](#Texte)             | No       | Pourquoi l'utilisateur a-t-il été banni? |         |

### Flags

| Flag                              | Short     | Type              | Description                                                                                |
| --------------------------------- | --------- | ----------------- | ------------------------------------------------------------------------------------------ |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Nombre](#Nombre) | Si spécifié, cela va supprimer les messages du membre banni ce nombre de jours en arrière. |

### Examples

<a name='botConfig'></a>

---

## !botConfig

Afficher et changer la configuration du bot.

### Usage

```text
!botConfig [key] [value]
```

### Aliases

- `!bot-config`
- `!botsetting`
- `!bot-setting`

### Arguments

| Argument | Type                        | Required | Description                                                              | Details                                                                                                                                         |
| -------- | --------------------------- | -------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Énumération](#Énumération) | No       | Les paramètres de configurations que vous souhaitez afficher / modifier. | Utilisez une des valeurs suivantes : `activityEnabled`, `activityMessage`, `activityStatus`, `activityType`, `activityUrl`, `embedDefaultColor` |
| value    | [Valeur](#Valeur)           | No       | La nouvelle valeur du paramètre.                                         |                                                                                                                                                 |

### Examples

```text
!botConfig
```

<a name='botInfo'></a>

---

## !botInfo

Obtenez des informations à propos du bot.

### Usage

```text
!botInfo
```

### Aliases

- `!bot-info`

### Examples

```text
!botInfo
```

<a name='caseDelete'></a>

---

## !caseDelete

Supprimer un cas spécifique.

### Usage

```text
!caseDelete <caseNumber> [reason]
```

### Aliases

- `!case-delete`
- `!deletecase`
- `!delete-case`

### Arguments

| Argument   | Type              | Required | Description                         | Details |
| ---------- | ----------------- | -------- | ----------------------------------- | ------- |
| caseNumber | [Nombre](#Nombre) | Yes      | Numéro du cas                       |         |
| reason     | [Texte](#Texte)   | No       | La raison de la suppression du cas. |         |

### Examples

```text
!caseDelete 5434 User apologized
```

<a name='caseView'></a>

---

## !caseView

Voir les informations sur un cas spécifique.

### Usage

```text
!caseView <caseNumber>
```

### Aliases

- `!case-view`
- `!viewcase`
- `!view-case`

### Arguments

| Argument   | Type              | Required | Description   | Details |
| ---------- | ----------------- | -------- | ------------- | ------- |
| caseNumber | [Nombre](#Nombre) | Yes      | Numéro du cas |         |

### Examples

```text
!caseView 5434
```

<a name='check'></a>

---

## !check

Vérifier la violation et l'historique des punitions d'un utilisateur.

### Usage

```text
!check <user>
```

### Aliases

- `!history`

### Arguments

| Argument | Type                        | Required | Description             | Details |
| -------- | --------------------------- | -------- | ----------------------- | ------- |
| user     | [Utilisateur](#Utilisateur) | Yes      | Utilisateur à vérifier. |         |

### Examples

```text
!check @User
```

```text
!check "User with space"
```

<a name='clean'></a>

---

## !clean

Nettoyer un salon de certains messages.

### Usage

```text
!clean <type> [numberOfMessages]
```

### Aliases

- `!clear`

### Arguments

| Argument         | Type                        | Required | Description                               | Details                                                                                                                |
| ---------------- | --------------------------- | -------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| type             | [Énumération](#Énumération) | Yes      | Le type de messages qui seront supprimés. | Utilisez une des valeurs suivantes : `bots`, `embeds`, `emojis`, `images`, `links`, `mentions`, `reacted`, `reactions` |
| numberOfMessages | [Nombre](#Nombre)           | No       | Nombre de messages qui seront recherchés. |                                                                                                                        |

### Examples

<a name='cleanShort'></a>

---

## !cleanShort

Effacer les messages courts.

### Usage

```text
!cleanShort <maxTextLength> [numberOfMessages]
```

### Aliases

- `!clean-short`
- `!clearshort`
- `!clear-short`

### Arguments

| Argument         | Type              | Required | Description                                            | Details |
| ---------------- | ----------------- | -------- | ------------------------------------------------------ | ------- |
| maxTextLength    | [Nombre](#Nombre) | Yes      | Tous les messages plus courts que ça seront supprimés. |         |
| numberOfMessages | [Nombre](#Nombre) | No       | Nombre de messages qui seront recherchés.              |         |

### Examples

<a name='cleanText'></a>

---

## !cleanText

Supprimer les messages contenant certains mots clefs.

### Usage

```text
!cleanText <text> [numberOfMessages]
```

### Aliases

- `!clean-text`
- `!cleartext`
- `!clear-text`

### Arguments

| Argument         | Type              | Required | Description                                           | Details |
| ---------------- | ----------------- | -------- | ----------------------------------------------------- | ------- |
| text             | [Texte](#Texte)   | Yes      | Tous les messages contenants ce mot seront supprimés. |         |
| numberOfMessages | [Nombre](#Nombre) | No       | Nombre de messages qui seront recherchés.             |         |

### Examples

<a name='clearInvites'></a>

---

## !clearInvites

Effacer les invitations du serveur/d'un utilisateur.

### Usage

```text
!clearInvites [-d value|--date=value] [-cb|--clearBonus] [user]
```

### Aliases

- `!clear-invites`

### Arguments

| Argument | Type                        | Required | Description                                                                                                                       | Details |
| -------- | --------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- | ------- |
| user     | [Utilisateur](#Utilisateur) | No       | L'utilisateur que vous voulez effacer toutes ses invitations. Si pas renseigner, efface les invitations de tous les utilisateurs. |         |

### Flags

| Flag                       | Short      | Type                | Description                                                                                                       |
| -------------------------- | ---------- | ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;date       | &#x2011;d  | [Date](#Date)       | La date à laquelle les invitations doivent être comptées. La valeur par défaut est aujourd'hui.                   |
| &#x2011;&#x2011;clearBonus | &#x2011;cb | [Booléen](#Booléen) | Ajouter ce drapeau pour effacer aussi les invitations bonus. Sinon, les invitations bonus ne seront pas altérées. |

### Examples

```text
!clearInvites
```

```text
!clearInvites @User
```

```text
!clearInvites -cb "User with space"
```

<a name='config'></a>

---

## !config

Affiche et modifie la configuration du serveur.

### Usage

```text
!config [key] [value]
```

### Aliases

- `!c`

### Arguments

| Argument | Type                        | Required | Description                                                           | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------- | --------------------------- | -------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key      | [Énumération](#Énumération) | No       | Le paramètre de configuration que vous souhaitez afficher / modifier. | Utilisez une des valeurs suivantes : `announcementVoice`, `announceNextSong`, `autoModAllCapsEnabled`, `autoModAllCapsMinCharacters`, `autoModAllCapsPercentageCaps`, `autoModDeleteBotMessage`, `autoModDeleteBotMessageTimeoutInSeconds`, `autoModDisabledForOldMembers`, `autoModDisabledForOldMembersThreshold`, `autoModDuplicateTextEnabled`, `autoModDuplicateTextTimeframeInSeconds`, `autoModEmojisEnabled`, `autoModEmojisMaxNumberOfEmojis`, `autoModEnabled`, `autoModHoistEnabled`, `autoModIgnoredChannels`, `autoModIgnoredRoles`, `autoModInvitesEnabled`, `autoModLinksBlacklist`, `autoModLinksEnabled`, `autoModLinksFollowRedirects`, `autoModLinksWhitelist`, `autoModLogEnabled`, `autoModMentionRolesEnabled`, `autoModMentionRolesMaxNumberOfMentions`, `autoModMentionUsersEnabled`, `autoModMentionUsersMaxNumberOfMentions`, `autoModModeratedChannels`, `autoModModeratedRoles`, `autoModQuickMessagesEnabled`, `autoModQuickMessagesNumberOfMessages`, `autoModQuickMessagesTimeframeInSeconds`, `autoModWordsBlacklist`, `autoModWordsEnabled`, `autoSubtractFakes`, `autoSubtractLeaves`, `autoSubtractLeaveThreshold`, `captchaVerificationFailedMessage`, `captchaVerificationLogEnabled`, `captchaVerificationOnJoin`, `captchaVerificationSuccessMessage`, `captchaVerificationTimeout`, `captchaVerificationWelcomeMessage`, `channels`, `defaultMusicPlatform`, `disabledMusicPlatforms`, `fadeMusicEndDelay`, `fadeMusicOnTalk`, `getUpdates`, `hideLeftMembersFromLeaderboard`, `ignoredChannels`, `joinMessage`, `joinMessageChannel`, `joinRoles`, `lang`, `leaderboardStyle`, `leaveMessage`, `leaveMessageChannel`, `logChannel`, `modLogChannel`, `modPunishmentBanDeleteMessage`, `modPunishmentKickDeleteMessage`, `modPunishmentMuteDeleteMessage`, `modPunishmentSoftbanDeleteMessage`, `modPunishmentWarnDeleteMessage`, `musicVolume`, `mutedRole`, `prefix`, `rankAnnouncementChannel`, `rankAnnouncementMessage`, `rankAssignmentStyle` |
| value    | [Valeur](#Valeur)           | No       | La nouvelle valeur du paramétrage.                                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### Examples

```text
!config
```

<a name='createInvite'></a>

---

## !createInvite

Crée des codes d'invitation uniques.

### Usage

```text
!createInvite <name> [channel]
```

### Aliases

- `!create-invite`

### Arguments

| Argument | Type            | Required | Description                                                                    | Details |
| -------- | --------------- | -------- | ------------------------------------------------------------------------------ | ------- |
| name     | [Texte](#Texte) | Yes      | Le nom du code d'invitation.                                                   |         |
| channel  | [Salon](#Salon) | No       | Le Salon ou le code d'invitation est créé. Utilise le canal actuel par défaut. |         |

### Examples

```text
!createInvite reddit
```

```text
!createInvite website #welcome
```

<a name='credits'></a>

---

## !credits

Afficher les développeurs et les contributeurs du bot.

### Usage

```text
!credits
```

### Examples

```text
!credits
```

<a name='disconnect'></a>

---

## !disconnect

Déconnecter le bot du salon actuel.

### Usage

```text
!disconnect
```

### Examples

```text
!disconnect
```

<a name='export'></a>

---

## !export

Exportez les données d'InviteManager vers une feuille de calculs CSV.

### Usage

```text
!export <type>
```

### Arguments

| Argument | Type                        | Required | Description                            | Details                                            |
| -------- | --------------------------- | -------- | -------------------------------------- | -------------------------------------------------- |
| type     | [Énumération](#Énumération) | Yes      | Le type d'exportation que vous voulez. | Utilisez une des valeurs suivantes : `leaderboard` |

### Examples

```text
!export leaderboard
```

<a name='fixRanks'></a>

---

## !fixRanks

Supprime les rangs configurés si le rôle a été supprimé.

### Usage

```text
!fixRanks
```

### Aliases

- `!fix-ranks`

### Examples

```text
!fixRanks
```

<a name='getBot'></a>

---

## !getBot

Obtenez un lien d'invitation pour le bot.

### Usage

```text
!getBot
```

### Aliases

- `!get-bot`
- `!invite-bot`
- `!invitebot`

### Examples

```text
!getBot
```

<a name='graph'></a>

---

## !graph

Affiche des graphiques sur différentes statistiques sur ce serveur.

### Usage

```text
!graph <type> [from] [to]
```

### Aliases

- `!g`
- `!chart`

### Arguments

| Argument | Type                        | Required | Description                      | Details                                                                  |
| -------- | --------------------------- | -------- | -------------------------------- | ------------------------------------------------------------------------ |
| type     | [Énumération](#Énumération) | Yes      | Le type de graphique à afficher. | Utilisez une des valeurs suivantes : `joins`, `joinsAndLeaves`, `leaves` |
| from     | [Date](#Date)               | No       | Date de début du graphique       |                                                                          |
| to       | [Date](#Date)               | No       | Date de fin du graphique         |                                                                          |

### Examples

```text
!graph joins
```

```text
!graph leaves
```

```text
!graph usage
```

<a name='help'></a>

---

## !help

Afficher l'aide.

### Usage

```text
!help [command]
```

### Arguments

| Argument | Type                  | Required | Description                                                | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------- | --------------------- | -------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command  | [Commande](#Commande) | No       | La commande pour obtenir des informations détaillées pour. | Utilisez une des valeurs suivantes : `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |

### Examples

```text
!help
```

```text
!help addRank
```

<a name='info'></a>

---

## !info

Afficher des informations sur un membre spécifique.

### Usage

```text
!info <user> [details] [page]
```

### Aliases

- `!showinfo`

### Arguments

| Argument | Type                        | Required | Description                                                                               | Details                                                 |
| -------- | --------------------------- | -------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| user     | [Utilisateur](#Utilisateur) | Yes      | L'utilisateur pour lequel vous souhaitez voir des informations supplémentaires.           |                                                         |
| details  | [Énumération](#Énumération) | No       | Voir uniquement des détails spécifiques d'un membre.                                      | Utilisez une des valeurs suivantes : `bonus`, `members` |
| page     | [Nombre](#Nombre)           | No       | Quelle page des détails afficher. Vous pouvez aussi utiliser les réactions pour naviguer. |                                                         |

### Examples

```text
!info @User
```

```text
!info "User with space"
```

```text
!info @User members
```

```text
!info @User bonus
```

```text
!info @User members 4
```

<a name='interactiveConfig'></a>

---

## !interactiveConfig

Configuration interactive

### Usage

```text
!interactiveConfig
```

### Aliases

- `!ic`

### Examples

```text
!interactiveConfig
```

<a name='inviteCodeConfig'></a>

---

## !inviteCodeConfig

Affiche et modifie la configuration des codes d'invitation du serveur.

### Usage

```text
!inviteCodeConfig [key] [inviteCode] [value]
```

### Aliases

- `!invite-code-config`
- `!icc`

### Arguments

| Argument   | Type                                   | Required | Description                                                              | Details                                              |
| ---------- | -------------------------------------- | -------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| key        | [Énumération](#Énumération)            | No       | Les paramètres de configurations que vous souhaitez afficher / modifier. | Utilisez une des valeurs suivantes : `name`, `roles` |
| inviteCode | [Code d'invitation](#Coded'invitation) | No       | The invite code for which you want to change the settings.               |                                                      |
| value      | [Valeur](#Valeur)                      | No       | La nouvelle valeur du paramètre.                                         |                                                      |

### Examples

```text
!inviteCodeConfig
```

<a name='inviteCodes'></a>

---

## !inviteCodes

Obtenez une liste de tous vos codes d'invitation.

### Usage

```text
!inviteCodes
```

### Aliases

- `!invitecode`
- `!invite-code`
- `!invite-codes`
- `!getinvitecode`
- `!get-invite-code`
- `!get-invite-codes`
- `!showinvitecode`
- `!show-invite-code`

### Examples

```text
!inviteCodes
```

<a name='inviteDetails'></a>

---

## !inviteDetails

Affiche des détails sur l'origine de vos invitations.

### Usage

```text
!inviteDetails [user]
```

### Aliases

- `!invite-details`

### Arguments

| Argument | Type                        | Required | Description                                                          | Details |
| -------- | --------------------------- | -------- | -------------------------------------------------------------------- | ------- |
| user     | [Utilisateur](#Utilisateur) | No       | L'utilisateur ou vous souhaitez afficher des invitations détaillées. |         |

### Examples

```text
!inviteDetails
```

```text
!inviteDetails @User
```

```text
!inviteDetails "User with space"
```

<a name='invites'></a>

---

## !invites

Afficher les invitations personnelles.

### Usage

```text
!invites [user]
```

### Aliases

- `!invite`
- `!rank`

### Arguments

| Argument | Type                        | Required | Description                                               | Details |
| -------- | --------------------------- | -------- | --------------------------------------------------------- | ------- |
| user     | [Utilisateur](#Utilisateur) | No       | L'utilisateur ou vous souhaitez afficher les invitations. |         |

### Examples

```text
!invites
```

```text
!invites @User
```

```text
!invites "User with space"
```

<a name='kick'></a>

---

## !kick

Expulser un membre du serveur.

### Usage

```text
!kick <member> [reason]
```

### Arguments

| Argument | Type              | Required | Description                       | Details |
| -------- | ----------------- | -------- | --------------------------------- | ------- |
| member   | [Membre](#Membre) | Yes      | Membre à expulser.                |         |
| reason   | [Texte](#Texte)   | No       | Pourquoi le membre a été expulsé. |         |

### Examples

<a name='leaderboard'></a>

---

## !leaderboard

Afficher les membres avec le plus d'invitations.

### Usage

```text
!leaderboard [page]
```

### Aliases

- `!top`

### Arguments

| Argument | Type              | Required | Description                                 | Details |
| -------- | ----------------- | -------- | ------------------------------------------- | ------- |
| page     | [Nombre](#Nombre) | No       | Quelle page du classement voulez vous voir. |         |

### Examples

```text
!leaderboard
```

```text
!leaderboard 1mo
```

```text
!leaderboard 30d 6
```

<a name='lockdown'></a>

---

## !lockdown

Bloque un salon spécifique (empêche tout le monde sans rôle spécial d'envoyer des messages)

### Usage

```text
!lockdown [-t value|--timeout=value] [channel]
```

### Arguments

| Argument | Type            | Required | Description                       | Details |
| -------- | --------------- | -------- | --------------------------------- | ------- |
| channel  | [Salon](#Salon) | No       | Le salon que vous voulez bloquer. |         |

### Flags

| Flag                    | Short     | Type            | Description                                                                                                                                |
| ----------------------- | --------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| &#x2011;&#x2011;timeout | &#x2011;t | [Durée](#Durée) | La durée après laquelle le blocage se finit automatiquement. Utilisez la commande une nouvelle fois pour terminer le blocage manuellement. |

### Examples

```text
!lockdown
```

<a name='lyrics'></a>

---

## !lyrics

Montrer les paroles de la chanson actuelle.

### Usage

```text
!lyrics [-l|--live]
```

### Flags

| Flag                 | Short     | Type                | Description                                                                |
| -------------------- | --------- | ------------------- | -------------------------------------------------------------------------- |
| &#x2011;&#x2011;live | &#x2011;l | [Booléen](#Booléen) | Si défini, les paroles seront synchronisées au temps actuel de la musique. |

### Examples

```text
!lyrics
```

<a name='mashup'></a>

---

## !mashup

Créer un mashup des 2 chansons.

### Usage

```text
!mashup <videos>
```

### Arguments

| Argument | Type            | Required | Description                                     | Details |
| -------- | --------------- | -------- | ----------------------------------------------- | ------- |
| videos   | [Texte](#Texte) | Yes      | Les vidéos qui doivent être mélangées ensemble. |         |

### Examples

<a name='memberConfig'></a>

---

## !memberConfig

Affiche et modifie la configuration des membres du serveur.

### Usage

```text
!memberConfig [key] [user] [value]
```

### Aliases

- `!member-config`
- `!memconf`
- `!mc`

### Arguments

| Argument | Type                        | Required | Description                                                 | Details                                                    |
| -------- | --------------------------- | -------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| key      | [Énumération](#Énumération) | No       | La configuration de membre que vous souhaitez voir/changer. | Utilisez une des valeurs suivantes : `hideFromLeaderboard` |
| user     | [Utilisateur](#Utilisateur) | No       | Le membre ou le paramètre est affiché / modifié.            |                                                            |
| value    | [Valeur](#Valeur)           | No       | La nouvelle valeur du paramètre.                            |                                                            |

### Examples

```text
!memberConfig
```

<a name='members'></a>

---

## !members

Afficher le nombre de membres du serveur actuel.

### Usage

```text
!members
```

### Aliases

- `!member`
- `!memberscount`

### Examples

```text
!members
```

<a name='mute'></a>

---

## !mute

Rendre muet un utilisateur

### Usage

```text
!mute [-d value|--duration=value] <user> [reason]
```

### Arguments

| Argument | Type              | Required | Description                                   | Details |
| -------- | ----------------- | -------- | --------------------------------------------- | ------- |
| user     | [Membre](#Membre) | Yes      | L'utilisateur qui doit être rendu muet.       |         |
| reason   | [Texte](#Texte)   | No       | La raison de pourquoi l'utilisateur est muet. |         |

### Flags

| Flag                     | Short     | Type            | Description                                    |
| ------------------------ | --------- | --------------- | ---------------------------------------------- |
| &#x2011;&#x2011;duration | &#x2011;d | [Durée](#Durée) | Le temps pendant lequel l'utilisateur est muet |

### Examples

<a name='nowPlaying'></a>

---

## !nowPlaying

Montre les informations à propos de la musique en cours de lecture

### Usage

```text
!nowPlaying [-p|--pin]
```

### Aliases

- `!np`
- `!now-playing`

### Flags

| Flag                | Short     | Type                | Description                                                                                                 |
| ------------------- | --------- | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;pin | &#x2011;p | [Booléen](#Booléen) | Épingle le message "Now playing" et le mets à jour automatiquement à chaque fois qu'une musique est lancée. |

### Examples

```text
!nowPlaying
```

<a name='pause'></a>

---

## !pause

Mettre en pause la chanson actuelle.

### Usage

```text
!pause
```

### Aliases

- `!stop`

### Examples

```text
!pause
```

<a name='permissions'></a>

---

## !permissions

Configurez les permissions pour utiliser des commandes.

### Usage

```text
!permissions [cmd] [role]
```

### Aliases

- `!perms`

### Arguments

| Argument | Type                  | Required | Description                                         | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------- | --------------------- | -------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cmd      | [Commande](#Commande) | No       | La commande pour configurer les autorisations pour. | Utilisez une des valeurs suivantes : `addInvites`, `addRank`, `ban`, `botConfig`, `botInfo`, `caseDelete`, `caseView`, `check`, `clean`, `cleanShort`, `cleanText`, `clearInvites`, `config`, `createInvite`, `credits`, `disconnect`, `export`, `fixRanks`, `getBot`, `graph`, `help`, `info`, `interactiveConfig`, `inviteCodeConfig`, `inviteCodes`, `inviteDetails`, `invites`, `kick`, `leaderboard`, `lockdown`, `lyrics`, `mashup`, `memberConfig`, `members`, `mute`, `nowPlaying`, `pause`, `permissions`, `ping`, `play`, `prefix`, `premium`, `punishmentConfig`, `purge`, `purgeUntil`, `queue`, `ranks`, `removeInvites`, `removeRank`, `repeat`, `restoreInvites`, `resume`, `rewind`, `search`, `seek`, `setup`, `skip`, `softBan`, `strike`, `strikeConfig`, `subtractFakes`, `subtractLeaves`, `support`, `tryPremium`, `unban`, `unhoist`, `unmute`, `volume`, `warn` |
| role     | [Role](#Role)         | No       | Le rôle qui aura l'accès ou non à la commande.      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Examples

```text
!permissions
```

<a name='ping'></a>

---

## !ping

Mentionner le bot

### Usage

```text
!ping
```

### Examples

```text
!ping
```

<a name='play'></a>

---

## !play

Joue la musique si la file d'attente est vide, et ajoute la musique à la fin de la file sinon.

### Usage

```text
!play [-p value|--platform=value] [-n|--next] <link>
```

### Aliases

- `!p`

### Arguments

| Argument | Type            | Required | Description                                | Details |
| -------- | --------------- | -------- | ------------------------------------------ | ------- |
| link     | [Texte](#Texte) | Yes      | Le lien vers une musique ou une recherche. |         |

### Flags

| Flag                     | Short     | Type                        | Description                                                                                 |
| ------------------------ | --------- | --------------------------- | ------------------------------------------------------------------------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Énumération](#Énumération) | Sélectionnez le salon où vous voulez que la musique soit jouée.                             |
| &#x2011;&#x2011;next     | &#x2011;n | [Booléen](#Booléen)         | Si défini, cette musique sera jouée directement au lieu d'être ajoutée à la fin de la file. |

### Examples

<a name='prefix'></a>

---

## !prefix

Affiche le préfixe actuel du bot.

### Usage

```text
!prefix
```

### Examples

```text
!prefix
```

<a name='premium'></a>

---

## !premium

Informations sur la version premium d'InviteManager.

### Usage

```text
!premium [action]
```

### Aliases

- `!patreon`
- `!donate`

### Arguments

| Argument | Type                        | Required | Description                                                                                                                                         | Details                                                                |
| -------- | --------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| action   | [Énumération](#Énumération) | No       | L'action à faire. Aucune pour les infos premium. `check` pour vérifier votre statut premium. `activate` pour utiliser votre premium sur ce serveur. | Utilisez une des valeurs suivantes : `Activate`, `Check`, `Deactivate` |

### Examples

```text
!premium
```

```text
!premium check
```

```text
!premium activate
```

```text
!premium deactivate
```

<a name='punishmentConfig'></a>

---

## !punishmentConfig

Configurez les punitions lorsque vous atteignez un certain nombre d'avertissements.

### Usage

```text
!punishmentConfig [punishment] [strikes] [args]
```

### Aliases

- `!punishment-config`

### Arguments

| Argument   | Type                        | Required | Description                                                  | Details                                                                       |
| ---------- | --------------------------- | -------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| punishment | [Énumération](#Énumération) | No       | Type de punitions à utiliser.                                | Utilisez une des valeurs suivantes : `ban`, `kick`, `mute`, `softban`, `warn` |
| strikes    | [Nombre](#Nombre)           | No       | Nombre d'avertissements pour que cette peine soit appliquée. |                                                                               |
| args       | [Texte](#Texte)             | No       | Arguments passés pour la sanction.                           |                                                                               |

### Examples

```text
!punishmentConfig
```

<a name='purge'></a>

---

## !purge

Purger les messages dans un canal.

### Usage

```text
!purge <quantity> [user]
```

### Aliases

- `!prune`

### Arguments

| Argument | Type                        | Required | Description                                     | Details |
| -------- | --------------------------- | -------- | ----------------------------------------------- | ------- |
| quantity | [Nombre](#Nombre)           | Yes      | Combien de messages doivent être supprimés?     |         |
| user     | [Utilisateur](#Utilisateur) | No       | L'utilisateur dont les messages sont supprimés. |         |

### Examples

<a name='purgeUntil'></a>

---

## !purgeUntil

Purger les messages dans un salon jusqu'à un message spécifié.

### Usage

```text
!purgeUntil <messageID>
```

### Aliases

- `!purge-until`
- `!prune-until`
- `!pruneu`
- `!purgeu`

### Arguments

| Argument  | Type            | Required | Description                        | Details |
| --------- | --------------- | -------- | ---------------------------------- | ------- |
| messageID | [Texte](#Texte) | Yes      | Dernier ID de message à supprimer. |         |

### Examples

<a name='queue'></a>

---

## !queue

Affiche les musiques en attente.

### Usage

```text
!queue
```

### Examples

```text
!queue
```

<a name='ranks'></a>

---

## !ranks

Montrer tous les rangs.

### Usage

```text
!ranks [page]
```

### Aliases

- `!show-ranks`
- `!showranks`

### Arguments

| Argument | Type              | Required | Description                              | Details |
| -------- | ----------------- | -------- | ---------------------------------------- | ------- |
| page     | [Nombre](#Nombre) | No       | La page de la liste des rangs à montrer. |         |

### Examples

```text
!ranks
```

<a name='removeInvites'></a>

---

## !removeInvites

Enlève un certain nombre d'invitations à un utilisateur.

### Usage

```text
!removeInvites <user> <amount> [reason]
```

### Aliases

- `!remove-invites`

### Arguments

| Argument | Type                        | Required | Description                                  | Details |
| -------- | --------------------------- | -------- | -------------------------------------------- | ------- |
| user     | [Utilisateur](#Utilisateur) | Yes      | L'utilisateur à qui enlever des invitations. |         |
| amount   | [Nombre](#Nombre)           | Yes      | Le nombre d'invitations à enlever.           |         |
| reason   | [Texte](#Texte)             | No       | La raison de l'enlèvement d'invitations.     |         |

### Examples

```text
!removeInvites @User 5
```

```text
!removeInvites "User with space" 23 Removed for cheating
```

```text
!removeInvites @User -6 Added for apologizing
```

<a name='removeRank'></a>

---

## !removeRank

Supprimer un rang.

### Usage

```text
!removeRank <rank>
```

### Aliases

- `!remove-rank`

### Arguments

| Argument | Type          | Required | Description                              | Details |
| -------- | ------------- | -------- | ---------------------------------------- | ------- |
| rank     | [Role](#Role) | Yes      | Celui que vous voulez supprimer le rang. |         |

### Examples

```text
!removeRank @Role
```

```text
!removeRank "Role with space"
```

<a name='repeat'></a>

---

## !repeat

Répète la musique indéfiniment.

### Usage

```text
!repeat
```

### Aliases

- `!loop`

### Examples

```text
!repeat
```

<a name='restoreInvites'></a>

---

## !restoreInvites

Restaurez toutes les invitations précédemment effacées.

### Usage

```text
!restoreInvites [user]
```

### Aliases

- `!restore-invites`
- `!unclear-invites`
- `!unclearinvites`

### Arguments

| Argument | Type                        | Required | Description                                                                                                                                  | Details |
| -------- | --------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| user     | [Utilisateur](#Utilisateur) | No       | L'utilisateur à qui restaurer les invitations. Si aucun utilisateur n'est indiqué, cela restaure les invitations pour tous les utilisateurs. |         |

### Examples

```text
!restoreInvites
```

```text
!restoreInvites @User
```

```text
!restoreInvites "User with space"
```

<a name='resume'></a>

---

## !resume

Reprendre la musique en cours.

### Usage

```text
!resume
```

### Aliases

- `!start`

### Examples

```text
!resume
```

<a name='rewind'></a>

---

## !rewind

Rejoue la musique depuis le début.

### Usage

```text
!rewind
```

### Aliases

- `!replay`

### Examples

```text
!rewind
```

<a name='search'></a>

---

## !search

Recherche le nom et vous laisse choisir un des résultats.

### Usage

```text
!search [-p value|--platform=value] <search>
```

### Arguments

| Argument | Type            | Required | Description  | Details |
| -------- | --------------- | -------- | ------------ | ------- |
| search   | [Texte](#Texte) | Yes      | La recherche |         |

### Flags

| Flag                     | Short     | Type                        | Description                                                     |
| ------------------------ | --------- | --------------------------- | --------------------------------------------------------------- |
| &#x2011;&#x2011;platform | &#x2011;p | [Énumération](#Énumération) | Sélectionnez le salon où vous voulez que la musique soit jouée. |

### Examples

<a name='seek'></a>

---

## !seek

Passer à une partie spécifique de la musique.

### Usage

```text
!seek [duration]
```

### Arguments

| Argument | Type              | Required | Description                                                       | Details |
| -------- | ----------------- | -------- | ----------------------------------------------------------------- | ------- |
| duration | [Nombre](#Nombre) | No       | La musique sera jouée à ce moment (depuis le début, en secondes). |         |

### Examples

```text
!seek
```

<a name='setup'></a>

---

## !setup

Aide à la configuration du bot et à la recherche de problèmes (par exemple: autorisations manquantes)

### Usage

```text
!setup
```

### Aliases

- `!guide`
- `!test`
- `!testbot`
- `!test-bot`

### Examples

```text
!setup
```

<a name='skip'></a>

---

## !skip

Passe la musique jouée et joue la musique suivante dans la file d'attente.

### Usage

```text
!skip [amount]
```

### Aliases

- `!next`

### Arguments

| Argument | Type              | Required | Description                          | Details |
| -------- | ----------------- | -------- | ------------------------------------ | ------- |
| amount   | [Nombre](#Nombre) | No       | Combien de musiques seront ignorées. |         |

### Examples

```text
!skip
```

<a name='softBan'></a>

---

## !softBan

Bannir puis automatiquement dé-bannir un membre du serveur.

### Usage

```text
!softBan [-d value|--deleteMessageDays=value] <user> [reason]
```

### Aliases

- `!soft-ban`

### Arguments

| Argument | Type              | Required | Description                              | Details |
| -------- | ----------------- | -------- | ---------------------------------------- | ------- |
| user     | [Membre](#Membre) | Yes      | Utilisateur à bannir.                    |         |
| reason   | [Texte](#Texte)   | No       | Pourquoi l'utilisateur a-t-il été banni? |         |

### Flags

| Flag                              | Short     | Type              | Description                                                               |
| --------------------------------- | --------- | ----------------- | ------------------------------------------------------------------------- |
| &#x2011;&#x2011;deleteMessageDays | &#x2011;d | [Nombre](#Nombre) | Supprime les messages d'un utilisateur depuis un certain nombre de jours. |

### Examples

<a name='strike'></a>

---

## !strike

Ajouter des avertissements à un utilisateur

### Usage

```text
!strike <member> <type> <amount>
```

### Arguments

| Argument | Type                        | Required | Description                           | Details                                                                                                                                                          |
| -------- | --------------------------- | -------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| member   | [Membre](#Membre)           | Yes      | Le membre recevant les avertissements |                                                                                                                                                                  |
| type     | [Énumération](#Énumération) | Yes      | Le type d'infraction                  | Utilisez une des valeurs suivantes : `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| amount   | [Nombre](#Nombre)           | Yes      | Le nombre d'avertissements à ajouter  |                                                                                                                                                                  |

### Examples

<a name='strikeConfig'></a>

---

## !strikeConfig

Configurez les Strike reçues pour diverses violations.

### Usage

```text
!strikeConfig [violation] [strikes]
```

### Aliases

- `!strike-config`

### Arguments

| Argument  | Type                        | Required | Description        | Details                                                                                                                                                          |
| --------- | --------------------------- | -------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| violation | [Énumération](#Énumération) | No       | Type de violation  | Utilisez une des valeurs suivantes : `allCaps`, `duplicateText`, `emojis`, `hoist`, `invites`, `links`, `mentionRoles`, `mentionUsers`, `quickMessages`, `words` |
| strikes   | [Nombre](#Nombre)           | No       | Nombre de Strikes. |                                                                                                                                                                  |

### Examples

```text
!strikeConfig
```

<a name='subtractFakes'></a>

---

## !subtractFakes

Supprimez les fausses invitations de tous les utilisateurs.

### Usage

```text
!subtractFakes
```

### Aliases

- `!subtract-fakes`
- `!subfakes`
- `!sf`

### Examples

```text
!subtractFakes
```

<a name='subtractLeaves'></a>

---

## !subtractLeaves

Supprimer le nombre des invitations des personne qui ont quitter de tous les utilisateurs.

### Usage

```text
!subtractLeaves
```

### Aliases

- `!subtract-leaves`
- `!subleaves`
- `!sl`

### Examples

```text
!subtractLeaves
```

<a name='support'></a>

---

## !support

Obtenez un lien d'invitation vers notre serveur d'assistance.

### Usage

```text
!support
```

### Examples

```text
!support
```

<a name='tryPremium'></a>

---

## !tryPremium

Essayez gratuitement la version premium d’InviteManager pour une durée limitée.

### Usage

```text
!tryPremium
```

### Aliases

- `!try`
- `!try-premium`

### Examples

```text
!tryPremium
```

<a name='unban'></a>

---

## !unban

Dé-bannir un utilisateur

### Usage

```text
!unban <user> [reason]
```

### Arguments

| Argument | Type                        | Required | Description                                       | Details |
| -------- | --------------------------- | -------- | ------------------------------------------------- | ------- |
| user     | [Utilisateur](#Utilisateur) | Yes      | The user that should be unbanned.                 |         |
| reason   | [Texte](#Texte)             | No       | La raison de pourquoi l'utilisateur est dé-banni. |         |

### Examples

<a name='unhoist'></a>

---

## !unhoist

Ajoute un caractère spécial devant le nom de chaque membre, donc ils seront affichés en dernier de la liste des membres.

### Usage

```text
!unhoist
```

### Aliases

- `!dehoist`

### Examples

```text
!unhoist
```

<a name='unmute'></a>

---

## !unmute

Démuter un utilisateur

### Usage

```text
!unmute <user>
```

### Arguments

| Argument | Type              | Required | Description                                 | Details |
| -------- | ----------------- | -------- | ------------------------------------------- | ------- |
| user     | [Membre](#Membre) | Yes      | L'utilisateur qui doit reprendre la parole. |         |

### Examples

<a name='volume'></a>

---

## !volume

Défini le volume si une valeur est donnée, ou montre le volume actuel.

### Usage

```text
!volume [volume]
```

### Arguments

| Argument | Type              | Required | Description                                   | Details |
| -------- | ----------------- | -------- | --------------------------------------------- | ------- |
| volume   | [Nombre](#Nombre) | No       | La valeur sur laquelle le volume sera défini. |         |

### Examples

```text
!volume
```

<a name='warn'></a>

---

## !warn

Avertir un membre.

### Usage

```text
!warn <member> [reason]
```

### Arguments

| Argument | Type              | Required | Description                      | Details |
| -------- | ----------------- | -------- | -------------------------------- | ------- |
| member   | [Membre](#Membre) | Yes      | Membre à avertir.                |         |
| reason   | [Texte](#Texte)   | No       | Pourquoi le membre a été averti. |         |

### Examples
