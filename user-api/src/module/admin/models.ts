import constants from './constants';
import {DB} from '../../data/knex';
import {v4 as uuidv4} from 'uuid';
import { Admin } from './type';
import logger from '../../utilities/logger/winston_logger';

export function readAdminByName(name: string): Admin {
  return DB.read(constants.TableName)
    .where({name: name})
    .where({is_deleted: false})
    .select('*')
    .then((res: Admin[]) => {
      logger.info(`fetched admin successfully`);
      return res[0];
    })
    .catch((error: Error) => {
      logger.error('GOT ERROR WHILE FETCHING ADMIN');
      throw error;
    });
}