const checkRoom = async (db, token) => {
  const existing = await db.RoomModel.findOne({ token });
  if (existing) 
    return true;
  else
    return false
};

const Subscription = {
  subscribeToUser : {
    async subscribe(parent, { token }, { db, localDb, pubsub }, info) {
      if (!(await checkRoom(db, token))) {
        throw new Error(`Room ${token} does not exist`);
      }
      console.log(`Subscribe to ${token}`);
      return pubsub.asyncIterator(`Subscribe users in ${token}`);
    }
  },
  subscribeToObject : {
    async subscribe(parent, { token }, { db, localDb, pubsub }, info) {
      if (!(await checkRoom(db, token))) {
        throw new Error(`Room ${token} does not exist`);
      }
      return pubsub.asyncIterator(`Subscribe objects in ${token}`);
    }
  },
};

export { Subscription as default };
