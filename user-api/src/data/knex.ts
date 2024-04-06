/* eslint-disable @typescript-eslint/no-explicit-any */
import knex, {Knex} from 'knex';
import dotenv from 'dotenv';
import logger from '../utilities/logger/winston_logger';
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
  logger.info('Running seed...');
  await DB.write.seed.run(seedConfig).then((result: {}[][]) => {
    logger.info('Ran Seed', result);
  });
  logger.info('Ran seed: Finish ');
}

async function migrate() {
  const migrationConfig = {
    directory: __dirname + '/migrations',
  };
  logger.info('Running migrations...');
  await DB.write.migrate.latest(migrationConfig).then((result: {}[][]) => {
    const log = result[1];
    if (!log.length) {
      logger.info('Database is already up to date');
    } else {
      logger.info('Ran migrations:>> ');
      for (let i = 0; i < log.length; i++) {
        logger.info(i + 1 + '=> ' + log[i]);
      }
      logger.info('Ran Migration Count: ', result[0]);
    }
  });
  logger.info('Ran migrations: Finish ');
}

export async function connectdb() {
  try {
    logger.info('Database connecting... ');

    const configOptions: Knex.Config = {
      client: 'pg',
      connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: +(process.env.DB_PORT ?? 5432),
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
    logger.info('Write Database connected');

    (configOptions.connection as Knex.PgConnectionConfig).host =
      process.env.DB_READ_HOST;
    DB.read = knex(configOptions);
    await DB.read.raw("SELECT 'readt db connected' AS status");
    logger.info('Read Database connected');
  } catch (error) {
    logger.error('Database Connection Error!!');
    throw error;
  }

  try {
    await migrate();
  } catch (error) {
    logger.error('Migration Error !!');
    throw error;
  }

  try {
      await seed();
  } catch (error) {
    logger.error('Error in running seed', error);
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
