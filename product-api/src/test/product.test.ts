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

describe('Testing Product', () => {
    describe('POST Product', () => {
      test('Request Wtih Empty name', async () => {
        const response = await request(server)
          .post('/product/admin/')
          .set('Authorization', `Bearer ${admin_token}`)
          .send({
            price: 200,
            stock: 20,
            name: '   ',
          });
        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe(false);
        expect(response.body.errors).toStrictEqual([
          {message: '"name" is not allowed to be empty', code: 0},
        ]);
      });
      test('Request Wtih No price', async () => {
        const response = await request(server)
          .post('/product/admin/')
          .set('Authorization', `Bearer ${admin_token}`)
          .send({
            stock: 20,
            name: '   ',
          });
        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe(false);
        expect(response.body.errors).toStrictEqual([
          {message: '"price" is not allowed to be empty', code: 0},
        ]);
      });
    //   test('Successfull Create Request', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .post('/food/admin/menu/main_category')
    //       .set('Authorization', `Bearer ${admin_token}`)
    //       .send({
    //         restaurant_id: menu_valid_restaurant_id,
    //         name: 'Soft-Drinks',
    //       });
    //     expect(response.statusCode).toBe(201);
    //     expect(response.body.status).toBe(true);
    //     delete response.body.result.created_at;
    //     delete response.body.result.updated_at;
    //     expect(response.body.result).toStrictEqual({
    //       id: 1,
    //       name: 'Soft-Drinks',
    //       restaurant_id: menu_valid_restaurant_id,
    //       is_deleted: false,
    //     });
    //     const read_main_category = await DB.read('main_category');
    //     expect(read_main_category[0].id).toBe(1);
    //     expect(read_main_category[0].name).toBe('Soft-Drinks');
    //     expect(read_main_category[0].restaurant_id).toBe(
    //       menu_valid_restaurant_id
    //     );
    //     expect(read_main_category[0].is_deleted).toBe(false);
    //   });
    //   test('Failed Create Request >> duplicate name', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .post('/food/admin/menu/main_category')
    //       .set('Authorization', `Bearer ${admin_token}`)
    //       .send({
    //         restaurant_id: menu_valid_restaurant_id,
    //         name: 'Soft-Drinks',
    //       });
    //     expect(response.statusCode).toBe(400);
    //     expect(response.body.status).toBe(false);
    //     expect(response.body.errors).toStrictEqual([
    //       {
    //         message: 'Duplicate Main Category Name',
    //         code: 0,
    //       },
    //     ]);
    //   });
    });
    // describe('GET Main Category', () => {
    //   test('GET | Send Invalid Restaurnat ID | When Not Found Return Empty', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .get(
    //         `/food/admin/menu/main_category?restaurant_id=${menu_invalid_restaurant_id}`
    //       )
    //       .set('Authorization', `Bearer ${admin_token}`);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.status).toBe(true);
    //     expect(response.body.result).toStrictEqual([]);
    //   });
    //   test('Successfull Get Request', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .get(
    //         `/food/admin/menu/main_category?restaurant_id=${menu_valid_restaurant_id}`
    //       )
    //       .set('Authorization', `Bearer ${admin_token}`);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.status).toBe(true);
    //     expect(response.body.result).toStrictEqual([
    //       {
    //         id: 1,
    //         restaurant_id: menu_valid_restaurant_id,
    //         name: 'Soft-Drinks',
    //       },
    //     ]);
    //     const read_main_category = await DB.read('main_category');
    //     expect(read_main_category[0].id).toBe(1);
    //     expect(read_main_category[0].name).toBe('Soft-Drinks');
    //     expect(read_main_category[0].restaurant_id).toBe(
    //       menu_valid_restaurant_id
    //     );
    //     expect(read_main_category[0].is_deleted).toBe(false);
    //   });
    // });
    // describe('PUT Main Category', () => {
    //   test('PUT | Send Invalid main_category_id', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .put('/food/admin/menu/main_category/20')
    //       .set('Authorization', `Bearer ${admin_token}`)
    //       .send({
    //         name: 'Beverages',
    //       });
    //     expect(response.statusCode).toBe(404);
    //     expect(response.body.status).toBe(false);
    //     expect(response.body.errors).toStrictEqual([
    //       {message: 'Main Category Not Found', code: 0},
    //     ]);
    //   });
    //   test('Successfull Update Request', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .put('/food/admin/menu/main_category/1')
    //       .set('Authorization', `Bearer ${admin_token}`)
    //       .send({
    //         name: 'Beverages',
    //       });
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.status).toBe(true);
    //     delete response.body.result.created_at;
    //     delete response.body.result.updated_at;
    //     expect(response.body.result).toStrictEqual({
    //       id: 1,
    //       name: 'Beverages',
    //       restaurant_id: menu_valid_restaurant_id,
    //       is_deleted: false,
    //     });
    //     const read_main_category = await DB.read('main_category');
    //     expect(read_main_category[0].id).toBe(1);
    //     expect(read_main_category[0].name).toBe('Beverages');
    //     expect(read_main_category[0].restaurant_id).toBe(
    //       menu_valid_restaurant_id
    //     );
    //     expect(read_main_category[0].is_deleted).toBe(false);
    //   });
    // });
    // describe('POST Main Category', () => {
    //   test('Successfull Create Request', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .post('/food/admin/menu/main_category')
    //       .set('Authorization', `Bearer ${admin_token}`)
    //       .send({
    //         restaurant_id: '77e53c1f-6e9e-4724-9ba7-92edc69cff6b',
    //         name: 'Soft-Drinks',
    //       });
    //     expect(response.statusCode).toBe(201);
    //     expect(response.body.status).toBe(true);
    //     delete response.body.result.created_at;
    //     delete response.body.result.updated_at;
    //     expect(response.body.result).toStrictEqual({
    //       id: 2,
    //       name: 'Soft-Drinks',
    //       restaurant_id: '77e53c1f-6e9e-4724-9ba7-92edc69cff6b',
    //       is_deleted: false,
    //     });
    //     const read_main_category = await DB.read('main_category');
    //     expect(read_main_category[1].id).toBe(2);
    //     expect(read_main_category[1].name).toBe('Soft-Drinks');
    //     expect(read_main_category[1].restaurant_id).toBe(
    //       menu_valid_restaurant_id
    //     );
    //     expect(read_main_category[1].is_deleted).toBe(false);
    //   });
    // });
    // describe('POST Holiday Slot', () => {
    //   test('Invalid Main Category', async () => {
    //     mockgetAdminDetails();
    //     const epoch = Math.floor(new Date().getTime() / 1000) + 86400;
    //     const response = await request(server)
    //       .post('/food/admin/menu/main_category/20/createHolidaySlot')
    //       .set('Authorization', `Bearer ${admin_token}`)
    //       .send({
    //         end_epoch: epoch,
    //       });
    //     expect(response.statusCode).toBe(404);
    //     expect(response.body.status).toBe(false);
    //     expect(response.body.errors).toStrictEqual([
    //       {message: 'Main-Category Not Found', code: 0},
    //     ]);
    //   });
    //   test('Invalid Epoch Time To Add / Remove HolidaySlot Remove Request', async () => {
    //     const epoch = Math.floor(new Date().getTime() / 1000) - 86400;
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .post('/food/admin/menu/main_category/1/createHolidaySlot')
    //       .set('Authorization', `Bearer ${admin_token}`)
    //       .send({
    //         end_epoch: epoch,
    //       });
    //     expect(response.statusCode).toBe(400);
    //     expect(response.body.status).toBe(false);
    //     expect(response.body.errors).toStrictEqual([
    //       {message: 'End time is before current date', code: 0},
    //     ]);
    //   });
    //   test('Successfull HolidaySlot Request', async () => {
    //     mockgetAdminDetails();
    //     const epoch = Math.floor(new Date().getTime() / 1000) + 86400;
    //     const response = await request(server)
    //       .post('/food/admin/menu/main_category/1/createHolidaySlot')
    //       .set('Authorization', `Bearer ${admin_token}`)
    //       .send({
    //         end_epoch: epoch,
    //       });
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.status).toBe(true);
    //     delete response.body.result.created_at;
    //     delete response.body.result.updated_at;
    //     expect(response.body.result).toStrictEqual({
    //       id: 1,
    //     });
    //     //const read_main_category = await DB.read('menu_item');
    //     // expect(read_main_category[0].id).toBe(1);
    //     // expect(read_main_category[0].name).toBe('Beverages');
    //     // expect(read_main_category[0].restaurant_id).toBe(
    //     //   menu_valid_restaurant_id
    //     // );
    //     // expect(read_main_category[0].is_deleted).toBe(false);
    //   });
    //   test('Successfully HolidaySlot Remove Request', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .post('/food/admin/menu/main_category/1/createHolidaySlot')
    //       .set('Authorization', `Bearer ${admin_token}`)
    //       .send({
    //         end_epoch: null,
    //       });
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.status).toBe(true);
    //     delete response.body.result.created_at;
    //     delete response.body.result.updated_at;
    //     expect(response.body.result).toStrictEqual({
    //       id: 1,
    //     });
    //   });
    // });
    // describe('DELETE Main Category', () => {
    //   test('Invalid Restaurnat ID', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .delete('/food/admin/menu/main_category/20')
    //       .set('Authorization', `Bearer ${admin_token}`);
    //     expect(response.statusCode).toBe(404);
    //     expect(response.body.status).toBe(false);
    //     expect(response.body.errors).toStrictEqual([
    //       {message: 'Main-Category  Not Found', code: 0},
    //     ]);
    //   });
    //   test('Successfull Delete Request', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .delete('/food/admin/menu/main_category/1')
    //       .set('Authorization', `Bearer ${admin_token}`);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.status).toBe(true);
    //     expect(response.body.result).toStrictEqual({
    //       id: 1,
    //       restaurant_id: '77e53c1f-6e9e-4724-9ba7-92edc69cff6b',
    //       name: 'Beverages',
    //     });
    //     const read_main_category = await DB.read('main_category');
    //     expect(read_main_category[1].is_deleted).toBe(true);
    //   });
    //   test('Failed Delete Request >> Not found', async () => {
    //     mockgetAdminDetails();
    //     const response = await request(server)
    //       .delete('/food/admin/menu/main_category/1')
    //       .set('Authorization', `Bearer ${admin_token}`);
    //     expect(response.statusCode).toBe(404);
    //   });
    // });
});