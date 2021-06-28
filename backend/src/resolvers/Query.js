const Query = {
  async room(parent, { token }, { db, localDb, pubsub }, info) {
    var room = await db.RoomModel.findOne({ token });
    room['users'] = localDb[token]['users']
    return room;
  },
};

export { Query as default };
