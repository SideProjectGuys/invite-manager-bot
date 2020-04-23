# Configs

There are many config options that can be set. You don't have to set all of them. If you just added the bot, just run `!setup`, which will guide you through the most important ones.

## Overview

### settings.groups.custom_bot.title

| Setting                                                | Description                            |
| ------------------------------------------------------ | -------------------------------------- |
| [settings.activityEnabled.title](#activityenabled)     | settings.activityEnabled.description   |
| [settings.activityMessage.title](#activitymessage)     | settings.activityMessage.description   |
| [settings.activityStatus.title](#activitystatus)       | settings.activityStatus.description    |
| [settings.activityType.title](#activitytype)           | settings.activityType.description      |
| [settings.activityUrl.title](#activityurl)             | settings.activityUrl.description       |
| [settings.embedDefaultColor.title](#embeddefaultcolor) | settings.embedDefaultColor.description |

### Paramètres de base

| Setting                            | Description                                               |
| ---------------------------------- | --------------------------------------------------------- |
| [Channel des commandes](#channels) | Le channel dans lequel le bot réagira aux commandes.      |
| [Langage](#lang)                   | La langue du bot                                          |
| [Préfixe](#prefix)                 | Le préfixe utilisé pour les commandes du bot.             |
| [Salon des logs](#logchannel)      | Le salon dans lequel les actions du bot sont notées.      |
| [Salons ignorés](#ignoredchannels) | Les salons dans lesquelles le bot ignorera les commandes. |

### Invitations

| Setting                                                    | Description                              |
| ---------------------------------------------------------- | ---------------------------------------- |
| [settings.hideFromLeaderboard.title](#hidefromleaderboard) | settings.hideFromLeaderboard.description |
| [settings.name.title](#name)                               | settings.name.description                |
| [settings.roles.title](#roles)                             | settings.roles.description               |

#### Faux

| Setting                                        | Description                                     |
| ---------------------------------------------- | ----------------------------------------------- |
| [Soustraction automatique](#autosubtractfakes) | Enlève automatiquement les fausses invitations. |

#### Général

| Setting                        | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| [Rôles d'arrivées](#joinroles) | Rôles assignés à tous les utilisateurs quand ils rejoignent. |

#### Arrivées

| Setting                                | Description                                              |
| -------------------------------------- | -------------------------------------------------------- |
| [Message d'arrivée](#joinmessage)      | Le message envoyé quand quelqu'un rejoint le serveur.    |
| [Salon d'arrivée](#joinmessagechannel) | Le salon dans lequel le message de bienvenue est envoyé. |

#### Classement

| Setting                                                      | Description                                                      |
| ------------------------------------------------------------ | ---------------------------------------------------------------- |
| [Cacher les membres partis](#hideleftmembersfromleaderboard) | Cache les utilisateurs qui ont quitté le serveur du leaderboard. |
| [Style](#leaderboardstyle)                                   | Le style d'affichage du leaderboard.                             |

#### Départs

| Setting                                                          | Description                                                                             |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Message de départ](#leavemessage)                               | Le message envoyé quand quelqu'un quitte le serveur.                                    |
| [Salon de départ](#leavemessagechannel)                          | Le salon dans lequel est envoyé le message lorsque quelqu'un quitte le serveur.         |
| [Seuil de soustraction automatique](#autosubtractleavethreshold) | Le temps en secondes que doivent rester les utilisateurs pour que l'invitation compte.  |
| [Soustraction automatique](#autosubtractleaves)                  | Enlève automatiquement les invitations de l'invitant quand l'utilisateur invité quitte. |

#### Rangs

| Setting                                        | Description                                                   |
| ---------------------------------------------- | ------------------------------------------------------------- |
| [Message d'annonce ](#rankannouncementmessage) | Le message envoyé quand l'utilisateur reçois un nouveau rang. |
| [Salon d'annonce](#rankannouncementchannel)    | Le salon où le nouveau niveau d'utilisateurs est annoncé.     |
| [Style d'assignement](#rankassignmentstyle)    | Comment les rangs sont donnés aux utilisateurs.               |

### Modération

#### Mots bannis

| Setting                               | Description                                               |
| ------------------------------------- | --------------------------------------------------------- |
| [Activé](#automodwordsenabled)        | Que les mots de la liste noire soient ou non automatisés. |
| [Liste noire](#automodwordsblacklist) | Une liste de mots bannis.                                 |

#### Majuscules

| Setting                                            | Description                                                                                                                  |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Activé](#automodallcapsenabled)                   | Modère automatiquement les messages avec BEAUCOUP DE MAJUSCULES.                                                             |
| [Caractères minimum](#automodallcapsmincharacters) | La quantité minimale de caractères dans un message à prendre en compte pour la modération (définir sur '3' ignorerait 'OK'). |
| [Percentage Caps](#automodallcapspercentagecaps)   | Le pourcentage de caractères en majuscules dans le message pour que celui-ci soit modéré.                                    |

#### Captcha

| Setting                                                    | Description                                                                                                       |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [Activé](#captchaverificationonjoin)                       | Si la vérification captcha est activée ou non.                                                                    |
| [Logs](#captchaverificationlogenabled)                     | Whether or not verification attempts will be logged                                                               |
| [Message d’échec](#captchaverificationfailedmessage)       | Le message envoyé à l'utilisateur si il a entré un mauvais captcha.                                               |
| [Message de bienvenue](#captchaverificationwelcomemessage) | Le message que l'utilisateur recevra après avoir rejoint le server et les instructions pour compléter le captcha. |
| [Message de réussite](#captchaverificationsuccessmessage)  | Le message de bienvenue envoyé à l'utilisateur après une vérification réussie.                                    |
| [Message de temps expiré](#captchaverificationtimeout)     | Le temps que l'utilisateur a pour valider le captcha.                                                             |

#### Messages doublons

| Setting                                              | Description                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Activé](#automodduplicatetextenabled)               | Modère automatiquement les messages dupliqués (spam copié-collé)                     |
| [Timeframe](#automodduplicatetexttimeframeinseconds) | L'écart de temps pour que les messages identiques soient considérés comme dupliqués. |

#### Emojis

| Setting                                                    | Description                                                                                                                                          |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Activé](#automodemojisenabled)                            | Modère automatiquement les messages avec trop d'emojis.                                                                                              |
| [Activé](#automodhoistenabled)                             | Donne automatiquement des pseudos aux membres si ils essaient de tricher (en utilisant des caractères spéciaux pour apparaître en haut de la liste). |
| [Nombre maximal d'émojis](#automodemojismaxnumberofemojis) | Le maximum d'emojis autorisés avant de modérer le message.                                                                                           |

#### Générale

| Setting                                                                  | Description                                                                                                                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Activé](#automodenabled)                                                | Modère automatiquement les messages (des règles peuvent être activées ou désactivées).                                                                       |
| [Désactivé pour les anciens membres](#automoddisabledforoldmembers)      | Désactive la modération automatique pour les membres qui sont dans votre serveur depuis longtemps.                                                           |
| [Rôle muet](#mutedrole)                                                  | Le rôle donné aux utilisateurs quand ils sont rendus muets. Vérifiez que ce rôle n'a pas la permission "Envoyer des messages"                                |
| [Rôles ignorés](#automodignoredroles)                                    | N'importe quel membre avec ce rôle ne sera pas automatiquement modéré.                                                                                       |
| [Rôles modérés](#automodmoderatedroles)                                  | The list of roles that are moderated (this acts as a whitelist, leave empty to moderate all roles, or use `autoModIgnoredRoles` to ignore certain roles).    |
| [Salons ignorés](#automodignoredchannels)                                | Salons ignorés lors de la modération automatique.                                                                                                            |
| [Salons modérés](#automodmoderatedchannels)                              | The list of moderated channels (this acts as a whitelist, leave empty to moderate all channels, or use `autoModIgnoredChannels` to ignore certain channels). |
| [Seuil pour les anciens membres](#automoddisabledforoldmembersthreshold) | L'ancienneté d'un membre requise dans votre serveur pour être considéré comme "ancien".                                                                      |

#### Invitations

| Setting                                                           | Description                                                                |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Les invitations sont désormais modérées](#automodinvitesenabled) | Vérifie automatiquement les messages pour enlever les invitations Discord. |

#### Liens

| Setting                                                  | Description                                                                                                            |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [Les liens sont désormais modérés](#automodlinksenabled) | Retire automatiquement les messages contenant des liens (vous pouvez configurer une liste blanche et une liste noire). |
| [Liste blanche](#automodlinkswhitelist)                  | Une liste de liens que les utilisateurs peuvent poster.                                                                |
| [Liste noire](#automodlinksblacklist)                    | Met sur liste noire certains liens que les utilisateurs ne pourront pas envoyer.                                       |
| [Suivre les redirections](#automodlinksfollowredirects)  | Activez ceci pour corriger les redirections de liens.                                                                  |

#### Logger

| Setting                                                                               | Description                                                                   |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Délai de suppression des messages du bot.](#automoddeletebotmessagetimeoutinseconds) | Le temps après lequel les messages du bot sont supprimés                      |
| [Mod Log Channel](#automodlogenabled)                                                 | Enregistre toutes les actions faites par le bot.                              |
| [Salon des journaux de modération](#modlogchannel)                                    | Le salon où les notes de modérations seront postées.                          |
| [Supprime les messages de Softban](#modpunishmentsoftbandeletemessage)                | Si oui ou non les messages après un softban seront automatiquement supprimés. |
| [Supprimer les messages d'avertissement](#modpunishmentwarndeletemessage)             | Si oui ou non les messages après un warn seront automatiquement supprimés.    |
| [Supprimer les messages d'expulsion](#modpunishmentkickdeletemessage)                 | Si oui ou non les messages après un kick seront automatiquement supprimés.    |
| [Supprimer les messages de bannissement](#modpunishmentbandeletemessage)              | Si oui ou non les messages après un ban seront automatiquement supprimés.     |
| [Supprimer les messages de mute](#modpunishmentmutedeletemessage)                     | Si oui ou non les messages après un mute seront automatiquement supprimés.    |
| [Supprimer les messages du Bot](#automoddeletebotmessage)                             | Supprime automatiquement les messages du bot (garde le chat propre)           |

#### Mentions

| Setting                                                                                        | Description                                                                             |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Activé](#automodmentionusersenabled)                                                          | Retire automatiquement les messages avec un nombre excessif de mentions d'utilisateurs. |
| [Activé](#automodmentionrolesenabled)                                                          | Retire automatiquement les messages avec trop de mentions de rôles.                     |
| [Nombre maximal de mentions de rôle par message](#automodmentionrolesmaxnumberofmentions)      | Le nombre maximal de rôles qu'un membre peut mentionner en un message.                  |
| [Nombre maximal de mentions utilisateurs par message](#automodmentionusersmaxnumberofmentions) | Le nombre maximal de d'utilisateurs qu'un membre peut mentionner en un message.         |

#### Spam

| Setting                                                     | Description                                                                                              |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [Activé](#automodquickmessagesenabled)                      | Modère automatiquement les utilisateurs qui envoient beucoup de messages rapidement.                     |
| [Nombre de messages](#automodquickmessagesnumberofmessages) | Le nombre de messages qui doivent être envoyés pendant une certaine durée pour que celui-ci soit modéré. |
| [Timeframe](#automodquickmessagestimeframeinseconds)        | La durée pendant laquelle l'utilisateur peut envoyer un nombre maximum de messages.                      |

### Musique

#### Annonce

| Setting                                          | Description                                                          |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| [Annonce la musique suivante](#announcenextsong) | Si oui ou non la chanson suivante sera annoncée dans le salon vocal. |
| [Voix d'annonce](#announcementvoice)             | La voix utilisée pour annoncer la musique suivante.                  |

#### Baisse le volume de la musique

| Setting                                                    | Description                                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Baisse le volume lors d'une discussion](#fademusicontalk) | Si activé, la musique baissera de volume si des personnes sont en train de parler.        |
| [Fin du délai de baisse du volume](#fademusicenddelay)     | Le temps pendant lequel personne ne doit parler pour que le volume retourne à la normale. |

#### Musique

| Setting                              | Description                                                               |
| ------------------------------------ | ------------------------------------------------------------------------- |
| [Volume de la musique](#musicvolume) | Le volume par défaut qui est défini lorsque le bot rejoin le salon vocal. |

#### Plateforme

| Setting                                                      | Description                                                                                              |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| [Plateforme de musique par défault](#defaultmusicplatform)   | La plateforme utilisée pour rechercher / jouer de la musique quand aucune plateforme n'est sélectionnée. |
| [Plateformes musicales désactivées](#disabledmusicplatforms) | Les plateformes de musique désactivées et qui ne peuvent pas être utilisées pour jouer de la musique.    |

<a name=activityEnabled></a>

---

## settings.groups.custom_bot.title - settings.activityEnabled.title

settings.activityEnabled.description

Type: `Boolean`

Default: `true`

Reset to default:
`!config activityEnabled default`

Enable:

`!config activityEnabled true`

Disable:

`!config activityEnabled false`

<a name=activityMessage></a>

---

## settings.groups.custom_bot.title - settings.activityMessage.title

settings.activityMessage.description

Type: `String`

Default: `null`

Reset to default:
`!config activityMessage default`

<a name=activityStatus></a>

---

## settings.groups.custom_bot.title - settings.activityStatus.title

settings.activityStatus.description

Type: `Enum`

Default: `online`

Reset to default:
`!config activityStatus default`

Possible values: `online`, `dnd`, `idle`

Example:

`!config activityStatus online`

<a name=activityType></a>

---

## settings.groups.custom_bot.title - settings.activityType.title

settings.activityType.description

Type: `Enum`

Default: `playing`

Reset to default:
`!config activityType default`

Possible values: `playing`, `streaming`, `listening`, `watching`

Example:

`!config activityType playing`

<a name=activityUrl></a>

---

## settings.groups.custom_bot.title - settings.activityUrl.title

settings.activityUrl.description

Type: `String`

Default: `null`

Reset to default:
`!config activityUrl default`

<a name=embedDefaultColor></a>

---

## settings.groups.custom_bot.title - settings.embedDefaultColor.title

settings.embedDefaultColor.description

Type: `String`

Default: `null`

Reset to default:
`!config embedDefaultColor default`

<a name=channels></a>

---

## Paramètres de base - Channel des commandes

Le channel dans lequel le bot réagira aux commandes.

Type: `Channel[]`

Default: ``

Reset to default:
`!config channels default`

<a name=lang></a>

---

## Paramètres de base - Langage

La langue du bot

Type: `Enum`

Default: `en`

Reset to default:
`!config lang default`

Possible values: `ar`, `bg`, `cs`, `de`, `el`, `en`, `es`, `fr`, `hu`, `id_ID`, `it`, `ja`, `lt`, `nl`, `pl`, `pt`, `pt_BR`, `ro`, `ru`, `sr`, `tr`, `zh_CN`, `zh_TW`

Example:

`!config lang ar`

<a name=prefix></a>

---

## Paramètres de base - Préfixe

Le préfixe utilisé pour les commandes du bot.

Type: `String`

Default: `!`

Reset to default:
`!config prefix default`

Examples:

`!config prefix +`

`!config prefix >`

<a name=logChannel></a>

---

## Paramètres de base - Salon des logs

Le salon dans lequel les actions du bot sont notées.

Type: `Channel`

Default: `null`

Reset to default:
`!config logChannel default`

Examples:

`!config logChannel #channel`

<a name=ignoredChannels></a>

---

## Paramètres de base - Salons ignorés

Les salons dans lesquelles le bot ignorera les commandes.

Type: `Channel[]`

Default: ``

Reset to default:
`!config ignoredChannels default`

<a name=hideFromLeaderboard></a>

---

## Invitations - settings.hideFromLeaderboard.title

settings.hideFromLeaderboard.description

Type: `Boolean`

Default: `false`

Reset to default:
`!config hideFromLeaderboard default`

Enable:

`!config hideFromLeaderboard true`

Disable:

`!config hideFromLeaderboard false`

<a name=name></a>

---

## Invitations - settings.name.title

settings.name.description

Type: `String`

Default: `null`

Reset to default:
`!config name default`

<a name=roles></a>

---

## Invitations - settings.roles.title

settings.roles.description

Type: `Role[]`

Default: ``

Reset to default:
`!config roles default`

<a name=autoSubtractFakes></a>

---

## Invitations - Faux - Soustraction automatique

Enlève automatiquement les fausses invitations.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoSubtractFakes default`

Enable:

`!config autoSubtractFakes true`

Disable:

`!config autoSubtractFakes false`

<a name=joinRoles></a>

---

## Invitations - Général - Rôles d'arrivées

Rôles assignés à tous les utilisateurs quand ils rejoignent.

Type: `Role[]`

Default: ``

Reset to default:
`!config joinRoles default`

<a name=joinMessage></a>

---

## Invitations - Arrivées - Message d'arrivée

Le message envoyé quand quelqu'un rejoint le serveur.

Type: `String`

Default: `{memberMention} **joined**; Invited by **{inviterName}** (**{numInvites}** invites)`

Reset to default:
`!config joinMessage default`

<a name=joinMessageChannel></a>

---

## Invitations - Arrivées - Salon d'arrivée

Le salon dans lequel le message de bienvenue est envoyé.

Type: `Channel`

Default: `null`

Reset to default:
`!config joinMessageChannel default`

Examples:

`!config joinMessageChannel #general`

`!config joinMessageChannel #joins`

<a name=hideLeftMembersFromLeaderboard></a>

---

## Invitations - Classement - Cacher les membres partis

Cache les utilisateurs qui ont quitté le serveur du leaderboard.

Type: `Boolean`

Default: `true`

Reset to default:
`!config hideLeftMembersFromLeaderboard default`

Enable:

`!config hideLeftMembersFromLeaderboard true`

Disable:

`!config hideLeftMembersFromLeaderboard false`

<a name=leaderboardStyle></a>

---

## Invitations - Classement - Style

Le style d'affichage du leaderboard.

Type: `Enum`

Default: `normal`

Reset to default:
`!config leaderboardStyle default`

Possible values: `normal`, `table`, `mentions`

Example:

`!config leaderboardStyle normal`

<a name=leaveMessage></a>

---

## Invitations - Départs - Message de départ

Le message envoyé quand quelqu'un quitte le serveur.

Type: `String`

Default: `{memberName} **left**; Invited by **{inviterName}**`

Reset to default:
`!config leaveMessage default`

Examples:

`!config leaveMessage`

`!config leaveMessage`

<a name=leaveMessageChannel></a>

---

## Invitations - Départs - Salon de départ

Le salon dans lequel est envoyé le message lorsque quelqu'un quitte le serveur.

Type: `Channel`

Default: `null`

Reset to default:
`!config leaveMessageChannel default`

Examples:

`!config leaveMessageChannel #general`

`!config leaveMessageChannel #leaves`

<a name=autoSubtractLeaveThreshold></a>

---

## Invitations - Départs - Seuil de soustraction automatique

Le temps en secondes que doivent rester les utilisateurs pour que l'invitation compte.

Type: `Number`

Default: `600`

Reset to default:
`!config autoSubtractLeaveThreshold default`

Examples:

`!config autoSubtractLeaveThreshold 60`

`!config autoSubtractLeaveThreshold 3600`

<a name=autoSubtractLeaves></a>

---

## Invitations - Départs - Soustraction automatique

Enlève automatiquement les invitations de l'invitant quand l'utilisateur invité quitte.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoSubtractLeaves default`

Enable:

`!config autoSubtractLeaves true`

Disable:

`!config autoSubtractLeaves false`

<a name=rankAnnouncementMessage></a>

---

## Invitations - Rangs - Message d'annonce

Le message envoyé quand l'utilisateur reçois un nouveau rang.

Type: `String`

Default: `Congratulations, **{memberMention}** has reached the **{rankName}** rank!`

Reset to default:
`!config rankAnnouncementMessage default`

Examples:

`!config rankAnnouncementMessage`

`!config rankAnnouncementMessage`

<a name=rankAnnouncementChannel></a>

---

## Invitations - Rangs - Salon d'annonce

Le salon où le nouveau niveau d'utilisateurs est annoncé.

Type: `Channel`

Default: `null`

Reset to default:
`!config rankAnnouncementChannel default`

Examples:

`!config rankAnnouncementChannel`

`!config rankAnnouncementChannel`

<a name=rankAssignmentStyle></a>

---

## Invitations - Rangs - Style d'assignement

Comment les rangs sont donnés aux utilisateurs.

Type: `Enum`

Default: `all`

Reset to default:
`!config rankAssignmentStyle default`

Possible values: `all`, `highest`, `onlyAdd`

Example:

`!config rankAssignmentStyle all`

<a name=autoModWordsEnabled></a>

---

## Modération - Mots bannis - Activé

Que les mots de la liste noire soient ou non automatisés.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModWordsEnabled default`

Enable:

`!config autoModWordsEnabled true`

Disable:

`!config autoModWordsEnabled false`

<a name=autoModWordsBlacklist></a>

---

## Modération - Mots bannis - Liste noire

Une liste de mots bannis.

Type: `String[]`

Default: ``

Reset to default:
`!config autoModWordsBlacklist default`

Examples:

`!config autoModWordsBlacklist gay`

`!config autoModWordsBlacklist stupid,fuck`

<a name=autoModAllCapsEnabled></a>

---

## Modération - Majuscules - Activé

Modère automatiquement les messages avec BEAUCOUP DE MAJUSCULES.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModAllCapsEnabled default`

Enable:

`!config autoModAllCapsEnabled true`

Disable:

`!config autoModAllCapsEnabled false`

<a name=autoModAllCapsMinCharacters></a>

---

## Modération - Majuscules - Caractères minimum

La quantité minimale de caractères dans un message à prendre en compte pour la modération (définir sur '3' ignorerait 'OK').

Type: `Number`

Default: `10`

Reset to default:
`!config autoModAllCapsMinCharacters default`

Examples:

`!config autoModAllCapsMinCharacters 5`

`!config autoModAllCapsMinCharacters 15`

<a name=autoModAllCapsPercentageCaps></a>

---

## Modération - Majuscules - Percentage Caps

Le pourcentage de caractères en majuscules dans le message pour que celui-ci soit modéré.

Type: `Number`

Default: `70`

Reset to default:
`!config autoModAllCapsPercentageCaps default`

Examples:

`!config autoModAllCapsPercentageCaps 50`

`!config autoModAllCapsPercentageCaps 90`

<a name=captchaVerificationOnJoin></a>

---

## Modération - Captcha - Activé

Si la vérification captcha est activée ou non.

Type: `Boolean`

Default: `false`

Reset to default:
`!config captchaVerificationOnJoin default`

Enable:

`!config captchaVerificationOnJoin true`

Disable:

`!config captchaVerificationOnJoin false`

<a name=captchaVerificationLogEnabled></a>

---

## Modération - Captcha - Logs

Whether or not verification attempts will be logged

Type: `Boolean`

Default: `true`

Reset to default:
`!config captchaVerificationLogEnabled default`

Enable:

`!config captchaVerificationLogEnabled true`

Disable:

`!config captchaVerificationLogEnabled false`

<a name=captchaVerificationFailedMessage></a>

---

## Modération - Captcha - Message d’échec

Le message envoyé à l'utilisateur si il a entré un mauvais captcha.

Type: `String`

Default: `You did not enter the captha right within the specified time.We're sorry, but we have to kick you from the server. Feel free to join again.`

Reset to default:
`!config captchaVerificationFailedMessage default`

Examples:

`!config captchaVerificationFailedMessage Looks like you are not human :(. You can join again and try again later if this was a mistake!`

<a name=captchaVerificationWelcomeMessage></a>

---

## Modération - Captcha - Message de bienvenue

Le message que l'utilisateur recevra après avoir rejoint le server et les instructions pour compléter le captcha.

Type: `String`

Default: `Welcome to the server **{serverName}**! For extra protection, new members are required to enter a captcha.`

Reset to default:
`!config captchaVerificationWelcomeMessage default`

Examples:

`!config captchaVerificationWelcomeMessage Welcome, please enter the captcha below!`

<a name=captchaVerificationSuccessMessage></a>

---

## Modération - Captcha - Message de réussite

Le message de bienvenue envoyé à l'utilisateur après une vérification réussie.

Type: `String`

Default: `You have successfully entered the captcha. Welcome to the server!`

Reset to default:
`!config captchaVerificationSuccessMessage default`

Examples:

`!config captchaVerificationSuccessMessage Thanks for entering the captcha, enjoy our server!`

<a name=captchaVerificationTimeout></a>

---

## Modération - Captcha - Message de temps expiré

Le temps que l'utilisateur a pour valider le captcha.

Type: `Number`

Default: `180`

Reset to default:
`!config captchaVerificationTimeout default`

Examples:

`!config captchaVerificationTimeout 60`

`!config captchaVerificationTimeout 600`

<a name=autoModDuplicateTextEnabled></a>

---

## Modération - Messages doublons - Activé

Modère automatiquement les messages dupliqués (spam copié-collé)

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModDuplicateTextEnabled default`

Enable:

`!config autoModDuplicateTextEnabled true`

Disable:

`!config autoModDuplicateTextEnabled false`

<a name=autoModDuplicateTextTimeframeInSeconds></a>

---

## Modération - Messages doublons - Timeframe

L'écart de temps pour que les messages identiques soient considérés comme dupliqués.

Type: `Number`

Default: `60`

Reset to default:
`!config autoModDuplicateTextTimeframeInSeconds default`

Examples:

`!config autoModDuplicateTextTimeframeInSeconds 5`

`!config autoModDuplicateTextTimeframeInSeconds 20`

<a name=autoModEmojisEnabled></a>

---

## Modération - Emojis - Activé

Modère automatiquement les messages avec trop d'emojis.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModEmojisEnabled default`

Enable:

`!config autoModEmojisEnabled true`

Disable:

`!config autoModEmojisEnabled false`

<a name=autoModHoistEnabled></a>

---

## Modération - Emojis - Activé

Donne automatiquement des pseudos aux membres si ils essaient de tricher (en utilisant des caractères spéciaux pour apparaître en haut de la liste).

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModHoistEnabled default`

Enable:

`!config autoModHoistEnabled true`

Disable:

`!config autoModHoistEnabled false`

<a name=autoModEmojisMaxNumberOfEmojis></a>

---

## Modération - Emojis - Nombre maximal d'émojis

Le maximum d'emojis autorisés avant de modérer le message.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModEmojisMaxNumberOfEmojis default`

Examples:

`!config autoModEmojisMaxNumberOfEmojis 5`

`!config autoModEmojisMaxNumberOfEmojis 10`

<a name=autoModEnabled></a>

---

## Modération - Générale - Activé

Modère automatiquement les messages (des règles peuvent être activées ou désactivées).

Type: `Boolean`

Default: `false`

Reset to default:
`!config autoModEnabled default`

Enable:

`!config autoModEnabled true`

Disable:

`!config autoModEnabled false`

<a name=autoModDisabledForOldMembers></a>

---

## Modération - Générale - Désactivé pour les anciens membres

Désactive la modération automatique pour les membres qui sont dans votre serveur depuis longtemps.

Type: `Boolean`

Default: `false`

Reset to default:
`!config autoModDisabledForOldMembers default`

Enable:

`!config autoModDisabledForOldMembers true`

Disable:

`!config autoModDisabledForOldMembers false`

<a name=mutedRole></a>

---

## Modération - Générale - Rôle muet

Le rôle donné aux utilisateurs quand ils sont rendus muets. Vérifiez que ce rôle n'a pas la permission "Envoyer des messages"

Type: `Role`

Default: `null`

Reset to default:
`!config mutedRole default`

Examples:

`!config mutedRole @muted`

<a name=autoModIgnoredRoles></a>

---

## Modération - Générale - Rôles ignorés

N'importe quel membre avec ce rôle ne sera pas automatiquement modéré.

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModIgnoredRoles default`

Examples:

`!config autoModIgnoredRoles @TrustedMembers`

`!config autoModIgnoredRoles @Moderators,@Staff`

<a name=autoModModeratedRoles></a>

---

## Modération - Générale - Rôles modérés

The list of roles that are moderated (this acts as a whitelist, leave empty to moderate all roles, or use `autoModIgnoredRoles` to ignore certain roles).

Type: `Role[]`

Default: ``

Reset to default:
`!config autoModModeratedRoles default`

Examples:

`!config autoModModeratedRoles @NewMembers`

`!config autoModModeratedRoles @Newbies,@Starters`

<a name=autoModIgnoredChannels></a>

---

## Modération - Générale - Salons ignorés

Salons ignorés lors de la modération automatique.

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModIgnoredChannels default`

Examples:

`!config autoModIgnoredChannels #general`

`!config autoModIgnoredChannels #off-topic,#nsfw`

<a name=autoModModeratedChannels></a>

---

## Modération - Générale - Salons modérés

The list of moderated channels (this acts as a whitelist, leave empty to moderate all channels, or use `autoModIgnoredChannels` to ignore certain channels).

Type: `Channel[]`

Default: ``

Reset to default:
`!config autoModModeratedChannels default`

Examples:

`!config autoModModeratedChannels #general`

`!config autoModModeratedChannels #support,#help`

<a name=autoModDisabledForOldMembersThreshold></a>

---

## Modération - Générale - Seuil pour les anciens membres

L'ancienneté d'un membre requise dans votre serveur pour être considéré comme "ancien".

Type: `Number`

Default: `604800`

Reset to default:
`!config autoModDisabledForOldMembersThreshold default`

Examples:

`!config autoModDisabledForOldMembersThreshold 604800` (1 week)``

`!config autoModDisabledForOldMembersThreshold 2419200` (1 month)``

<a name=autoModInvitesEnabled></a>

---

## Modération - Invitations - Les invitations sont désormais modérées

Vérifie automatiquement les messages pour enlever les invitations Discord.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModInvitesEnabled default`

Enable:

`!config autoModInvitesEnabled true`

Disable:

`!config autoModInvitesEnabled false`

<a name=autoModLinksEnabled></a>

---

## Modération - Liens - Les liens sont désormais modérés

Retire automatiquement les messages contenant des liens (vous pouvez configurer une liste blanche et une liste noire).

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLinksEnabled default`

Enable:

`!config autoModLinksEnabled true`

Disable:

`!config autoModLinksEnabled false`

<a name=autoModLinksWhitelist></a>

---

## Modération - Liens - Liste blanche

Une liste de liens que les utilisateurs peuvent poster.

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksWhitelist default`

Examples:

`!config autoModLinksWhitelist discordbots.org`

`!config autoModLinksWhitelist youtube.com,twitch.com`

<a name=autoModLinksBlacklist></a>

---

## Modération - Liens - Liste noire

Met sur liste noire certains liens que les utilisateurs ne pourront pas envoyer.

Type: `String[]`

Default: ``

Reset to default:
`!config autoModLinksBlacklist default`

Examples:

`!config autoModLinksBlacklist google.com`

`!config autoModLinksBlacklist twitch.com,youtube.com`

<a name=autoModLinksFollowRedirects></a>

---

## Modération - Liens - Suivre les redirections

Activez ceci pour corriger les redirections de liens.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLinksFollowRedirects default`

Enable:

`!config autoModLinksFollowRedirects true`

Disable:

`!config autoModLinksFollowRedirects false`

<a name=autoModDeleteBotMessageTimeoutInSeconds></a>

---

## Modération - Logger - Délai de suppression des messages du bot.

Le temps après lequel les messages du bot sont supprimés

Type: `Number`

Default: `5`

Reset to default:
`!config autoModDeleteBotMessageTimeoutInSeconds default`

Examples:

`!config autoModDeleteBotMessageTimeoutInSeconds 5`

`!config autoModDeleteBotMessageTimeoutInSeconds 10`

<a name=autoModLogEnabled></a>

---

## Modération - Logger - Mod Log Channel

Enregistre toutes les actions faites par le bot.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModLogEnabled default`

Enable:

`!config autoModLogEnabled true`

Disable:

`!config autoModLogEnabled false`

<a name=modLogChannel></a>

---

## Modération - Logger - Salon des journaux de modération

Le salon où les notes de modérations seront postées.

Type: `Channel`

Default: `null`

Reset to default:
`!config modLogChannel default`

Examples:

`!config modLogChannel #channel`

`!config modLogChannel #logs`

<a name=modPunishmentSoftbanDeleteMessage></a>

---

## Modération - Logger - Supprime les messages de Softban

Si oui ou non les messages après un softban seront automatiquement supprimés.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentSoftbanDeleteMessage default`

Enable:

`!config modPunishmentSoftbanDeleteMessage true`

Disable:

`!config modPunishmentSoftbanDeleteMessage false`

<a name=modPunishmentWarnDeleteMessage></a>

---

## Modération - Logger - Supprimer les messages d'avertissement

Si oui ou non les messages après un warn seront automatiquement supprimés.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentWarnDeleteMessage default`

Enable:

`!config modPunishmentWarnDeleteMessage true`

Disable:

`!config modPunishmentWarnDeleteMessage false`

<a name=modPunishmentKickDeleteMessage></a>

---

## Modération - Logger - Supprimer les messages d'expulsion

Si oui ou non les messages après un kick seront automatiquement supprimés.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentKickDeleteMessage default`

Enable:

`!config modPunishmentKickDeleteMessage true`

Disable:

`!config modPunishmentKickDeleteMessage false`

<a name=modPunishmentBanDeleteMessage></a>

---

## Modération - Logger - Supprimer les messages de bannissement

Si oui ou non les messages après un ban seront automatiquement supprimés.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentBanDeleteMessage default`

Enable:

`!config modPunishmentBanDeleteMessage true`

Disable:

`!config modPunishmentBanDeleteMessage false`

<a name=modPunishmentMuteDeleteMessage></a>

---

## Modération - Logger - Supprimer les messages de mute

Si oui ou non les messages après un mute seront automatiquement supprimés.

Type: `Boolean`

Default: `true`

Reset to default:
`!config modPunishmentMuteDeleteMessage default`

Enable:

`!config modPunishmentMuteDeleteMessage true`

Disable:

`!config modPunishmentMuteDeleteMessage false`

<a name=autoModDeleteBotMessage></a>

---

## Modération - Logger - Supprimer les messages du Bot

Supprime automatiquement les messages du bot (garde le chat propre)

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModDeleteBotMessage default`

Enable:

`!config autoModDeleteBotMessage true`

Disable:

`!config autoModDeleteBotMessage false`

<a name=autoModMentionUsersEnabled></a>

---

## Modération - Mentions - Activé

Retire automatiquement les messages avec un nombre excessif de mentions d'utilisateurs.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModMentionUsersEnabled default`

Enable:

`!config autoModMentionUsersEnabled true`

Disable:

`!config autoModMentionUsersEnabled false`

<a name=autoModMentionRolesEnabled></a>

---

## Modération - Mentions - Activé

Retire automatiquement les messages avec trop de mentions de rôles.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModMentionRolesEnabled default`

Enable:

`!config autoModMentionRolesEnabled true`

Disable:

`!config autoModMentionRolesEnabled false`

<a name=autoModMentionRolesMaxNumberOfMentions></a>

---

## Modération - Mentions - Nombre maximal de mentions de rôle par message

Le nombre maximal de rôles qu'un membre peut mentionner en un message.

Type: `Number`

Default: `3`

Reset to default:
`!config autoModMentionRolesMaxNumberOfMentions default`

Examples:

`!config autoModMentionRolesMaxNumberOfMentions 2`

`!config autoModMentionRolesMaxNumberOfMentions 5`

<a name=autoModMentionUsersMaxNumberOfMentions></a>

---

## Modération - Mentions - Nombre maximal de mentions utilisateurs par message

Le nombre maximal de d'utilisateurs qu'un membre peut mentionner en un message.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModMentionUsersMaxNumberOfMentions default`

Examples:

`!config autoModMentionUsersMaxNumberOfMentions 2`

`!config autoModMentionUsersMaxNumberOfMentions 5`

<a name=autoModQuickMessagesEnabled></a>

---

## Modération - Spam - Activé

Modère automatiquement les utilisateurs qui envoient beucoup de messages rapidement.

Type: `Boolean`

Default: `true`

Reset to default:
`!config autoModQuickMessagesEnabled default`

Enable:

`!config autoModQuickMessagesEnabled true`

Disable:

`!config autoModQuickMessagesEnabled false`

<a name=autoModQuickMessagesNumberOfMessages></a>

---

## Modération - Spam - Nombre de messages

Le nombre de messages qui doivent être envoyés pendant une certaine durée pour que celui-ci soit modéré.

Type: `Number`

Default: `5`

Reset to default:
`!config autoModQuickMessagesNumberOfMessages default`

Examples:

`!config autoModQuickMessagesNumberOfMessages 5`

`!config autoModQuickMessagesNumberOfMessages 10`

<a name=autoModQuickMessagesTimeframeInSeconds></a>

---

## Modération - Spam - Timeframe

La durée pendant laquelle l'utilisateur peut envoyer un nombre maximum de messages.

Type: `Number`

Default: `3`

Reset to default:
`!config autoModQuickMessagesTimeframeInSeconds default`

Examples:

`!config autoModQuickMessagesTimeframeInSeconds 2`

`!config autoModQuickMessagesTimeframeInSeconds 10`

<a name=announceNextSong></a>

---

## Musique - Annonce - Annonce la musique suivante

Si oui ou non la chanson suivante sera annoncée dans le salon vocal.

Type: `Boolean`

Default: `true`

Reset to default:
`!config announceNextSong default`

Enable:

`!config announceNextSong true`

Disable:

`!config announceNextSong false`

<a name=announcementVoice></a>

---

## Musique - Annonce - Voix d'annonce

La voix utilisée pour annoncer la musique suivante.

Type: `Enum`

Default: `Joanna`

Reset to default:
`!config announcementVoice default`

Possible values: `Joanna`, `Salli`, `Kendra`, `Kimberly`, `Ivy`, `Matthew`, `Justin`, `Joey`

Example:

`!config announcementVoice Joanna`

<a name=fadeMusicOnTalk></a>

---

## Musique - Baisse le volume de la musique - Baisse le volume lors d'une discussion

Si activé, la musique baissera de volume si des personnes sont en train de parler.

Type: `Boolean`

Default: `true`

Reset to default:
`!config fadeMusicOnTalk default`

Enable:

`!config fadeMusicOnTalk true`

Disable:

`!config fadeMusicOnTalk false`

<a name=fadeMusicEndDelay></a>

---

## Musique - Baisse le volume de la musique - Fin du délai de baisse du volume

Le temps pendant lequel personne ne doit parler pour que le volume retourne à la normale.

Type: `Number`

Default: `1`

Reset to default:
`!config fadeMusicEndDelay default`

<a name=musicVolume></a>

---

## Musique - Musique - Volume de la musique

Le volume par défaut qui est défini lorsque le bot rejoin le salon vocal.

Type: `Number`

Default: `100`

Reset to default:
`!config musicVolume default`

<a name=defaultMusicPlatform></a>

---

## Musique - Plateforme - Plateforme de musique par défault

La plateforme utilisée pour rechercher / jouer de la musique quand aucune plateforme n'est sélectionnée.

Type: `Enum`

Default: `SoundCloud`

Reset to default:
`!config defaultMusicPlatform default`

<a name=disabledMusicPlatforms></a>

---

## Musique - Plateforme - Plateformes musicales désactivées

Les plateformes de musique désactivées et qui ne peuvent pas être utilisées pour jouer de la musique.

Type: `Enum[]`

Default: ``

Reset to default:
`!config disabledMusicPlatforms default`
