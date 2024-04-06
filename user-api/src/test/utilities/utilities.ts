import jwt from 'jsonwebtoken';
import {connectdb} from '../../data/knex';
import {DB} from '../../data/knex';
import fs from 'fs';

const knex = require('knex')({
  client: 'pg',
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    charset: 'utf8',
  },
});

/**
 * use this function to generate fake user tokens
 */
export function signToken(entity: {}) {
  return jwt.sign(entity, process.env.JWT_ACCESS_PRIVATE_KEY, {
    algorithm: 'RS256',
  });
}

export function expireToken(entity: {}) {
  return jwt.sign(entity, process.env.JWT_ACCESS_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '1ms',
  });
}

export async function createEmptyTestDatabase() {
  try {
    await connectdb();
    console.log('-- Test Database already exists, Dropping current DB and creating new instance ---')
    await knex.raw(
      `DROP DATABASE ${process.env.DB_DATABASE || 'user_test_db'}  WITH (FORCE)`
    );
    await knex.raw(
      `CREATE DATABASE ${process.env.DB_DATABASE || 'user_test_db'}`
    );
    await connectdb();
  } catch (error) {
    console.log('-- Test Database does not exits, creating new database --');
    await knex.raw(
      `CREATE DATABASE ${process.env.DB_DATABASE || 'user_test_db'}`
    );
    await connectdb();
  }
}
export async function closeTestDBConnection() {
  await knex.destroy();
}

export async function dropTestDatabase() {
  await knex.raw(
    `DROP DATABASE ${process.env.DB_DATABASE || 'user_test_db'}  WITH (FORCE)`
  );
}

/**
 * Provide the sql file name and call this function in jest-beforeAll() to setup database
 */
export async function loadMockSeedData(sqlDumpName: string) {
  await DB.write.raw(
    fs.readFileSync(`src/test/seed/${sqlDumpName}.sql`).toString()
  );
  console.log('~~~~MOCK DATA READY~~~~')
}

export async function loadMockSeedDataFromPath(path: string) {
  await DB.write.raw(fs.readFileSync(path).toString());
  console.log('~~~~MOCK DATA READY~~~~');
}
