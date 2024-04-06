import express from 'express';
import product_routes from './product';
import {
  authenticate_admin,
  authenticate_customer
} from '../utilities/jwt/authenticate';

const routes = express.Router();

routes.use('/admin', authenticate_admin, product_routes.admin_routes);
routes.use('/', authenticate_customer, product_routes.customer_routes);


export default routes;
