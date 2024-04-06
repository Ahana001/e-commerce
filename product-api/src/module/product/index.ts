import express from 'express';
import * as admin_controller from './admin_controller';
import * as customer_controller from './customer_controller';
import * as controller from './controller';


const admin_routes = express.Router();
const customer_routes = express.Router();
const internal_routes = express.Router();

admin_routes.put('/:id', admin_controller.admin_updateProduct);
admin_routes.delete('/:id', admin_controller.admin_deleteProduct);
admin_routes.post('/', admin_controller.admin_createProduct);
admin_routes.get('/', admin_controller.admin_readProducts);

customer_routes.get('/', customer_controller.readProducts);

internal_routes.post('/', controller.internalReadProducts);
internal_routes.post('/update', controller.internaUpdateProducts);


export default {admin_routes, customer_routes, internal_routes};


/** POST ADMIN
 * @openapi
 *paths:
 *  "/product/admin/":
 *    post:
 *      tags:
 *      - Product
 *      security:
 *      - bearerAuthAdmin: []
 *      summary: "Admin Auth"
 *      description: Create Product
 *      requestBody:
 *        content:
 *          application/json:
 *            name: body
 *            in: body
 *            description: Document
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Gujrati Thali
 *                description:
 *                  type: string
 *                  example: Gujarati Thali
 *                price:
 *                  type: number
 *                  example: 100
 *                stock:
 *                  type: number
 *                  example: 10
 *      responses:
 *        '201':
 *          description: Created Successfully
 *        '400':
 *          description: Validation Error
 *        '500':
 *          description: Internal Server Error
 */


 /** GET ADMIN
 * @openapi
 *paths:
 *  "/product/admin/":
 *    get:
 *      tags:
 *      - Product
 *      security:
 *      - bearerAuthAdmin: []
 *      summary: "Admin Auth"
 *      description: Get All Products
 *      responses:
 *        '200':
 *          description: Get Successfully
 *        '500':
 *          description: Internal Server Error
 */

/** PUT ADMIN
 * @openapi
 *paths:
 *  "/product/admin/{id}":
 *    put:
 *      tags:
 *      - Product
 *      security:
 *      - bearerAuthAdmin: []
 *      summary: "Admin Auth"
 *      parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        example: 19
 *        description: Update Product
 *      requestBody:
 *        content:
 *          application/json:
 *            name: body
 *            in: body
 *            description: Document
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: South Indian
 *                stock:
 *                  type: number
 *                  example: 5
 *                description:
 *                  type: string
 *                  example: South Indian
 *      responses:
 *        '201':
 *          description: Updated Successfully
 *        '400':
 *          description: Validation Error
 *        '500':
 *          description: Internal Server Error
 */

/** GET CUSTOMER
 * @openapi
 *paths:
 *  "/product/":
 *    get:
 *      tags:
 *      - Product
 *      security:
 *      - bearerAuthCustomer: []
 *      summary: "Customer Auth"
 *      description: Get All Products
 *      responses:
 *        '200':
 *          description: Get Successfully
 *        '500':
 *          description: Internal Server Error
 */

/** DELETE
 * @openapi
 *paths:
 *  "/product/admin/{id}":
 *    delete:
 *      tags:
 *      - Product
 *      security:
 *      - bearerAuthAdmin: []
 *      summary: "Admin Auth"
 *      parameters:
 *      - in: path
 *        name: id
 *        type: number
 *        example: 19
 *        description: Delete Product
 *      responses:
 *        '201':
 *          description: Deleted Successfully
 *        '400':
 *          description: Validation Error
 *        '500':
 *          description: Internal Server Error
 */
