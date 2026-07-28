const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(express.json());
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = (() => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog';

  try {
    const parsed = new URL(uri);
    parsed.pathname = '/blog';
    return parsed.toString();
  } catch (error) {
    return uri.includes('/blog') ? uri : `${uri.replace(/\/$/, '')}/blog`;
  }
})();

const postSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    readTime: {
      type: String,
      required: true,
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model('Post', postSchema, 'posts');
const memoryPosts = [];

/**
 * @swagger
 * /:
 *   get:
 *     summary: Informações da API
 *     tags:
 *       - API
 *     responses:
 *       200:
 *         description: API online
 */

app.get("/", (req, res) => {
  res.status(200).json({
    service: "CodeWil API",
    description: "REST API powering the CodeWil website.",
    status: "healthy",
    version: "1.0.0",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    documentation: "https://api.codewil.site/docs",
    endpoints: {
      posts: {
        list: "GET /posts",
        get: "GET /posts/:slug",
        create: "POST /posts",
        update: "PUT /posts/:id",
        delete: "DELETE /posts/:id"
      }
    }
  });
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria um novo post
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post criado
 */

app.post('/posts', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = new Post(req.body);
      const savedPost = await post.save();

      return res.status(201).json(savedPost);
    }

    const post = {
      ...req.body,
      _id: `${Date.now()}`
    };

    memoryPosts.unshift(post);

    return res.status(201).json(post);
  } catch (error) {
    return res.status(400).json({
      message: 'Erro ao criar post.',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lista todos os posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */

app.get('/posts', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const posts = await Post.find().sort({ createdAt: -1 });
      return res.json(posts);
    }

    return res.json(memoryPosts);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar posts.',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /posts/{slug}:
 *   get:
 *     summary: Busca um post por slug
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post não encontrado
 */

app.get('/posts/:slug', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = await Post.findOne({ slug: req.params.slug });
      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado.' });
      }
      return res.json(post);
    }

    const post = memoryPosts.find(p => p.slug === req.params.slug);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado.' });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar post.',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualiza um post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post atualizado
 *   delete:
 *     summary: Deleta um post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deletado
 *       404:
 *         description: Post não encontrado
 */

app.put('/posts/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado.' });
      }
      return res.json(post);
    }

    return res.status(503).json({ message: 'Banco de dados indisponível.' });
  } catch (error) {
    return res.status(400).json({
      message: 'Erro ao atualizar post.',
      error: error.message
    });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post não encontrado.' });
      }
      return res.json({ message: 'Post deletado com sucesso.' });
    }

    return res.status(503).json({ message: 'Banco de dados indisponível.' });
  } catch (error) {
    return res.status(400).json({
      message: 'Erro ao deletar post.',
      error: error.message
    });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.warn('MongoDB indisponível, utilizando armazenamento temporário em memória.', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();