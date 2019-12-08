# Questions Courantes}

## Comment je change le préfix du bot?

Vous pouvez faire `!config prefix -` pour changer le préfixe.

Si vous ne connaissez pas votre préfixe actuel, vous pouvez utiliser `@InviteManager config prefix` pour afficher le préfixe.

## Comment je définie des messages d'arrivés et de départs?

Définissez le salon en faisant
`!config joinMessageChannel #channel` ou

`!config leaveMessageChannel #channel`.
Après cela, les prochain messages seront affichées sur ce salon.

## Est-ce que je peut personnaliser les messages d'arrivées et de départs?

Absolument! Vous pouvez changer le message en faisant par exemple
``!config joinMessage {memberMention} **viens d'arriver**; Invité par **{inviterName}** (**{numInvites}** invitations)`

ou

`!config leaveMessage {memberName} **à quitté**; Invité par **{inviterName}**`.

Il existe de nombreux espaces réservés disponibles. Vous pouvez voir la liste complète sur la page '[Messages personnalisés](/fr/modules/invites/custom-messages.md)'.

## Qu'est-ce que 'Ranks' et comment puis-je les utiliser?

Les rôles sont utilisés pour attribuer des rôles aux personnes lorsqu'elles atteignent un certain nombre d'invitations. Par exemple. Si vous avez un rôle appelé `@Débutant` et que vous voulez que des personnes qui ont 5 invitations ou plus soient ajoutées à ce rôle, vous devrez créer un rôles comme ceci:`!add-rankadd-rank @Débutant 5 (et si vous voulez une description ici)`.Dès que quelqu'un aura 5 invitations, il sera automatiquement ajouté à ce rôle!

## Comment puis-je désactiver le bot dans un ou plusieurs salon ?

Supprimez les autorisations de lecture dans les salons où vous ne souhaitez pas que le bot réponde.

## Limitation: pas de suivi avancé avant que le bot ne sois ajouté

Le suivi avancé (qui a invité qui) ne fonctionne qu'après que vous ayez invité le bot. Le bot saura toujours le nombre d'invitations de tout le monde après l'invitation, ne vous inquiétez pas. Seules les informations supplémentaires sont manquantes et ne peuvent être collectées que pour les membres qui rejoignent après que vous ayez invité le bot.
