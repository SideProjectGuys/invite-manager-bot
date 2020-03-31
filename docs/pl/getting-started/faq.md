# FAQ}

## Jak zmienić prefiks bota?

Możesz napisać `!config prefix -` żeby zmienić prefix.

Jeśli nie znasz swojego aktualnego prefixu użyj `@InviteManager config prefix` aby go zobaczyć

## Jak ustawić wiadomości na powitania i pożegnania?

Ustaw kanał wpisując:

`!config joinMessageChannel #kanał`

lub

`!config leaveMessageChannel #kanał`.

Po wykonaniu tej czynności nowe powitania i pożegnania zostaną opublikowane na tym kanale.

## Czy mogę dostosować wiadomości powitań i pożegnań?

Jasne! Możesz zmienić wiadomość, wykonując na przykład

`!config joinMessage {memberMention} **dołączył**; Został zaproszony przez **{inviterName}** (**{numInvites}** zaproszeń)`

lub

`!config leaveMessage {memberName} **wyszedł**; Został zaproszony przez **{inviterName}**`.

Jest wiele wartości których możesz użyć. Możesz zobaczyć pełną listę na stronie '[Własne wiadomości](/pl/modules/invites/custom-messages.md)'.

## Co to są "Rangi" i jak mogę ich używać?

Rangi służą do przypisywania ról osobom, które osiągną określoną liczbę zaproszeń. Na przykład. jeśli masz rolę o nazwie „@ Początkujący” i chcesz, aby osoby, które mają 5 lub więcej zaproszeń, były dodawane do tej roli, musisz utworzyć dla niej rangę: `add-rank @Początkujący 5 (jeśli chcesz opis tutaj)`. Gdy tylko ktoś zdobędzie 5 zaproszeń, zostanie automatycznie dodany do tej roli!

## Jak mogę wyłączyć bota we wszystkich kanałach oprócz jednego/niektórych?

Zabierz uprawnienie "Czytanie Wiadomości" na kanałach gdzie bot nie ma dawać odpowiedzi

## Ograniczenie: Brak zaawansowanego śledzenia przed dołączeniem bota

Zaawansowane śledzenie (kto zaprosił kogo) działa tylko po zaproszeniu bota. Bot nadal będzie wiedział, że wszyscy zaproszeni liczą po zaproszeniu, nie martw się. Brakuje tylko dodatkowych informacji i można je gromadzić tylko dla członków, którzy dołączą po zaproszeniu bota.
