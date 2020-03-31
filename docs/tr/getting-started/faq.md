# FAQs}

## Botun ön ekini nasıl değiştirebilirim?

Öneki değiştirmek için `!config prefix -` yapabilirsiniz.

Geçerli önekinizi bilmiyorsanız, öneki görmek için`@InviteManager config prefix` komtunu kullanabilirsiniz.

## Katılma ve ayrılma mesajlarını nasıl ayarlarım?

Yaparak kanalı ayarlayın

`!config joinMessageChannel #kanal`

ya da

`!config leaveMessageChannel #kanal`.

Bunu yaptıktan sonra yeni katılmalar ve ayrılmalar o kanala gönderilecek.

## Can I customize the join and leave messages?

Kesinlikle! Mesajı yaparak örneğin değiştirebilirsiniz

`! config joinMessage {memberMention} ** katıldı **; ** {inviterName} ** tarafından davet edildi (** {numInvites} ** davet yaptı)`

ya da

`! config leaveMessage {memberName} ** ayrıldı **; ** {inviterName} **`tarafından davet edilmişti.

Kullanılabilecek çok sayıda yer tutucu var. Listenin tamamını '[Custom Messages](/tr/modules/invites/custom-messages.md)' sayfasında görebilirsiniz.

## What are 'Ranks' and how can I use them?

Rütbe, belirli bir sayıda davete ulaştıklarında insanlara rol atamak için kullanılır. Örneğin. `@Başlangıçcı` adında bir rolünüz varsa ve 5 veya daha fazla daveti olan kişilerin bu role eklenmesini istiyorsanız şu şekilde bir sıralama oluşturmanız gerekir:`! add-rank @Başlangıçcı 5 (ve burada bir açıklama istersiniz)`. Birisi 5 davet alır almaz, otomatik olarak bu role eklenir!

## Bir / bazı kanallar dışındaki tüm botları nasıl devre dışı bırakabilirim?

Botun yanıt vermesini istemediğiniz kanallarda okunan mesaj izinlerini kaldırın.

## Limitation: No advanced tracking before the bot joins

Gelişmiş izleme (kim kimi davet ettiğinde) yalnızca botu davet ettikten sonra çalışır. Bot, herkesin davet ettikten sonra sayımı davet ettiğini bilecek, endişelenmeyin. Yalnızca ek bilgiler eksiktir ve yalnızca botu davet ettikten sonra katılan üyeler için toplanabilir.
