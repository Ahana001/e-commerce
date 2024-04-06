import dotenv from 'dotenv';
dotenv.config({
  path: '.env.test'
});
import express, {Application, Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../../module';
import {createEmptyTestDatabase} from './utilities';

export async function initGlobalServices() {
  await createEmptyTestDatabase();
}
/**
 * createTestServer function creates new server, this server instance is used by supertest to run tests
 * @returns test server instance with all bindings
 */
export async function createTestServer() {
  await initGlobalServices();
  const server: Application = express();
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(cors());
  server.use(bodyParser.json({limit: '10mb'}));
  server.use('/', routes);
  server.use('/', (req: Request, res: Response) => {
    res.status(404).send('#Invalid Path');
  });
  return server;
}
