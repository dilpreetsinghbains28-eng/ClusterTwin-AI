const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  if (!uri || uri.includes('<username>')) {
    uri = 'mongodb://127.0.0.1:27017/clustertwin';
    console.warn('MONGO_URI is a placeholder or undefined. Will try local MongoDB first.');
  }

  // First, try connecting to the configured URI
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Could not connect to MongoDB at ${uri}: ${error.message}`);
    console.warn('Starting in-memory MongoDB server...');
  }

  // Fallback: start an in-memory MongoDB server
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: { launchTimeout: 60000 },
    });
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`MongoDB In-Memory Server Connected: ${conn.connection.host}`);
    console.warn('WARNING: Data will NOT persist after server restart.');
    return conn;
  } catch (memError) {
    console.error(`Failed to start in-memory MongoDB: ${memError.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
