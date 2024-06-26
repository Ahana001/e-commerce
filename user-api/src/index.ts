import dotenv from 'dotenv';
dotenv.config();
import express, {Application, Request, Response} from 'express';
import bodyParser from 'body-parser';
import {connectdb, pingdb} from './data/knex';
import routes from './module';
// import internalRoutes from './module/internalRoutes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utilities/swagger_docs';
import logger from './utilities/logger/winston_logger';

async function app() {
  await connectdb();
  const server: Application = express();
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(cors());
  server.use(bodyParser.json({limit: '10mb'}));

  /**
   * @openapi
   * /health:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  server.use('/health', async (req: Request, res: Response) => {
    const dbOk = await pingdb();
    if (dbOk) {
      res.status(200).send('#OK');
    } else {
      res.status(500).send('DB Error!!');
    }
  });
  server.use(
    '/user/swagger',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customSiteTitle: 'User-Swagger',
    })
  );
  server.get('/user/swagger.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });

  server.use(`/${process.env.API_ROOT}`, routes);
  // server.use('/internal', internalRoutes);

  server.use('/', (req: Request, res: Response) => {
    res.status(404).send('#Invalid Path');
  });
  
  const port = process.env.SERVER_PORT || 8080;
  server.listen(port, () => {
    logger.info(`server starts on port.. ${port}...`);
    logger.info(`Seving API DOC >> http://localhost:${port}/user/swagger`);
  });
}
app();
