import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const PORT = process.env.PORT || 3000;
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Mock base64 data
const mockData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

// HTTP endpoint
app.get('/', (req, res) => {
  res.send('✅ FortuneOne AI WebSocket Server is running.');
});

// WebSocket handling
wss.on('connection', (ws, req) => {
  console.log('🔗 New client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    event: 'media',
    media: { payload: mockData },
    timestamp: new Date().toISOString()
  }));
  
  ws.on('message', (data) => {
    console.log('📨 Received:', data.toString());
    
    // Echo back with media data
    ws.send(JSON.stringify({
      event: 'media',
      media: { payload: mockData },
      timestamp: new Date().toISOString(),
      echo: data.toString()
    }));
  });
  
  ws.on('close', () => {
    console.log('🔌 Client disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
