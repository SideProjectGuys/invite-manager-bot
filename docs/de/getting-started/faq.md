# FAQ}

## Wie ändere ich den Prefix des Bots?

Du kannst `!config prefix -` ausführen, um den Prefix zu ändern.

Wenn du deinen aktuellen Prefix nicht kennst, kannst du `@InviteManager config prefix` ausführen, um den Prefix zu sehen.

## Wie stelle ich Join und Leave Nachrichten ein?

Stelle den Channel mit folgendem Command

`!config joinMessageChannel #channel`

oder

`!config leaveMessageChannel #channel` ein.

Danach werden neue Join und Leave Nachrichten in diesem Channel gepostet.

## Kann ich die Join und Leave Nachrichten verändern?

Allerdings! Du kannst die Nachricht ändern folgendermaßen individualisieren:

`!config joinMessage {memberMention} *ist beigetreten**; Eingeladen von **{inviterName}** (**{numInvites}** invites)`

oder

`!config leaveMessage {memberName} **hat den Server verlassen**; Eingeladen von **{inviterName}**`.

Es sind viele Platzhalter verfügbar. Du kannst die vollständige Liste auf der Seite '[Individuelle Nachrichten](/de/modules/invites/custom-messages.md)' sehen.

## Was sind 'Ränge' und wie kann ich sie benutzen?

Ränge werden verwendet, um Personen Rollen zuzuweisen, wenn sie eine bestimmte Anzahl von Einladungen erreicht haben. Wenn du zum Beispiel eine Rolle namens `@Anfänger` hast und du möchtest, dass Leute, die 5 oder mehr Einladungen haben, zu dieser Rolle hinzugefügt werden, musst du dafür so einen Rang erstellen: `!add-rank @Anfänger 5 (und wenn du willst hier eine Beschreibung)`. Sobald jemand 5 Einladungen hat, wird er automatisch dieser Rolle hinzugefügt!

## Wie kann ich den Bot in allen bis auf einen oder einige Channel deaktivieren?

Nimm dem Bot die Rechte zum Lesen von Nachrichten in den Channeln, in denen der Bot nicht antworten soll, weg.

## Einschränkung: Kein Tracking bevor der Bot beigetreten ist

Das Tracking (wer wen eingeladen hat) funktioniert nur, nachdem du den Bot eingeladen hast. Der Bot weiß auch nach der Einladung noch von jedem die Anzahl der Einladungen, keine Sorge. Nur die zusätzlichen Informationen fehlen und können nur für die Mitglieder gesammelt werden, die erst nach der Einladung des Bots beitreten.
