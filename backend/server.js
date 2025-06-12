// Backend Server - Node.js + Express (Demo structure)
// This would be deployed separately in a real application

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/session', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Memory Routes
app.get('/api/memories', authenticateToken, async (req, res) => {
  try {
    const memories = await prisma.memory.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(memories);
  } catch (error) {
    console.error('Get memories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/memories', authenticateToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const memory = await prisma.memory.create({
      data: {
        title,
        content,
        tags,
        userId: req.user.userId,
      }
    });

    res.status(201).json(memory);
  } catch (error) {
    console.error('Create memory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/memories/:id', authenticateToken, async (req, res) => {
  try {
    const memory = await prisma.memory.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      }
    });

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    res.json(memory);
  } catch (error) {
    console.error('Get memory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/memories/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const memory = await prisma.memory.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
      data: {
        title,
        content,
        tags,
        updatedAt: new Date(),
      }
    });

    if (memory.count === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    const updatedMemory = await prisma.memory.findUnique({
      where: { id: req.params.id }
    });

    res.json(updatedMemory);
  } catch (error) {
    console.error('Update memory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/memories/:id', authenticateToken, async (req, res) => {
  try {
    const memory = await prisma.memory.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      }
    });

    if (memory.count === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Search Route
app.post('/api/ai/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body;

    // Get user's memories
    const memories = await prisma.memory.findMany({
      where: { userId: req.user.userId }
    });

    // Simple search implementation (in production, this would use RAG with embeddings)
    const relevantMemories = memories.filter(memory =>
      memory.content.toLowerCase().includes(query.toLowerCase()) ||
      memory.title.toLowerCase().includes(query.toLowerCase()) ||
      memory.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    // Simulate AI-generated answer
    const answer = relevantMemories.length > 0
      ? `Based on your memories, I found ${relevantMemories.length} relevant entries about "${query}". Here's what you've stored: ${relevantMemories.map(m => m.title).join(', ')}.`
      : `I couldn't find any memories related to "${query}". Consider adding some notes about this topic.`;

    res.json({
      answer,
      references: relevantMemories.slice(0, 5) // Limit to 5 references
    });
  } catch (error) {
    console.error('AI search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;