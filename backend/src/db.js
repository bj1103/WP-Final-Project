const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema({
  token: { type: String, required: true },
  objects: [{ type: mongoose.Types.ObjectId, ref: 'Object' }],
});

const objectSchema = new Schema({
  name: String,
  pos: {
    x: Number,
    y:  Number
  },
  token: String,
  type : String
});

const RoomModel = mongoose.model('Room', roomSchema);
const ObjectModel = mongoose.model('Object', objectSchema);

const db = {
  RoomModel,
  ObjectModel
};

export { db as default };

