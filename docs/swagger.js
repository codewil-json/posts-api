const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const servers = [];

if (process.env.NODE_ENV === 'production' && process.env.API_URL) {
  servers.push({ url: process.env.API_URL });
} else {
  servers.push({ url: 'http://localhost:3000' });
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeWil API',
      version: '1.0.0',
      description: 'API oficial da CodeWil'
    },
    servers,
    components: {
      schemas: {
        Post: {
          type: 'object',
          required: [
            'slug',
            'title',
            'description',
            'category',
            'date',
            'readTime',
            'content'
          ],
          properties: {
            slug: {
              type: 'string',
              example: 'vue-ainda-vale-a-pena-2026'
            },
            title: {
              type: 'string',
              example: 'Vue.js ainda vale a pena em 2026?'
            },
            description: {
              type: 'string'
            },
            category: {
              type: 'string'
            },
            date: {
              type: 'string'
            },
            readTime: {
              type: 'string',
              example: '5 min'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            content: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '../index.js')]
};

module.exports = swaggerJsdoc(options);