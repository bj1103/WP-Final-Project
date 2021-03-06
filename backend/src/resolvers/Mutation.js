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
  async createRoom(parent, { token, name, character }, { db, localDb, pubsub }, info) {
    console.log(`create room ${token}`)
    if (!token)
      throw new Error("Missing room token for createRoom");

    if (await checkRoom(db, token)) {
      throw new Error(`Room ${token} already exists`);
    }

    var room = await new db.RoomModel({ token }).save();
    // room = room.populate('objects').execPopulate();
    var user = {
      'id': uuidv4(),
      'name': name,
      'pos' : {
        x : 0,
        z : 0,
      },
      'character': character,
      'message' : ""
    }
    localDb[token] = { 'users': [user] }
    room['users'] = localDb[token]['users']
    return room;
  },

  async login(parent, { token, name, character }, { db, localDb, pubsub }, info) {
    console.log(`login from ${name} to room ${token} as ${character}`)
    if (!token)
      throw new Error("Missing room token for createRoom");

    if (!name)
      throw new Error("Missing user name");

    if (!(await checkRoom(db, token))) {
      throw new Error(`Room ${token} does not exist`);
    }
    var index = localDb[token]['users'].findIndex(user => user['name'] == name);
    if (index != -1) {
      // throw new Error(`Username ${name} has been used`);
      var user = {
        'id': localDb[token]['users'][index]['id'],
        'name': name,
        'pos' : {
          x : 0,
          z : 0,
        },
        'character': character,
        'message' : ""
      }
      localDb[token]['users'][index] = user;
      pubsub.publish(`Subscribe users in ${token}`, {subscribeToUser : user});
      return user['pos']
    } 
    else {
      var user = {
        'id': uuidv4(),
        'name': name,
        'pos' : {
          x : 0,
          z : 0,
        },
        'character': character,
        'message' : ""
      }
      localDb[token]['users'].push(user)
      pubsub.publish(`Subscribe users in ${token}`, {subscribeToUser : user});
      return user['pos']
    }
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
    console.log(`${name} move ${direction} in room ${token}`)
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
  
  async createObject(parent, { token, type, posX, posZ }, { db, localDb, pubsub }, info) {
    console.log(`add objects ${type} in room ${token}`)
    var pos = { x : posX, z : posZ }
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
  async deleteObject(parent, { token, posX, posZ }, { db, localDb, pubsub }, info) {
    console.log(`clean objects in room ${token}`)
    var pos = { x : posX, z : posZ }
    if (!token)
      throw new Error("Missing room token for createRoom");

    if (!(await checkRoom(db, token))) {
      throw new Error(`Room ${token} does not exist`);
    }
    try {
      var deleteObject = await db.ObjectModel.findOne({ pos, token });
      var deleteId = deleteObject['id'];
      var room = await db.RoomModel.findOne({ token });
      // console.log(room.objects)

      var index = room.objects.findIndex(x => x == deleteId);
      room.objects.splice(index, 1);
      // console.log(room.objects)
      await db.ObjectModel.deleteOne({ pos, token })
      await db.RoomModel.updateOne({ token }, {$set:{ token:token, objects:room.objects }}, {new: true});
      return true;
    }
    catch (e) {
      throw new Error(`Delete error, ${e}`);
    }
  },
  async sendMessage(parent, { token, name, message }, { db, localDb, pubsub }, info) {
    console.log(`sendMessage ${message} from ${name} to room ${token}`)
    if (!token)
      throw new Error("Missing room token for createRoom");

    if (!name)
      throw new Error("Missing user name");

    if (!(await checkRoom(db, token))) {
      throw new Error(`Room ${token} does not exist`);
    }
    var index = localDb[token]['users'].findIndex(user => user['name'] == name);
    if (index != -1) {
      // throw new Error(`Username ${name} has been used`);
      var user = {
        'id': localDb[token]['users'][index]['id'],
        'name': localDb[token]['users'][index]['name'],
        'pos' : {
          x : localDb[token]['users'][index]['pos']['x'],
          z : localDb[token]['users'][index]['pos']['z'],
        },
        'character': localDb[token]['users'][index]['character'],
        'message' : message
      }
      localDb[token]['users'][index] = user;
      pubsub.publish(`Subscribe users in ${token}`, {subscribeToUser : user});
      return message
    } 
    else {
      throw new Error(`${name} does not exist`);
    }
  },
};

export { Mutation as default };
