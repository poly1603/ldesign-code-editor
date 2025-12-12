export const codeExamples: Record<string, string> = {
  javascript: `// JavaScript Example
const numbers = [1, 2, 3, 4, 5]

const doubled = numbers.map(n => n * 2)
const sum = numbers.reduce((a, b) => a + b, 0)

console.log('Doubled:', doubled)
console.log('Sum:', sum)`,

  typescript: `// TypeScript Example
interface Config {
  apiUrl: string
  timeout: number
  retries?: number
}

async function fetchData<T>(config: Config): Promise<T> {
  const response = await fetch(config.apiUrl)
  return response.json()
}`,

  python: `# Python Example
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence."""
    if n <= 0:
        return []
    
    fib = [0, 1]
    while len(fib) < n:
        fib.append(fib[-1] + fib[-2])
    
    return fib[:n]

result = fibonacci(10)
print(f"Fibonacci: {result}")`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello World</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>This is a sample HTML document.</p>
  <button onclick="alert('Hello!')">Click me</button>
</body>
</html>`,

  css: `/* CSS Example */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.button:hover {
  transform: scale(1.05);
}`,

  json: `{
  "name": "@ldesign/code-editor",
  "version": "1.0.0",
  "description": "A powerful code editor",
  "keywords": ["monaco", "editor", "code"],
  "dependencies": {
    "monaco-editor": "^0.52.0",
    "vue": "^3.5.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/example/code-editor"
  }
}`,

  markdown: `# Code Editor

A powerful code editor based on **Monaco Editor**.

## Features

- 🎨 Multiple themes
- 📝 30+ language support
- ⚡ Fast and responsive
- 🔧 Highly customizable

## Installation

\`\`\`bash
npm install @ldesign/code-editor-core
\`\`\`

## Usage

\`\`\`javascript
import { createEditor } from '@ldesign/code-editor-core'
\`\`\``,

  sql: `-- SQL Example
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 10;`,

  vue: `<template>
  <div class="counter">
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const title = computed(() => \`Counter App\`)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}
</script>

<style scoped>
.counter {
  padding: 1rem;
  text-align: center;
}
</style>`,

  svelte: `<script lang="ts">
  let count = 0
  
  function increment() {
    count += 1
  }
  
  $: doubled = count * 2
</script>

<main>
  <h1>Hello Svelte!</h1>
  <p>Count: {count}</p>
  <p>Doubled: {doubled}</p>
  <button on:click={increment}>
    Click me
  </button>
</main>

{#if count > 5}
  <p>Count is greater than 5!</p>
{:else}
  <p>Keep clicking...</p>
{/if}

<style>
  main {
    text-align: center;
    padding: 1em;
  }
</style>`,

  graphql: `# GraphQL Schema Example
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
  published: Boolean!
}

type Query {
  users: [User!]!
  user(id: ID!): User
  posts(published: Boolean): [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  createPost(title: String!, authorId: ID!): Post!
  publishPost(id: ID!): Post
}`,

  prisma: `// Prisma Schema Example
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}`,

  toml: `# TOML Configuration Example
[package]
name = "my-app"
version = "1.0.0"
authors = ["Developer"]
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }

[dev-dependencies]
criterion = "0.5"

[[bin]]
name = "my-app"
path = "src/main.rs"

[profile.release]
opt-level = 3
lto = true

[features]
default = ["std"]
std = []`,

  dotenv: `# Environment Variables
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
REDIS_URL="redis://localhost:6379"

# API Keys
API_KEY=your-secret-api-key
JWT_SECRET=super-secret-jwt-key

# Third-party Services
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Feature Flags
ENABLE_NEW_FEATURE=true
DEBUG_MODE=false`
}
