import request from 'supertest';
import {Application} from 'express';
import {createTestServer} from './utilities/init';
import {
  closeTestDBConnection,
  dropTestDatabase,
  loadMockSeedData,
  signToken,
} from './utilities/utilities';
import {DB, stopDB} from '../data/knex';

jest.mock('axios');

let server: Application;
let customer_token: string;
let admin_token: string;
const customer_id = 'CUST_1';
const admin_id = 'ADM_1';
const product = {
    name: 'ball',
    stock: 200,
    description: 'ball',
    price: 50
};

beforeAll(async () => {
  server = await createTestServer();
  await loadMockSeedData('product');
  customer_token = signToken({
    id: customer_id,
    user_type: 'customer',
  });
  admin_token = signToken({
    id: admin_id,
    user_type: 'admin',
  })
});

afterAll(async () => {
  await stopDB();
  await dropTestDatabase();
  await closeTestDBConnection();
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe('Testing Product', () => {
  let product_id;
    describe('POST Product', () => {
      test('Request Wtih Empty name', async () => {
        const response = await request(server)
          .post('/admin/')
          .set('Authorization', `Bearer ${admin_token}`)
          .send({
            price: 200,
            stock: 20,
            name: '   ',
          });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.errors).toStrictEqual([
          {message: '"name" is not allowed to be empty', code: 0},
        ]);
      });
      test('Request Wtih No price', async () => {
        const response = await request(server)
          .post('/admin/')
          .set('Authorization', `Bearer ${admin_token}`)
          .send({
            stock: 20,
            name: 'Ball',
          });
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.errors).toStrictEqual([
          {message: '\"price\" is required', code: 0},
        ]);
      });
      test('Successfull Request', async () => {
        const response = await request(server)
          .post('/admin/')
          .set('Authorization', `Bearer ${admin_token}`)
          .send(product);
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe(true);
        expect(response.body.result).toEqual({
            created_at: expect.any(String),
            id: "PROD_1000",
            is_deleted: false,
            ...product,
            price: "50.00",
            updated_at: expect.any(String),
          });
        product_id = response.body.result.id;
      });
       test('Failed Create Request >> duplicate name', async () => {
        const response = await request(server)
          .post('/admin/')
          .set('Authorization', `Bearer ${admin_token}`)
          .send(product);
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.errors).toEqual([ { message: 'Duplicate Product Name', code: 0 } ]);
      });
    });
    describe('DELETE Product', () => {
      test('Successfull', async () => {
        const product = await DB.read('product').where({id: product_id});
        expect(product[0].id).toBe(product_id);

        const response = await request(server)
          .delete(`/admin/${product_id}`)
          .set('Authorization', `Bearer ${admin_token}`)
          .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(true);

        const updated_product = DB.read('product').where({id:product_id});
        expect(updated_product[0]).toBeUndefined();
      });
    });
});