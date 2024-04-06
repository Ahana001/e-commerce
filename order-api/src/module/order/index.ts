import express from 'express';
import * as customers_controller from './customer_controller';
import * as admin_controller from './admin_controller';
import { authenticate_customer, authenticate_admin } from '../../utilities/jwt/authenticate';


const customer_routes = express.Router();
const admin_routes = express.Router();

customer_routes.get('/:order_id', customers_controller.getCustomerOrderByOrderIdAsCustomer);
customer_routes.post('/place_order', customers_controller.initPaymentPlaceOrder);


admin_routes.get('/:order_id' ,admin_controller.getOrderByOrderIdAsAdmin);
admin_routes.post('/:order_id/accept' ,admin_controller.acceptOrderAsAdmin);
admin_routes.post('/:order_id/confirm_payment' ,admin_controller.confirmPaymentOrderAsAdmin);
admin_routes.post('/:order_id/delivered' ,admin_controller.deliveredOrderAsAdmin);



export default {customer_routes, admin_routes};


/** GET - ADMIN - ORDER DETAILS- :ID -
 * @openapi
 *"/order/admin/{order_id}":
 *  get:
 *    description: "Get Order details"
 *    tags:
 *    - Order
 *    security:
 *    - bearerAuthAdmin: []
 *    summary: "Admin Auth"
 *    parameters:
 *    - in: path
 *      name: order_id
 *      description: order id
 *      type: number
 *      example: 1
 *    responses:
 *      '200':
 *        description: " Successfully Got order details"
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: " Internal Server Error "
 */


/** GET - CUSTOMER - ORDER DETAILS- :ID -
 * @openapi
 *"/order/{order_id}":
 *  get:
 *    description: "Get Order details"
 *    tags:
 *    - Order
 *    security:
 *    - bearerAuthCustomer: []
 *    summary: "Customer Auth"
 *    parameters:
 *    - in: path
 *      name: order_id
 *      description: order id
 *      type: number
 *      example: 1
 *    responses:
 *      '200':
 *        description: " Successfully Got order details"
 *      '401':
 *        description: Unauthorized
 *      '500':
 *        description: " Internal Server Error "
 */


/** POST - PLACE ORDER - CUSTOMER
 * @openapi
 *paths:
 *  "/order/place_order":
 *    post:
 *      description: " place order api "
 *      tags:
 *      - Order
 *      security:
 *      - bearerAuthCustomer: []
 *      summary: "Customer Auth"
 *      requestBody:
 *        content:
 *          application/json:
 *            name: body
 *            in: body
 *            description: Customer Auth
 *            schema:
 *              type: object
 *              properties:
 *                products:
 *                  type: object
 *                  example: [
 *                               {
 *                                    "quantity": 1,
 *                                     "id": 80820710
 *                                }
 *                           ]
 *      responses:
 *        '200':
 *          description: " order placed "
 *        '400':
 *          description: " Bad Request "
 *        '401':
 *          description: " Unauthorized "
 *        '500':
 *          description: " Internal Server Error "
 */


/** POST - ACCEPT - ADMIN
 * @openapi
 *paths:
 *  "/order/admin/{order_id}/accept":
 *    post:
 *      description: " accept order api "
 *      tags:
 *      - Order
 *      security:
 *      - bearerAuthAdmin: []
 *      summary: "Admin Auth"
 *      parameters:
 *      - in: path
 *        name: order_id
 *        description: order id
 *        type: number
 *        example: 1
 *      requestBody:
 *        content:
 *          application/json:
 *            name: body
 *            in: body
 *            description: Admin Auth
 *            schema:
 *              type: object
 *              properties:
 *                accept:
 *                  type: boolean
 *                  example: true
 *      responses:
 *        '200':
 *          description: " order accepted "
 *        '400':
 *          description: " Bad Request "
 *        '401':
 *          description: " Unauthorized "
 *        '500':
 *          description: " Internal Server Error "
 */


 /** POST - DELIVERED - ADMIN
 * @openapi
 *paths:
 *  "/order/admin/{order_id}/delivered":
 *    post:
 *      description: " delivered order api "
 *      tags:
 *      - Order
 *      security:
 *      - bearerAuthAdmin: []
 *      summary: "Admin Auth"
 *      parameters:
 *      - in: path
 *        name: order_id
 *        description: order id
 *        type: number
 *        example: 1
 *      responses:
 *        '200':
 *          description: " order delivered "
 *        '400':
 *          description: " Bad Request "
 *        '401':
 *          description: " Unauthorized "
 *        '500':
 *          description: " Internal Server Error "
 */

  /** POST - CONFIRM_PAYMENT - ADMIN
 * @openapi
 *paths:
 *  "/order/admin/{order_id}/confirm_payment":
 *    post:
 *      description: " confirm payment order api "
 *      tags:
 *      - Order
 *      security:
 *      - bearerAuthAdmin: []
 *      summary: "Admin Auth"
 *      parameters:
 *      - in: path
 *        name: order_id
 *        description: order id
 *        type: number
 *        example: 1
 *      responses:
 *        '200':
 *          description: " order confirm payment "
 *        '400':
 *          description: " Bad Request "
 *        '401':
 *          description: " Unauthorized "
 *        '500':
 *          description: " Internal Server Error "
 */