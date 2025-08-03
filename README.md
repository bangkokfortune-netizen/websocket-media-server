# WebSocket Media Server

Real-time WebSocket media server built with Node.js, Express, and WebSocket.

## Features

- ✅ HTTP API endpoint
- ✅ WebSocket real-time communication  
- ✅ Mock media data responses
- ✅ Connection logging
- ✅ Health check endpoint
- ✅ Production ready for Render.com

## API Endpoints

- `GET /` - Server status
- `GET /health` - Health check with connection count
- `WS /` - WebSocket connection

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Test endpoints:
- HTTP: `http://localhost:3000/`
- WebSocket: `ws://localhost:3000/`

## Deploy to Render.com

1. Push code to GitHub
2. Connect repository to Render
3. Deploy as Web Service
4. Environment: Node.js
5. Build Command: `npm install`
6. Start Command: `npm start`

## Environment Variables

- `PORT` - Server port (default: 3000)

## WebSocket Message Format

Server sends messages in this format:
```json
{
  "event": "media",
  "media": {
    "payload": "base64_encoded_data"
  },
  "timestamp": "2024-08-03T10:30:00.000Z",
  "message": "Your message here"
}
```
