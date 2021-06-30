const Query = {
  async room(parent, { token }, { db, localDb, pubsub }, info) {
    console.log(`Query ${token}`)
    var room = await db.RoomModel.findOne({ token });
    room['users'] = localDb[token]['users']
    return room;
  },
  getCharacter(parent, { token, characters }, { db, localDb, pubsub }, info) {
    console.log(`Query ${token}'s characters`)
    // console.log(characters.keys())
    var available = new Array(characters.length).fill(1);
    for (var i = 0; i < available.length; i++) {
      if (localDb[token]['users'].findIndex(ele => ele.character == characters[i]) != -1) {
        available[i] = 0;
      }
    }
    var availableCharacter = []
    for (var i = 0; i < available.length; i++) {
      if (available[i]) {
        availableCharacter.push(characters[i])
      }
    }
    console.log('return ', availableCharacter);
    return availableCharacter;
  },
};

export { Query as default };
