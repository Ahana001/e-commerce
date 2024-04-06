import express from 'express';
import product_routes from './product';

const routes = express.Router();

routes.use('/product', product_routes.internal_routes);

export default routes;
