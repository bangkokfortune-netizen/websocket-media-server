import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';

// โหลด environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// สร้าง HTTP server
const server = http.createServer(app);

// สร้าง WebSocket server
const wss = new WebSocketServer({ server });

// Mock base64 data สำหรับทดสอบ
const mockMediaPayload = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

// HTTP Routes
app.get('/', (req, res) => {
  res.send('✅ FortuneOne AI WebSocket Server is running.');
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    connections: wss.clients.size 
  });
});

// WebSocket Handler
wss.on('connection', (ws, req) => {
  const clientIP = req.socket.remoteAddress || 'unknown';
  console.log(`🔗 Client connected from ${clientIP}`);

  // ส่งข้อความต้อนรับ
  ws.send(JSON.stringify({
    event: 'media',
    media: {
      payload: mockMediaPayload
    },
    timestamp: new Date().toISOString(),
    message: 'Connected to FortuneOne AI WebSocket Server'
  }));

  // รับข้อความจาก client
  ws.on('message', (data) => {
    const message = data.toString();
    console.log(`📨 Message from ${clientIP}: ${message}`);

    // ตอบกลับด้วย mock media data
    ws.send(JSON.stringify({
      event: 'media',
      media: {
        payload: mockMediaPayload
      },
      timestamp: new Date().toISOString(),
      echo: message,
      status: 'processed'
    }));
  });

  // จัดการเมื่อ client ตัดการเชื่อมต่อ
  ws.on('close', (code, reason) => {
    console.log(`🔌 Client ${clientIP} disconnected. Code: ${code}`);
  });

  // จัดการ error
  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for ${clientIP}:`, error.message);
  });
});

// Error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// เริ่มต้น server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 HTTP endpoint: http://localhost:${PORT}/`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}/`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
