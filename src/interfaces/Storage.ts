import { IGuildInvite } from '../interfaces';

export interface IInviteManagerStorage {
  lastSavedGuildInvites: IGuildInvite[]; // Cache of the last response, used to calculate the diff/who invited who
  clearInvites: { [key: string]: number }; // Key: invite code; Value: uses at the time of "!clearInvites". Will be subtracted when showing invite counts
  allInviteCodes: { [key: string]: string }; // Key: invite code; Value: UserID. Will be used to display who invited who
  members: {
    [key: string]: {
      joins: { // Save how many times a user joined
        timestamp: number;
        invitedBy: string[] // Array of invite codes. Should only be one, but if the bot is slow/offline there can be an overlap
      }[]
    }
  };
}
