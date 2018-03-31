import test from 'ava';

let compareInvites = (oldObj, newObj) => {
  let inviteCodesUsed = [];
  Object.keys(newObj).forEach(key => {
    if (newObj[key] !== 0 && oldObj[key] !== newObj[key]) {
      inviteCodesUsed.push(key);
    }
  });
  return inviteCodesUsed;
}

let getRanks = (ranks, personalInvites) => {
  let nextRank = '';
  let nextRankPointsDiff = 0;

  let newRank = null;

  ranks.some(r => {
    if (r.invitesNeeded > personalInvitesCount) {
      let role = message.guild.roles.get(r.roleid);
      if (role) {
        nextRank = role.name;
      }
      nextRankPointsDiff = r.invitesNeeded - personalInvitesCount;
      return true;
    } else {
      newRank = r;
    }
  });

  console.log(newRank);
  console.log(ranks);
}
/*
test('should work if new invite code is used', t => {
  let oldObj = {
    '123': 0
  };
  let newObj = {
    '123': 0,
    'dfs': 1
  };
  let x = compareInvites(oldObj, newObj);
  console.log(x);
  t.deepEqual(['dfs'], x);
});

test('should work if new invite code is added but other code is used', t => {
  let oldObj = {
    '123': 0
  };
  let newObj = {
    '123': 1,
    'dfs': 0
  };
  let x = compareInvites(oldObj, newObj);
  console.log(x);
  t.deepEqual(['123'], x);
});

test('should work if one code is higher', t => {
  let oldObj = {
    '123': 0
  };
  let newObj = {
    '123': 1
  };
  let x = compareInvites(oldObj, newObj);
  console.log(x);
  t.deepEqual(['123'], x);
});

test('should add both if 2 are higher', t => {
  let oldObj = {
    '123': 0
  };
  let newObj = {
    '123': 1,
    'gas': 1
  };
  let x = compareInvites(oldObj, newObj);
  console.log(x);
  t.deepEqual(['123', 'gas'], x);
});

let testOld = {
  '1': 0,
  '2': 0,
  '3': 0,
}
let testNew = {
  '2': 1,
  '3': 1,
  '4': 1,
}
*/

test('should get the right rank', t => {
  let ranks = {
    '123': 0
  };
  let newObj = {
    '123': 1,
    'gas': 1
  };
  let x = compareInvites(oldObj, newObj);
  console.log(x);
  t.deepEqual(['123', 'gas'], x);
});

let testOld = {
  '1': 0,
  '2': 0,
  '3': 0,
}
let testNew = {
  '2': 1,
  '3': 1,
  '4': 1,
}