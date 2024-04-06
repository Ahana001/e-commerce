import constants from './constants';
import {DB} from '../../data/knex';
import {v4 as uuidv4} from 'uuid';
import { Admin } from './type';

export function readAdminByName(name: string): Admin {
  return DB.read(constants.TableName)
    .where({name: name})
    .where({is_deleted: false})
    .select('*')
    .then((res: Admin[]) => {
      console.log(`fetched admin successfully`);
      return res[0];
    })
    .catch((error: Error) => {
      console.log(`GOT ERROR WHILE FETCHING ADMIN`);
      throw error;
    });
}