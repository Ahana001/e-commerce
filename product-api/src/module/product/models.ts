import constants from './constants';
import {DB} from '../../data/knex';
import {  IProduct } from './type';
import { Knex } from 'knex';

export function getProdcutByIds(
  ids: string[]
): Promise<IProduct[]> {
  return DB.read(constants.TableName)
    .where({is_deleted: false})
    .whereIn('id', ids)
    .select([
      constants.ColumnNames.id,
      constants.ColumnNames.description,
      constants.ColumnNames.name,
      constants.ColumnNames.price,
      constants.ColumnNames.stock
    ])
    .then((products: IProduct[]) => {
      console.log('successfully fetched product by id');
      return products;
    })
    .catch((error: Error) => {
      console.log('GOT ERROR WHILE FETCHING PRODUCT BY ID');
      console.log(error);
      throw error;
    });
}

export function getProdcutByName(
  name: string
): Promise<IProduct[]> {
  return DB.read(constants.TableName)
    .where({is_deleted: false, name: name})
    .select([
      constants.ColumnNames.id,
      constants.ColumnNames.description,
      constants.ColumnNames.name,
      constants.ColumnNames.price,
      constants.ColumnNames.stock
    ])
    .then((products: IProduct[]) => {
      console.log('successfully fetched product by name');
      return products;
    })
    .catch((error: Error) => {
      console.log('GOT ERROR WHILE FETCHING PRODUCT BY NAME');
      throw error;
    });
}

export async function createProduct(
  product: IProduct,
  trx?: Knex.Transaction
): Promise<IProduct> {
  const query = DB.write(constants.TableName)
    .insert(product)
    .returning('*');
  if (trx) {
    query.transacting(trx);
  }
  return await query
    .then((products: IProduct[]) => {
      console.log('successfully created product');
      return products[0];
    })
    .catch((error: Error) => {
      console.log('GOT ERROR WHILE CREATING PRODUCT');
      throw error;
    });
}

export function readProducts(): Promise<IProduct[]> {
  return DB.read(constants.TableName)
    .select([
      constants.ColumnNames.id,
      constants.ColumnNames.name,
      constants.ColumnNames.description,
      constants.ColumnNames.price,
      constants.ColumnNames.stock,

    ])
    .where({is_deleted: false})
    .then((products: IProduct[]) => {
      console.log('successfully fetched products');
      return products;
    })
    .catch((error: Error) => {
      console.log('GOT ERROR WHILE FETCHING PRODUCTS');
      throw error;
    });
}

export function readProductForUpdate(
  trx: Knex.Transaction,
  ids: string[]
): Promise<IProduct[]> {
  return DB.write(constants.TableName)
    .select('*')
    .where({is_deleted: false})
    .whereIn('id', ids)
    .forUpdate()
    .transacting(trx)
    .then((products: IProduct[]) => {
      console.log('successfully read product for update');
      return products;
    })
    .catch((error: Error) => {
      console.log('ERROR GENRATED WHILE FETCHING PRODUCT FOR UPDATE');
      throw error;
    });
}

export async function updateProduct(
  product: IProduct,
  trx?: Knex.Transaction
): Promise<IProduct> {
  product.updated_at = new Date();
  const query = DB.write(constants.TableName)
    .update(product)
    .returning('*')
    .where({id: product.id});
  if (trx) {
    query.transacting(trx);
  }
  return await query
    .then((products: IProduct[]) => {
      console.log('successfully updated product');
      return products[0];
    })
    .catch((error: Error) => {
      console.log('ERROR GENRATED WHILE UPDATING PRODUCT');
      throw error;
    });
}

export function deleteProduct(id: string): Promise<IProduct> {
  const product = <IProduct>{
    id: id,
    is_deleted: true,
  };
  return DB.write(constants.TableName)
    .update(product)
    .where({is_deleted: false, id: id})
    .returning('*')
    .then((products: IProduct[]) => {
      console.log('successfully deleted product');
      return products[0];
    })
    .catch((error: Error) => {
      console.log('GOT ERROR WHILE DELETING PRODUCT');
      throw error;
    });
}

export function bulkUpdateProduct(
  trx: Knex.Transaction,
  updateRows: IProduct[]
): Promise<IProduct[]> {
const subquery = `
  (SELECT *
   FROM json_to_recordset(?)
   AS x(
     id VARCHAR(255),
     stock INTEGER)
  ) AS data_table`;
  return DB.write
    .raw(
      `update ${constants.TableName}
        set stock = data_table.stock
        from  ${subquery}
        where ${constants.TableName}.id = data_table.id
        `,
      [JSON.stringify(updateRows)]
    )
    .transacting(trx)
    .then((products: IProduct[]) => {
      console.log('successfully bulk updated product');
      return products;
    })
    .catch((error: Error) => {
      console.log(error)
      console.log('GOT ERROR WHILE UPDATED PRODUCT')
      throw error;
    });
}