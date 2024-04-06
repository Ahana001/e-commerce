import constants from './constants';
import {DB} from '../../data/knex';
import {v4 as uuidv4} from 'uuid';
import { Customer } from './type';
import logger from '../../utilities/logger/winston_logger';

export function readCustomerByName(name: string): Customer {
  return DB.read(constants.TableName)
    .where({name: name})
    .where({is_deleted: false})
    .select('*')
    .then((res: Customer[]) => {
      logger.info('fetched customer successfully');
      return res[0];
    })
    .catch((error: Error) => {
      logger.error('GOT ERROR WHILE FETCHING CUSTOMER');
      throw error;
    });
}

export function readCustomerById(id: string): Customer {
  return DB.read(constants.TableName)
    .where({id:id})
    .where({is_deleted: false})
    .select('*')
    .then((res: Customer[]) => {
      logger.info(`fetched customer successfully`);
      return res[0];
    })
    .catch((error: Error) => {
      logger.error('GOT ERROR WHILE FETCHING CUSTOMER');
      throw error;
    });
}

export function createCustomer(customer: Customer): Customer {
  customer.id = uuidv4();
  return DB.write(constants.TableName)
    .returning('*')
    .insert(customer)
    .then((res: Customer[]) => {
      logger.info('created customer successfully')
      return res[0];
    })
    .catch((error: Error) => {
      logger.error('GOT ERROR WHILE CREATING CUSTOMER');
      throw error;
    });
}