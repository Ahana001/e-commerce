/* eslint-disable @typescript-eslint/no-explicit-any */
import knex, {Knex} from 'knex';
import dotenv from 'dotenv';
dotenv.config();

export class DB {
  static write: any;
  static read: any;
}
export async function pingdb() {
  try {
    await DB.write.raw("SELECT 'db connected' AS status");
    await DB.read.raw("SELECT 'db connected' AS status");
  } catch (error) {
    return false;
  }
  return true;
}

async function seed() {
  const seedConfig = {
    directory: __dirname + '/seeds',
  };
  console.log('Running seed...');
  await DB.write.seed.run(seedConfig).then((result: {}[][]) => {
    console.log('Ran Seed', result);
  });
  console.log('Ran seed: Finish ');
}

async function migrate() {
  const migrationConfig = {
    directory: __dirname + '/migrations',
  };
  console.log('Running migrations...');
  await DB.write.migrate.latest(migrationConfig).then((result: {}[][]) => {
    const log = result[1];
    if (!log.length) {
      console.log('Database is already up to date');
    } else {
      console.log('Ran migrations:>> ');
      for (let i = 0; i < log.length; i++) {
        console.log(i + 1 + '=> ' + log[i]);
      }
      console.log('Ran Migration Count: ', result[0]);
    }
  });
  console.log('Ran migrations: Finish ');
}

export async function connectdb() {
  try {
    console.log('Database connecting... ');

    const configOptions: Knex.Config = {
      client: 'pg',
      connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database: process.env.DB_DATABASE,
      },
      migrations: {
        directory: './data/migrations',
        schemaName: 'public',
        disableMigrationsListValidation: true,
        extension: 'js',
        loadExtensions: ['.js', '.ts'],
      },
      seeds: {
        directory: './data/seeds',
        extension: 'js',
        loadExtensions: ['.js', '.ts'],
      },
      searchPath: ['knex', 'public'],
    };
    DB.write = knex(configOptions);
    await DB.write.raw("SELECT 'write db connected' AS status");
    console.log('Write Database connected');

    (configOptions.connection as Knex.PgConnectionConfig).host =
      process.env.DB_READ_HOST;
    DB.read = knex(configOptions);
    await DB.read.raw("SELECT 'readt db connected' AS status");
    console.log('Read Database connected');
  } catch (error) {
    console.log('Database Connection Error!!');
    throw error;
  }

  try {
    await migrate();
  } catch (error) {
    console.log('Migration Error !!');
    throw error;
  }

  try {
      await seed();
  } catch (error) {
    console.log('Error in running seed', error);
    throw error;
  }
  return;
}

export async function stopDB() {
  await DB.write.destroy();
  await DB.read.destroy();
}

export async function getTransaction(): Promise<Knex.Transaction<any, any[]>> {
  const trx: Knex.Transaction = await DB.write.transaction();
  return trx;
}
