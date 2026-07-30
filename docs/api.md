# CodeWil API

REST API responsável pelos posts do blog do CodeWil.

Base URL

```
https://api.codewil.site
```

---

# Status

## GET /

Retorna informações da API.

### Exemplo

```http
GET /
```

### Resposta

```json
{
  "service": "CodeWil API",
  "status": "healthy",
  "version": "1.0.0"
}
```

---

# Listar Posts

## GET /posts

Retorna todos os posts.

### Resposta

```json
[
  {
    "_id": "...",
    "slug": "vue-js",
    "title": "Vue.js ainda vale a pena?"
  }
]
```

---

# Buscar Post

## GET /posts/:slug

Exemplo

```http
GET /posts/vue-js
```

Resposta

```json
{
  "_id": "...",
  "slug": "vue-js",
  "title": "Vue.js ainda vale a pena?"
}
```

---

# Criar Post

## POST /posts

### Body

```json
{
  "slug": "novo-post",
  "title": "Novo Post",
  "description": "...",
  "category": "Tecnologia",
  "date": "29 Jul 2026",
  "readTime": "5 min",
  "tags": [
    "vue",
    "javascript"
  ],
  "content": "# Conteúdo..."
}
```

### Resposta

```json
{
  "_id": "...",
  "slug": "novo-post"
}
```

---

# Atualizar

## PUT /posts/:id

### Body

```json
{
  "title": "Novo título"
}
```

---

# Deletar

## DELETE /posts/:id

Resposta

```json
{
  "message": "Post deletado com sucesso."
}
```

---

# Modelo de Post

```json
{
  "_id": "...",
  "slug": "",
  "title": "",
  "description": "",
  "category": "",
  "date": "",
  "readTime": "",
  "tags": [],
  "content": ""
}
```