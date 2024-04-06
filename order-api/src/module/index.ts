import express from 'express';
// import cart_routes from './cart';
import order_routes from './order';
import {
  authenticate_customer,
  authenticate_admin,
} from '../utilities/jwt/authenticate';

const routes = express.Router();

routes.use('/admin', authenticate_admin, order_routes.admin_routes);
routes.use('/', authenticate_customer, order_routes.customer_routes);


// routes.use('/cart', cart_routes.customer_routes);


export default routes;
