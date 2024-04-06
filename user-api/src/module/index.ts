import express from 'express';
import customer_routes from './customer';
import admin_routes from './admin';
import {
  authenticate_customer,
} from '../utilities/jwt/authenticate';

const routes = express.Router();

routes.use('/customer', customer_routes.open_routes);
routes.use('/customer', authenticate_customer, customer_routes.customer_routes);

routes.use('/admin', admin_routes.open_routes);

export default routes;
