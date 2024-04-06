import constants from './constants';
import {DB} from '../../data/knex';
import {v4 as uuidv4} from 'uuid';
import { Customer } from './type';

export function readCustomerByName(name: string): Customer {
  return DB.read(constants.TableName)
    .where({name: name})
    .where({is_deleted: false})
    .select('*')
    .then((res: Customer[]) => {
      console.log(`fetched customer successfully`);
      return res[0];
    })
    .catch((error: Error) => {
      console.log(`GOT ERROR WHILE FETCHING CUSTOMER`);
      throw error;
    });
}

export function readCustomerById(id: string): Customer {
  return DB.read(constants.TableName)
    .where({id:id})
    .where({is_deleted: false})
    .select('*')
    .then((res: Customer[]) => {
      console.log(`fetched customer successfully`);
      return res[0];
    })
    .catch((error: Error) => {
      console.log(`GOT ERROR WHILE FETCHING CUSTOMER`);
      throw error;
    });
}

export function createCustomer(customer: Customer): Customer {
  customer.id = uuidv4();
  return DB.write(constants.TableName)
    .returning('*')
    .insert(customer)
    .then((res: Customer[]) => {
      console.log('created customer successfully')
      return res[0];
    })
    .catch((error: Error) => {
      console.log('GOT ERROR WHILE CREATING CUSTOMER');
      throw error;
    });
}