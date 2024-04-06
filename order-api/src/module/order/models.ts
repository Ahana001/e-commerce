import { IOrder } from "./type";
import constants from './constants';
import {DB} from '../../data/knex';
import { Knex } from "knex";

export async function readOrdersAsAdmin(
  order_ids: number[]
): Promise<IOrder[]> {
  return DB.read(constants.TableName)
    .whereIn('id', order_ids)
    .select('*')
    .then((orders: IOrder[]) => {
      console.log('successfully fetched order as admin');
      return orders;
    })
    .catch((error: Error) => {
      throw error;
    });
}

export async function readCustomerOrders(
  order_ids: number[],
  customer_id: string
) {
  return DB.read(constants.TableName)
    .whereIn('id', order_ids)
    .where('customer_id', customer_id)
    .select('*')
    .then((orders: IOrder[]) => {
      console.log('successfully fetched customer orders');
      return orders;
    })
    .catch((error: Error) => {
      throw error;
    });
}

export async function bulkInsertOrder(
  trx: Knex.Transaction,
  insertRows: IOrder[]
): Promise<IOrder> {
  return DB.write(constants.TableName)
    .insert(insertRows)
    .returning('*')
    .transacting(trx)
    .then((order: IOrder[]) => {
    console.log('successfully bulk inserted order');
      return order[0];
    })
    .catch((error: Error) => {
      console.log('GOT ERROR WHILE INSERTING DATA IN ORDER TABLE')
      throw error;
    });
}

export function updateOrder(
  trx: Knex.Transaction,
  updatedOrder: IOrder
): Promise<IOrder> {
  updatedOrder.updated_at = new Date();
  return DB.write(constants.TableName)
    .update(updatedOrder)
    .returning('*')
    .where({id: updatedOrder.id})
    .transacting(trx)
    .then((order: IOrder[]) => {
      console.log('successfully updated order');
      return order[0];
    })
    .catch((error: Error) => {
      console.log('GOT ERROR WHILE UPDATING DATA IN ORDER TABLE')
      throw error;
    });
}

export function readOrderForUpdate(
  trx: Knex.Transaction,
  id: string
): Promise<IOrder> {
  return DB.write(constants.TableName)
    .select('*')
    .where({id: id})
    .forUpdate()
    .transacting(trx)
    .then((orders: IOrder[]) => {
      console.log('successfully read order for update');
      return orders[0];
    })
    .catch((error: Error) => {
      console.log(error)
      console.log('ERROR GENRATED WHILE FETCHING ORDER FOR UPDATE');
      throw error;
    });
}