import { connectMongoDB, connectPostgreSQL, disconnectMongoDB, disconnectPostgreSQL } from './db-connection.js';
import { A } from './models/mongodb.js';

async function benchmarkMongoDB() {
  console.log('\n=== MongoDB Aggregation Lookup Benchmark ===');
  
  const iterations = 100;
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    
    await A.aggregate([
      {
        $lookup: {
          from: 'bs',
          localField: '_id',
          foreignField: 'aId',
          as: 'b_data'
        }
      },
      {
        $unwind: {
          path: '$b_data',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $lookup: {
          from: 'cs',
          localField: 'b_data._id',
          foreignField: 'bId',
          as: 'c_data'
        }
      },
      {
        $unwind: {
          path: '$c_data',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $lookup: {
          from: 'ds',
          localField: 'c_data._id',
          foreignField: 'cId',
          as: 'd_data'
        }
      },
      {
        $unwind: {
          path: '$d_data',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $lookup: {
          from: 'es',
          localField: 'd_data._id',
          foreignField: 'dId',
          as: 'e_data'
        }
      },
      {
        $unwind: {
          path: '$e_data',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $lookup: {
          from: 'fs',
          localField: 'e_data._id',
          foreignField: 'eId',
          as: 'f_data'
        }
      },
      {
        $unwind: {
          path: '$f_data',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $lookup: {
          from: 'gs',
          localField: 'f_data._id',
          foreignField: 'fId',
          as: 'g_data'
        }
      },
      {
        $unwind: {
          path: '$g_data',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $limit: 100
      }
    ]).exec();
    
    const endTime = performance.now();
    times.push(endTime - startTime);
    
    if ((i + 1) % 10 === 0) {
      console.log(`Progress: ${i + 1}/${iterations} iterations completed`);
    }
  }
  
  return calculateStats(times);
}

async function benchmarkPostgreSQL(pool) {
  console.log('\n=== PostgreSQL JOIN Benchmark ===');
  
  const iterations = 100;
  const times = [];
  
  const query = `
    SELECT 
      a.*, 
      b.name as b_name, b.value as b_value,
      c.name as c_name, c.value as c_value,
      d.name as d_name, d.value as d_value,
      e.name as e_name, e.value as e_value,
      f.name as f_name, f.value as f_value,
      g.name as g_name, g.value as g_value
    FROM a
    INNER JOIN b ON a.id = b.a_id
    INNER JOIN c ON b.id = c.b_id
    INNER JOIN d ON c.id = d.c_id
    INNER JOIN e ON d.id = e.d_id
    INNER JOIN f ON e.id = f.e_id
    INNER JOIN g ON f.id = g.f_id
    LIMIT 100
  `;
  
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    
    await pool.query(query);
    
    const endTime = performance.now();
    times.push(endTime - startTime);
    
    if ((i + 1) % 10 === 0) {
      console.log(`Progress: ${i + 1}/${iterations} iterations completed`);
    }
  }
  
  return calculateStats(times);
}

function calculateStats(times) {
  const sortedTimes = [...times].sort((a, b) => a - b);
  const sum = times.reduce((acc, val) => acc + val, 0);
  const avg = sum / times.length;
  const min = sortedTimes[0];
  const max = sortedTimes[sortedTimes.length - 1];
  const median = sortedTimes[Math.floor(sortedTimes.length / 2)];
  const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
  const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
  
  return {
    avg,
    min,
    max,
    median,
    p95,
    p99,
    totalTime: sum
  };
}

function printResults(mongoStats, pgStats) {
  console.log('\n=== BENCHMARK RESULTS ===\n');
  
  console.log('MongoDB Aggregation Lookup:');
  console.log(`  Average: ${mongoStats.avg.toFixed(2)}ms`);
  console.log(`  Min: ${mongoStats.min.toFixed(2)}ms`);
  console.log(`  Max: ${mongoStats.max.toFixed(2)}ms`);
  console.log(`  Median: ${mongoStats.median.toFixed(2)}ms`);
  console.log(`  95th Percentile: ${mongoStats.p95.toFixed(2)}ms`);
  console.log(`  99th Percentile: ${mongoStats.p99.toFixed(2)}ms`);
  console.log(`  Total Time: ${mongoStats.totalTime.toFixed(2)}ms`);
  
  console.log('\nPostgreSQL JOIN:');
  console.log(`  Average: ${pgStats.avg.toFixed(2)}ms`);
  console.log(`  Min: ${pgStats.min.toFixed(2)}ms`);
  console.log(`  Max: ${pgStats.max.toFixed(2)}ms`);
  console.log(`  Median: ${pgStats.median.toFixed(2)}ms`);
  console.log(`  95th Percentile: ${pgStats.p95.toFixed(2)}ms`);
  console.log(`  99th Percentile: ${pgStats.p99.toFixed(2)}ms`);
  console.log(`  Total Time: ${pgStats.totalTime.toFixed(2)}ms`);
  
  console.log('\n=== COMPARISON ===');
  const avgRatio = mongoStats.avg / pgStats.avg;
  console.log(`Average Time Ratio (MongoDB/PostgreSQL): ${avgRatio.toFixed(2)}x`);
  
  if (avgRatio > 1) {
    console.log(`PostgreSQL is ${avgRatio.toFixed(2)}x faster on average`);
  } else {
    console.log(`MongoDB is ${(1/avgRatio).toFixed(2)}x faster on average`);
  }
}

async function main() {
  try {
    console.log('Starting benchmark...\n');
    console.log('Connecting to databases...');
    
    await connectMongoDB();
    const pgPool = await connectPostgreSQL();
    
    console.log('\nWarming up databases...');
    await A.findOne();
    await pgPool.query('SELECT 1');
    
    const mongoStats = await benchmarkMongoDB();
    const pgStats = await benchmarkPostgreSQL(pgPool);
    
    printResults(mongoStats, pgStats);
    
    await disconnectMongoDB();
    await disconnectPostgreSQL(pgPool);
    
    console.log('\nBenchmark completed!');
  } catch (error) {
    console.error('Error during benchmark:', error);
    process.exit(1);
  }
}

main();