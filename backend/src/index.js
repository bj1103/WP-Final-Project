import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import Subscription from './resolvers/Subscription';
import Room from './resolvers/Room';
import mongoose from 'mongoose'

const pubsub = new PubSub();

const dboptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  auto_reconnect: true,
  useUnifiedTopology: true,
  poolSize: 10
}

var localDb = {}

require('dotenv-defaults').config();
mongoose.connect(process.env.MONGO_URL, dboptions).then(async () => {
  const existing = await db.RoomModel.find({});
  for (var i = 0; i < existing.length; i = i + 1) {
    localDb[existing[i].token] = { 'users': [] }
  }
})

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Room,
  },
  context: {
    db,
    localDb,
    pubsub,
  },
});

server.start({ port: process.env.PORT | 8789 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 8789}!`);
});
