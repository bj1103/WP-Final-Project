import uuidv4 from 'uuid/v4';

const checkRoom = async (db, token) => {
  const existing = await db.RoomModel.findOne({ token });
  if (existing) 
    return true;
  else
    return false
};

const directionVector = {'UP' : [0, -1], 'DOWN' : [0, 1], 'RIGHT' : [1, 0], 'LEFT' : [-1, 0]}

const Mutation = {
  async createRoom(parent, { token }, { db, localDb, pubsub }, info) {
    if (!token)
      throw new Error("Missing room token for createRoom");

    if (await checkRoom(db, token)) {
      throw new Error(`Room ${token} already exists`);
    }

    var room = await new db.RoomModel({ token }).save();
    // room = room.populate('objects').execPopulate();

    localDb[token] = { 'users': [] }
    room['users'] = localDb[token]['users']
    return room;
  },

  async login(parent, { token, name }, { db, localDb, pubsub }, info) {
    if (!token)
      throw new Error("Missing room token for createRoom");

    if (!name)
      throw new Error("Missing user name");

    if (!(await checkRoom(db, token))) {
      throw new Error(`Room ${token} does not exist`);
    }
    
    if (localDb[token]['users'].findIndex(user => user['name'] == name) != -1) {
      throw new Error(`Username ${name} has been used`);
    }

    var user = {
      'id': uuidv4(),
      'name': name,
      'pos' : {
        x : 0,
        z : 0,
      }
    }

    localDb[token]['users'].push(user)
    pubsub.publish(`Subscribe users in ${token}`, {subscribeToUser : user});

    return user['pos']
  },

  move(parent, { token, name, direction }, { db, localDb, pubsub }, info) {
    // if (!token)
    //   throw new Error("Missing room token for createRoom");

    // if (!name)
    //   throw new Error("Missing user name");

    // if (!direction)
    //   throw new Error("Missing user direction");

    // if (!(await checkRoom(db, token))) {
    //   throw new Error(`Room ${token} does not exist`);
    // }
    var userIndex = localDb[token]['users'].findIndex(user => user['name'] == name);
    var user = localDb[token]['users'][userIndex]

    if (userIndex == -1) {
      throw new Error(`User ${name} does not exist`);
    }
    var newPos = {
      'x' : user['pos']['x'] + directionVector[direction][0],
      'z' : user['pos']['z'] + directionVector[direction][1]
    }
    user['pos'] = newPos;
    localDb[token]['users'][userIndex] = user
    pubsub.publish(`Subscribe users in ${token}`, {subscribeToUser : user});
    return newPos
  },
  
  async createObject(parent, { token, type, pos }, { db, localDb, pubsub }, info) {
    if (!token)
      throw new Error("Missing room token for createRoom");

    if (!(await checkRoom(db, token))) {
      throw new Error(`Room ${token} does not exist`);
    }
    
    var furniture = await db.ObjectModel.findOne({ pos, token })
    if (furniture) {
      furniture = await db.ObjectModel.findOneAndUpdate({ pos, token }, {$set:{ type, pos, token }}, {new: true});
      pubsub.publish(`Subscribe objects in ${token}`, {subscribeToObject : furniture});
      return furniture;
    }
    else {
      furniture = await new db.ObjectModel({ type, pos, token }).save();
      var room = await db.RoomModel.findOne({ token });
      room.objects.push(furniture);
      await room.save();
      var room = await db.RoomModel.findOne({ token });
      pubsub.publish(`Subscribe objects in ${token}`, {subscribeToObject : furniture});
      return furniture;
    }
  },
};

export { Mutation as default };
