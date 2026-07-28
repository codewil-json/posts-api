module.exports = {
  openapi: '3.1.0',
  info: {
    title: 'CodeWil API',
    version: '1.0.0',
    description: 'REST API powering the CodeWil website.'
  },

  servers: [
    {
      url: 'https://api.codewil.site'
    },
    {
      url: 'http://localhost:3000'
    }
  ],

  paths: {
    '/': {
      get: {
        tags: ['API'],
        summary: 'Informações da API',
        responses: {
          200: {
            description: 'API online'
          }
        }
      }
    },

    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Lista todos os posts',
        responses: {
          200: {
            description: 'Lista de posts'
          }
        }
      },

      post: {
        tags: ['Posts'],
        summary: 'Cria um novo post',

        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Post'
              }
            }
          }
        },

        responses: {
          201: {
            description: 'Post criado'
          }
        }
      }
    }
  },

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
            type: 'string'
          },

          title: {
            type: 'string'
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
            type: 'string'
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
};