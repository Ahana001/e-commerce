import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'User-API',
    },
    components: {
      securitySchemes: {
        bearerAuthCustomer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: '',
        description: 'Current',
      },
    ],
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  apis: ['./src/**/*.ts', './build/**/*.js'],
};

const swaggerDocument = swaggerJsdoc(options);

export default swaggerDocument;
