const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClusterTwin AI Platform API',
      version: '1.0.0',
      description: 'API Documentation for the ClusterTwin Industrial IoT Platform',
      contact: {
        name: 'API Support',
        email: 'support@clustertwin.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server'
      },
      {
        url: 'https://api.clustertwin.com/v1',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
