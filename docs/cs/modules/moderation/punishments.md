# Punishments

### What are punishments?

Punishments are actions like `ban`, `kick` or `mute` that can be given to a user when he violates the rules. You can either call punish users directly by using commands, or you can define punishments that happen after a user reaches a certain amount of strikes.

### How can I punish a user after reaching a certain amount of strikes?

With the `punishmentconfig` command you can set after how many strikes a certain punishment action will be given.

```text
!punishmentconfig <punishmentType> <numberOfStrikesNeeded>
```

A list of all available punishments:

- ban
- softban
- kick
- mute
- warn

So if you would like to kick a user after he reaches 5 strikes, you would have to execute the following command

```text
!punishmentconfig kick 5
```

If you want to delete a `punishmentconfig`, just set the strikes to `0` like that:

```text
!punishmentconfig kick 0
```

To see all punishment configs, just use the command without giving any arguments:

```text
!punishmentconfig
```
