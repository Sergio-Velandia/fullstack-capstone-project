const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = 'giftlink';

let dbInstance = null;
const client = new MongoClient(url);

async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  await client.connect();
  dbInstance = client.db(dbName);

  return dbInstance;
}

module.exports = connectToDatabase;
