import { connectMongoDB, connectPostgreSQL, disconnectMongoDB, disconnectPostgreSQL } from './db-connection.js';
import { A, B, C, D, E, F, G } from './models/mongodb.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RECORDS_PER_TABLE = 10000;

async function seedMongoDB() {
  console.log('Starting MongoDB seeding...');
  
  await A.deleteMany({});
  await B.deleteMany({});
  await C.deleteMany({});
  await D.deleteMany({});
  await E.deleteMany({});
  await F.deleteMany({});
  await G.deleteMany({});
  
  const aRecords = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const a = await A.create({
      name: `A_Record_${i}`,
      value: Math.floor(Math.random() * 1000)
    });
    aRecords.push(a);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in collection A`);

  const bRecords = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomA = aRecords[Math.floor(Math.random() * aRecords.length)];
    const b = await B.create({
      aId: randomA._id,
      name: `B_Record_${i}`,
      value: Math.floor(Math.random() * 1000)
    });
    bRecords.push(b);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in collection B`);

  const cRecords = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomB = bRecords[Math.floor(Math.random() * bRecords.length)];
    const c = await C.create({
      bId: randomB._id,
      name: `C_Record_${i}`,
      value: Math.floor(Math.random() * 1000)
    });
    cRecords.push(c);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in collection C`);

  const dRecords = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomC = cRecords[Math.floor(Math.random() * cRecords.length)];
    const d = await D.create({
      cId: randomC._id,
      name: `D_Record_${i}`,
      value: Math.floor(Math.random() * 1000)
    });
    dRecords.push(d);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in collection D`);

  const eRecords = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomD = dRecords[Math.floor(Math.random() * dRecords.length)];
    const e = await E.create({
      dId: randomD._id,
      name: `E_Record_${i}`,
      value: Math.floor(Math.random() * 1000)
    });
    eRecords.push(e);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in collection E`);

  const fRecords = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomE = eRecords[Math.floor(Math.random() * eRecords.length)];
    const f = await F.create({
      eId: randomE._id,
      name: `F_Record_${i}`,
      value: Math.floor(Math.random() * 1000)
    });
    fRecords.push(f);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in collection F`);

  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomF = fRecords[Math.floor(Math.random() * fRecords.length)];
    await G.create({
      fId: randomF._id,
      name: `G_Record_${i}`,
      value: Math.floor(Math.random() * 1000)
    });
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in collection G`);
  
  console.log('MongoDB seeding completed!');
}

async function seedPostgreSQL(pool) {
  console.log('Starting PostgreSQL seeding...');
  
  const sqlSchema = fs.readFileSync(path.join(__dirname, 'models/postgresql.sql'), 'utf-8');
  await pool.query(sqlSchema);
  console.log('PostgreSQL schema created');
  
  await pool.query('DELETE FROM g');
  await pool.query('DELETE FROM f');
  await pool.query('DELETE FROM e');
  await pool.query('DELETE FROM d');
  await pool.query('DELETE FROM c');
  await pool.query('DELETE FROM b');
  await pool.query('DELETE FROM a');
  
  const aIds = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const result = await pool.query(
      'INSERT INTO a (name, value) VALUES ($1, $2) RETURNING id',
      [`A_Record_${i}`, Math.floor(Math.random() * 1000)]
    );
    aIds.push(result.rows[0].id);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in table a`);

  const bIds = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomAId = aIds[Math.floor(Math.random() * aIds.length)];
    const result = await pool.query(
      'INSERT INTO b (a_id, name, value) VALUES ($1, $2, $3) RETURNING id',
      [randomAId, `B_Record_${i}`, Math.floor(Math.random() * 1000)]
    );
    bIds.push(result.rows[0].id);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in table b`);

  const cIds = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomBId = bIds[Math.floor(Math.random() * bIds.length)];
    const result = await pool.query(
      'INSERT INTO c (b_id, name, value) VALUES ($1, $2, $3) RETURNING id',
      [randomBId, `C_Record_${i}`, Math.floor(Math.random() * 1000)]
    );
    cIds.push(result.rows[0].id);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in table c`);

  const dIds = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomCId = cIds[Math.floor(Math.random() * cIds.length)];
    const result = await pool.query(
      'INSERT INTO d (c_id, name, value) VALUES ($1, $2, $3) RETURNING id',
      [randomCId, `D_Record_${i}`, Math.floor(Math.random() * 1000)]
    );
    dIds.push(result.rows[0].id);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in table d`);

  const eIds = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomDId = dIds[Math.floor(Math.random() * dIds.length)];
    const result = await pool.query(
      'INSERT INTO e (d_id, name, value) VALUES ($1, $2, $3) RETURNING id',
      [randomDId, `E_Record_${i}`, Math.floor(Math.random() * 1000)]
    );
    eIds.push(result.rows[0].id);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in table e`);

  const fIds = [];
  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomEId = eIds[Math.floor(Math.random() * eIds.length)];
    const result = await pool.query(
      'INSERT INTO f (e_id, name, value) VALUES ($1, $2, $3) RETURNING id',
      [randomEId, `F_Record_${i}`, Math.floor(Math.random() * 1000)]
    );
    fIds.push(result.rows[0].id);
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in table f`);

  for (let i = 0; i < RECORDS_PER_TABLE; i++) {
    const randomFId = fIds[Math.floor(Math.random() * fIds.length)];
    await pool.query(
      'INSERT INTO g (f_id, name, value) VALUES ($1, $2, $3)',
      [randomFId, `G_Record_${i}`, Math.floor(Math.random() * 1000)]
    );
  }
  console.log(`Created ${RECORDS_PER_TABLE} records in table g`);
  
  console.log('PostgreSQL seeding completed!');
}

async function main() {
  try {
    await connectMongoDB();
    const pgPool = await connectPostgreSQL();
    
    await seedMongoDB();
    await seedPostgreSQL(pgPool);
    
    await disconnectMongoDB();
    await disconnectPostgreSQL(pgPool);
    
    console.log('\nSeeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();