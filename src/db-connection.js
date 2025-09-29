import mongoose from 'mongoose';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function connectPostgreSQL() {
  const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URI,
  });

  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected successfully');
    return pool;
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
}

export async function disconnectMongoDB() {
  await mongoose.connection.close();
  console.log('MongoDB disconnected');
}

export async function disconnectPostgreSQL(pool) {
  await pool.end();
  console.log('PostgreSQL disconnected');
}