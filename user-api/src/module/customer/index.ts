import express from 'express';
import * as customers_controller from './controller';
import * as auth_controllers from './auth_controller';

const customer_routes = express.Router();
const open_routes = express.Router();

customer_routes.get('/', customers_controller.getCustomerById);

open_routes.post('/auth/login', auth_controllers.genLoginCustomer);
open_routes.post('/auth/register', auth_controllers.genRegisterCustomer);


export default {customer_routes, open_routes};


/**
 * @openapi
 *"/user/customer/auth/register":
 *  post:
 *    description: " Registring new user"
 *    requestBody:
 *      content:
 *        application/json:
 *          name: body
 *          in: body
 *          description: Customer details
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: abc
 *              password:
 *                type: string
 *                example: "abc@123"
 *      required: true
 *    responses:
 *      '200':
 *        description: Successfully registered customer
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Registration Successfully
 *      '403':
 *        description: " Validation Error "
 *      '409':
 *        description: " Customer already exists, Please login"
 *      '500':
 *        description: " Internal Server Error "
 *    tags:
 *    - Customer
 */


/**
 * @openapi
 *"/user/customer/auth/login":
 *  post:
 *    description: " Login user"
 *    requestBody:
 *      content:
 *        application/json:
 *          name: body
 *          in: body
 *          description: Customer details
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: abc
 *              password:
 *                type: string
 *                example: "abc@123"
 *      required: true
 *    responses:
 *      '200':
 *        description: Successfully get token for customer
 *        schema:
 *          type: object
 *          properties:
 *            token:
 *              type: string
 *              example: 1234
 *      '403':
 *        description: " Validation Error "
 *      '400':
 *        description: "Incorrect Credentials"
 *      '500':
 *        description: " Internal Server Error "
 *    tags:
 *    - Customer
 */

/**
 * @openapi
 *paths:
 *  "/user/customer":
 *    get:
 *      tags:
 *      - Customer
 *      security:
 *      - bearerAuthCustomer: []
 *      description: Get Customer details
 *      produces:
 *      - application/json
 *      responses:
 *        '200':
 *          description: " Cutomer Id Exist, Details of Cutomer :"
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: uuid
 *                example: 86a7013f-9ab1-4b2c-b82b-4e9757c80b67
 *              name:
 *                type: string
 *                example: abc
 *              updated_at:
 *                type: string
 *                example: '1638554212773'
 *              created_at:
 *                type: string
 *                example: '1638554212773'
 *              is_deleted:
 *                type: boolean
 *                example: 'false'
 *        '403':
 *          description: " Validation Error "
 *        '400':
 *          description: " customer not found"
 *        '500':
 *          description: " Internal Server Error "
 */
