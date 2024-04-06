import express from 'express';
import * as auth_controllers from './auth_controller';

const open_routes = express.Router();

open_routes.post('/auth/login', auth_controllers.genLoginAdmin);


export default {open_routes};

/**
 * @openapi
 *"/user/admin/auth/login":
 *  post:
 *    description: " Login user"
 *    requestBody:
 *      content:
 *        application/json:
 *          name: body
 *          in: body
 *          description: Admin details
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: admin
 *              password:
 *                type: string
 *                example: "admin"
 *      required: true
 *    responses:
 *      '200':
 *        description: Successfully get token for admin
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
 *    - Admin
 */