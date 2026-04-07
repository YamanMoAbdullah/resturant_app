const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Restaurant API',
    version: '1.0.0',
    description: 'API documentation for restaurant management system, including authentication, cart, orders, and more.'
  },
  servers: [
    {
      url: 'https://restaurant-node-js.onrender.com',
      description: 'Production server (Render)'
    },
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
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
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'] 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
