import request from 'supertest';
import {Application} from 'express';
import {createTestServer} from './utilities/init';
import {
  closeTestDBConnection,
  dropTestDatabase,
  loadMockSeedData,
  signToken,
} from './utilities/utilities';
import {stopDB} from '../data/knex';

jest.mock('axios');

let server: Application;
let customer_token: string;
let admin_token: string;
const customer_id = 'CUST_1';
const customer_details = {
    name: "Ankita",
    password: "Ankita@123"
};
const existing_customer_details = {
    name: "John",
    password: "John@123"
};

beforeAll(async () => {
  server = await createTestServer();
  await loadMockSeedData('customer');
  customer_token = signToken({
    id: customer_id,
    user_type: 'customer',
  });
  admin_token = signToken({
    id: 'ADM_1',
    user_type: 'admin',
  });
});

afterAll(async () => {
  await stopDB();
  await dropTestDatabase();
  await closeTestDBConnection();
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe('customer', () => {
  describe('Registration and Login Validation',()=>{
    test('Empty username', async () => {
      const response = await request(server)
        .post('/customer/auth/register/')
        .send({
          name: '           ',
          password: 'abc@123',
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.errors).toStrictEqual([
        {
          message: '\"name\" is not allowed to be empty',
          code: 0,
        },
      ]);
    });
    test('Empty password', async () => {
      const response = await request(server)
        .post('/customer/auth/register/')
        .send({
          name: 'abc',
          password: '   ',
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.errors).toStrictEqual([
        {
          message: '\"password\" is not allowed to be empty',
          code: 0,
        },
      ]);
    });
    test('Register', async () => {
      const response = await request(server)
        .post('/customer/auth/register')
        .send(customer_details);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.result).toEqual({
      customer:  {
        created_at: expect.any(String),
        id: expect.any(String),
        is_deleted: false,
        name:customer_details.name,
        updated_at: expect.any(String),
      },
      message: 'Registration Successfully',
    });
    });
    test('Register Existing User', async () => {
      const response = await request(server)
        .post('/customer/auth/register')
        .send(existing_customer_details);
      expect(response.statusCode).toBe(409);
      expect(response.body.status).toBe(false);
      expect(response.body.errors).toEqual([
       {
        code: 0,
        message: 'User already exists, Please login',
      },
    ]
);
    });
    test('Login Non Exist User', async () => {
      const response = await request(server)
        .post('/customer/auth/login')
        .send({name: 'abc', password:'abc@123'});
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.errors).toEqual([
        {
         code: 0,
         message: 'User Does not Exist. Please Register.',
       }]);
    });
    test('Login', async () => {
      const response = await request(server)
        .post('/customer/auth/login')
        .send(existing_customer_details);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.result).toEqual({
          created_at: expect.any(String),
          id: customer_id,
          is_deleted: false,
          name: existing_customer_details.name,
          token: expect.any(String),
          updated_at: expect.any(String),
        });
    });
});

  describe('Auth {Token} Validation ', () => {
    test('unauthorized 401 status code if customer token not provided', async () => {
      const response = await request(server).get(`/customer/${customer_id}`);
      expect(response.statusCode).toBe(401);
    });
    test('Forbidden 403 status code if wrong token is provided :- Admin', async () => {
      const response = await request(server)
        .get(`/customer/${customer_id}`)
        .set('Authorization', `Bearer ${admin_token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.errors).toStrictEqual([
        {message: 'forbidden', code: 0},
      ]);
    });
    test('GET customer details by Id | Right Token', async () => {
      const response = await request(server)
        .get('/customer')
        .set('Authorization', `Bearer ${customer_token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.result.customer.name).not.toEqual(null);
      expect(response.body.result.customer.id).not.toEqual(null);

    });
  });
});
