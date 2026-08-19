/* ==========================================================================
   VONANA Platform Backend Server (Node.js + Express + Socket.io)
   Features: REST APIs, Socket.io Real-time Chat, M-Pesa Hook, Prisma Schema
   Target: Mozambique Digital Ecosystem (vonana.co.mz)
   ========================================================================== */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

/* --------------------------------------------------------------------------
   1. In-Memory Mock Database Store (PostgreSQL Prisma Bridge)
   -------------------------------------------------------------------------- */
const DB = {
  users: [
    { id: 'usr-1', phone: '+258841234567', name: 'Alves King', username: 'alvesking', city: 'Maputo', isVerified: true }
  ],
  shops: [
    {
      id: 'shop-1',
      name: 'Loja Eletrónica Maputo',
      handle: '@lojatechmaputo',
      city: 'Maputo',
      rating: 4.9,
      salesCount: 3400,
      verifiedPartner: 'M-PESA',
      phone: '+258849900112'
    }
  ],
  listings: [
    {
      id: 'car-1',
      title: 'Toyota Ractis 1.5 L (Ano 2020)',
      priceMzn: 380000,
      category: 'auto',
      entityType: 'shop',
      subcat: 'carros',
      city: 'Maputo',
      specs: { year: 2020, mileage: '45.000 km', fuel: 'Gasolina', transmission: 'Automático' }
    },
    {
      id: 'prop-1',
      title: 'Terreno Espaçoso 30x40m com DUAT',
      priceMzn: 650000,
      category: 'property',
      entityType: 'individual',
      subcat: 'terrenos',
      city: 'Matola',
      specs: { area: '1.200 m²', doc: 'Título DUAT', infra: 'Água & Luz' }
    }
  ],
  groups: [
    { id: 'grp-1', name: 'Empreendedores de Maputo & Matola', memberCount: 14800, privacy: 'PUBLIC' }
  ],
  messages: []
};

/* --------------------------------------------------------------------------
   2. REST API Routes (/api/v1/...)
   -------------------------------------------------------------------------- */

// Healthcheck & System Info
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ONLINE', region: 'Maputo, MZ', timestamp: new Date() });
});

// Auth Login API (+258 Phone)
app.post('/api/v1/auth/login', (req, res) => {
  const { phone, password } = req.body;
  if (!phone) return res.status(400).json({ error: 'Número de telefone obrigatório' });
  
  res.json({
    success: true,
    token: 'vonana_jwt_token_sample_2026',
    user: DB.users[0]
  });
});

// Marketplace Listings API (With Filters)
app.get('/api/v1/marketplace/search', (req, res) => {
  const { category, entity, city, query } = req.query;
  
  let results = DB.listings;

  if (category && category !== 'all') {
    results = results.filter(l => l.category === category);
  }
  if (entity && entity !== 'all') {
    results = results.filter(l => l.entityType === entity);
  }
  if (city && city !== 'all') {
    results = results.filter(l => l.city === city);
  }
  if (query) {
    results = results.filter(l => l.title.toLowerCase().includes(query.toLowerCase()));
  }

  res.json({ total: results.length, listings: results });
});

// Create Dynamic Category Listing API
app.post('/api/v1/marketplace/create', (req, res) => {
  const { title, priceMzn, category, entityType, city, specs } = req.body;
  
  const newListing = {
    id: `item-${Date.now()}`,
    title: title || 'Novo Item',
    priceMzn: Number(priceMzn) || 0,
    category: category || 'tech',
    entityType: entityType || 'individual',
    city: city || 'Maputo',
    specs: specs || {}
  };

  DB.listings.unshift(newListing);
  res.json({ success: true, listing: newListing });
});

// Create Group or Official Page API
app.post('/api/v1/pages-groups/create', (req, res) => {
  const { name, type, privacy, city, description } = req.body;

  const newEntity = {
    id: `entity-${Date.now()}`,
    name: name || 'Nova Comunidade',
    type: type || 'group',
    privacy: privacy || 'PUBLIC',
    city: city || 'Maputo',
    memberCount: 1
  };

  DB.groups.push(newEntity);
  res.json({ success: true, entity: newEntity });
});

// M-Pesa & e-Mola C2B Payment Webhook Simulator API
app.post('/api/v1/mpesa/c2b-pay', (req, res) => {
  const { phone, amount, serviceName } = req.body;
  
  if (!phone || !amount) {
    return res.status(400).json({ error: 'Número de telefone (+258) e valor são obrigatórios.' });
  }

  const txId = `MP260815.${Math.floor(1000 + Math.random() * 9000)}.B1`;
  const responseData = {
    success: true,
    transactionId: txId,
    amountMzn: Number(amount),
    phone: phone,
    service: serviceName || 'Pagamento VONANA',
    status: 'CONFIRMED',
    timestamp: new Date().toISOString(),
    message: `Pagamento M-Pesa de ${amount} MT confirmado com sucesso! Ref: ${txId}`
  };

  res.json(responseData);
});

/* --------------------------------------------------------------------------
   3. Socket.io Real-Time Engine (Chat Gateway)
   -------------------------------------------------------------------------- */
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Socket.io Chat Engine: ${socket.id}`);

  // Join User Conversation Room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Client joined room: ${roomId}`);
  });

  // Handle Real-time Chat Message Transmission
  socket.on('send_message', (msgData) => {
    const message = {
      id: `msg-${Date.now()}`,
      senderId: msgData.senderId || 'usr-1',
      text: msgData.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SENT'
    };

    DB.messages.push(message);

    // Broadcast to room
    io.to(msgData.roomId).emit('receive_message', message);

    // Simulate Delivered & Seen Receipts
    setTimeout(() => {
      message.status = 'DELIVERED';
      io.to(msgData.roomId).emit('update_status', { messageId: message.id, status: 'DELIVERED' });
    }, 1200);

    setTimeout(() => {
      message.status = 'SEEN';
      io.to(msgData.roomId).emit('update_status', { messageId: message.id, status: 'SEEN' });
    }, 2800);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start Node Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 VONANA Node.js & Socket.io Production API Server running at http://localhost:${PORT}`);
});
