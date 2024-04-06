import { Knex } from "knex";
import { IOrderProduct } from "./type";
import constants from './constants';
import {DB} from '../../../data/knex';

export async function bulkInsertOrderProduct(
  trx: Knex.Transaction,
  insertRows: IOrderProduct[]
): Promise<IOrderProduct[]> {
  return DB.write(constants.TableName)
    .insert(insertRows)
    .returning('*')
    .transacting(trx)
    .then((order_product: IOrderProduct[]) => {
      console.log('successfully bulk inserted order product');
      return order_product;
    })
    .catch((error: Error) => {
      console.log(`GOT ERROR WHILE INSERTING DATA IN ORDER PRODUCTS TABLE: ${error}`)
      throw error;
    });
}