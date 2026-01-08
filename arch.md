# Collaborative Board - Architecture

## Current Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Browser 1   │    │  Browser 2   │    │  Browser 3   │      │
│  │  (Next.js)   │    │  (Next.js)   │    │  (Next.js)   │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                    │                    │               │
└─────────┼────────────────────┼────────────────────┼──────────────┘
          │                    │                    │
          │ HTTP (REST)        │                    │
          │                    │                    │
          ▼                    │                    │
┌─────────────────┐           │                    │
│                 │           │                    │
│  HTTP Backend   │           │                    │
│  (Express.js)   │           │                    │
│                 │           │                    │
│  - /signup      │           │                    │
│  - /signin      │           │                    │
│  - /rooms       │           │                    │
│                 │           │                    │
└────────┬────────┘           │                    │
         │                    │                    │
         │                    │ WebSocket          │ WebSocket
         │                    │                    │
         │                    ▼                    ▼
         │           ┌──────────────────────────────────┐
         │           │                                  │
         │           │      WebSocket Backend           │
         │           │      (Socket.io/ws)              │
         │           │                                  │
         │           │  - Real-time canvas updates      │
         │           │  - Room management               │
         │           │  - Broadcast moves/changes       │
         │           │                                  │
         │           └────────────┬─────────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌──────────────────────────────────────────┐
│                                          │
│           PostgreSQL Database            │
│              (Prisma ORM)                │
│                                          │
│  - Users                                 │
│  - Rooms                                 │
│  - Game State                            │
│  - Participants                          │
│                                          │
└──────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
Browser → HTTP Backend → Database
   │
   └─→ JWT Token ←─────────┘
   │
   └─→ WebSocket Connection (with JWT)
```

### 2. Real-time Collaboration Flow

```
User Action (Browser 1)
   │
   ▼
WebSocket Backend
   │
   ├─→ Update Database
   │
   └─→ Broadcast to all connected clients in room
        │
        ├─→ Browser 1 (sender)
        ├─→ Browser 2
        └─→ Browser 3
```

---

## Scaled Architecture (Production Ready)

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Users)                        │
└────────┬──────────────────────┬──────────────────┬──────────────┘
         │                      │                  │
         │                      │                  │
         ▼                      ▼                  ▼
┌────────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER                              │
│                  (NGINX / AWS ALB / Cloudflare)                 │
└────────┬──────────────────────┬──────────────────┬─────────────┘
         │                      │                  │
         │                      │                  │
    HTTP │                      │ WS               │ WS
         │                      │                  │
┌────────▼────────┐   ┌─────────▼────────┐   ┌───▼──────────────┐
│                 │   │                  │   │                  │
│ HTTP Backend    │   │ WS Backend       │   │ WS Backend       │
│   Instance 1    │   │   Instance 1     │   │   Instance 2     │
│                 │   │                  │   │                  │
└────────┬────────┘   └─────────┬────────┘   └───┬──────────────┘
         │                      │                 │
         │                      │                 │
         │                      └────────┬────────┘
         │                               │
         │                               │
         │                      ┌────────▼────────┐
         │                      │                 │
         │                      │  Redis Pub/Sub  │
         │                      │                 │
         │                      │ - Broadcast     │
         │                      │ - Session Store │
         │                      │ - Room Channels │
         │                      │                 │
         │                      └────────┬────────┘
         │                               │
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │                        │
            │   PostgreSQL Database  │
            │   (Primary + Replicas) │
            │                        │
            └────────────────────────┘
```

---

## Scaling Strategies

### 1. Horizontal Scaling with Redis Pub/Sub

**Problem**: Multiple WebSocket server instances can't communicate directly.

**Solution**: Use Redis as a message broker.

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│ User A   │         │ User B   │         │ User C   │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │
     │ WS                 │ WS                  │ WS
     ▼                    ▼                     ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ WS Server 1 │      │ WS Server 2 │      │ WS Server 3 │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                     │
       │  Publish           │                     │  Subscribe
       │  to channel        │  Subscribe          │  to channel
       │  "room:123"        │  to channel         │  "room:123"
       │                    │  "room:123"         │
       └────────────────────┼─────────────────────┘
                            │
                    ┌───────▼────────┐
                    │                │
                    │ Redis Pub/Sub  │
                    │                │
                    │ Channels:      │
                    │ - room:123     │
                    │ - room:456     │
                    │                │
                    └────────────────┘

Flow:
1. User A makes a move → WS Server 1
2. WS Server 1 publishes to Redis channel "room:123"
3. All WS Servers subscribed to "room:123" receive the message
4. Each WS Server broadcasts to its connected clients in that room
5. User B and User C receive the update in real-time
```

### 2. Database Scaling

```
┌────────────────────────────────────────┐
│         Application Servers            │
└────────┬──────────────┬────────────────┘
         │              │
         │ Write        │ Read
         │              │
         ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Primary DB │─→│  Replica 1  │  │  Replica 2  │
│   (Write)   │  │   (Read)    │  │   (Read)    │
└─────────────┘  └─────────────┘  └─────────────┘
       │
       │ Backup
       ▼
┌─────────────┐
│   Backups   │
└─────────────┘
```

### 3. Caching Layer

```
┌──────────────┐
│   Clients    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │
       ├─→ Check Cache (Redis) ──→ Cache Hit → Return
       │                              │
       │                              │ Cache Miss
       │                              ▼
       └──→ Database ──────────→ Store in Cache → Return
```

---

## Advanced Features to Add

### 1. Message Queue for Background Jobs

```
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │
       │ Enqueue Job
       ▼
┌──────────────────┐
│   Redis Queue    │
│   (Bull/BullMQ)  │
└────────┬─────────┘
         │
         │ Process Jobs
         ▼
┌────────────────────┐
│  Worker Processes  │
│                    │
│ - Save room state  │
│ - Generate exports │
│ - Send emails      │
│ - Process replays  │
└────────────────────┘
```

### 2. CDN for Static Assets

```
┌──────────┐
│  Users   │
└────┬─────┘
     │
     ├─→ Static Assets (images, CSS, JS) → CDN (CloudFront/Cloudflare)
     │
     └─→ Dynamic Content (API, WS) → Your Servers
```

### 3. Monitoring & Observability

```
┌─────────────────────────────────────┐
│         Your Application            │
└───────┬─────────────┬───────────────┘
        │             │
        │ Logs        │ Metrics
        │             │
        ▼             ▼
┌─────────────┐  ┌─────────────┐
│  Logging    │  │  Metrics    │
│  (ELK/      │  │ (Prometheus/│
│  DataDog)   │  │  Grafana)   │
└─────────────┘  └─────────────┘
        │             │
        └──────┬──────┘
               │
               ▼
        ┌─────────────┐
        │  Alerting   │
        │ (PagerDuty) │
        └─────────────┘
```

---

## Technology Stack

### Current Stack

- **Frontend**: Next.js (React)
- **HTTP Backend**: Express.js
- **WebSocket Backend**: Node.js (ws/socket.io)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod

### Recommended Additions for Scaling

#### For Real-time Communication

- **Redis**: Pub/Sub and caching
- **Socket.io**: Better WebSocket handling with fallbacks
- **Socket.io-redis**: Adapter for horizontal scaling

#### For Infrastructure

- **Docker**: Containerization
- **Kubernetes**: Orchestration (if very large scale)
- **NGINX**: Load balancing and reverse proxy
- **Let's Encrypt**: SSL certificates

#### For Performance

- **Redis**: Caching and session store
- **PostgreSQL Connection Pooling**: PgBouncer
- **CDN**: CloudFlare/CloudFront for static assets

#### For Monitoring

- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **ELK Stack**: Logging (Elasticsearch, Logstash, Kibana)
- **Sentry**: Error tracking

---

## Implementation Steps

### Phase 1: Add Redis Pub/Sub

```typescript
// ws-backend/src/index.ts
import { createClient } from "redis";
import { Server } from "socket.io";

const redisClient = createClient();
const redisSubscriber = redisClient.duplicate();

io.on("connection", (socket) => {
  socket.on("join-room", async (roomId) => {
    socket.join(roomId);

    // Subscribe to room channel
    await redisSubscriber.subscribe(`room:${roomId}`, (message) => {
      io.to(roomId).emit("update", JSON.parse(message));
    });
  });

  socket.on("move", async (data) => {
    // Publish to Redis
    await redisClient.publish(`room:${data.roomId}`, JSON.stringify(data));
  });
});
```

### Phase 2: Add Caching

```typescript
// Cache frequently accessed data
const getCachedRoom = async (roomId: string) => {
  const cached = await redis.get(`room:${roomId}`);
  if (cached) return JSON.parse(cached);

  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  await redis.set(`room:${roomId}`, JSON.stringify(room), "EX", 3600);
  return room;
};
```

### Phase 3: Load Balancing

```nginx
# nginx.conf
upstream http_backend {
    least_conn;
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

upstream ws_backend {
    ip_hash;  # Sticky sessions for WebSocket
    server ws1:3001;
    server ws2:3001;
    server ws3:3001;
}

server {
    listen 80;

    location /api {
        proxy_pass http://http_backend;
    }

    location /socket.io/ {
        proxy_pass http://ws_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Capacity Planning

### Single Server Limits

- **WebSocket Connections**: ~10,000-50,000 per server
- **HTTP Requests**: ~5,000-10,000 req/sec per server
- **Database**: ~200-500 concurrent connections

### Scaling Targets

| Users | HTTP Servers | WS Servers | DB  | Redis |
| ----- | ------------ | ---------- | --- | ----- |
| 10K   | 2            | 2          | 1   | 1     |
| 100K  | 5            | 10         | 1+2 | 2     |
| 1M    | 20           | 50         | 1+5 | 5     |

---

## Cost Optimization

1. **Use spot instances** for non-critical workers
2. **Auto-scaling** based on load
3. **CDN** for static content
4. **Database connection pooling**
5. **Compress WebSocket messages**
6. **Lazy load features**

---

## Security Considerations

```
┌──────────────────────────────────────┐
│           Security Layers            │
├──────────────────────────────────────┤
│ 1. DDoS Protection (Cloudflare)      │
│ 2. Rate Limiting (Redis)             │
│ 3. JWT Authentication                │
│ 4. Input Validation (Zod)            │
│ 5. SQL Injection Prevention (Prisma) │
│ 6. XSS Protection (React)            │
│ 7. CORS Configuration                │
│ 8. Helmet.js (HTTP Headers)          │
└──────────────────────────────────────┘
```

---

## Future Enhancements

### 1. Global Distribution

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   US East  │     │   Europe   │     │   Asia     │
│            │     │            │     │            │
│ - Backend  │     │ - Backend  │     │ - Backend  │
│ - Database │────▶│ - Database │────▶│ - Database │
│ - Redis    │     │ - Redis    │     │ - Redis    │
└────────────┘     └────────────┘     └────────────┘
     ▲                   ▲                   ▲
     │                   │                   │
Users (Americas)    Users (Europe)     Users (Asia)
```

### 2. Conflict Resolution (CRDT)

- Use Conflict-free Replicated Data Types
- Allow offline editing
- Automatic merge on reconnection

### 3. Time Travel / Replay

- Store all moves in event log
- Replay entire game history
- Export as video

### 4. AI Features

- AI opponent
- Move suggestions
- Pattern recognition

---

## Deployment Checklist

- [ ] Set up Redis cluster
- [ ] Configure load balancer
- [ ] Enable database replication
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure alerts
- [ ] Set up CI/CD pipeline
- [ ] Enable auto-scaling
- [ ] Configure CDN
- [ ] Set up backup strategy
- [ ] Implement rate limiting
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation

---

## Questions for Your Presentation

1. **How do multiple WebSocket servers communicate?**
   - Via Redis Pub/Sub - servers publish to channels, all instances receive

2. **How to handle 100,000 concurrent users?**
   - Horizontal scaling: 50+ WS servers behind load balancer
   - Redis for cross-server communication
   - Database read replicas

3. **What if Redis goes down?**
   - Redis Sentinel for high availability
   - Redis Cluster for partitioning
   - Fallback to database for critical data

4. **How to prevent data loss?**
   - Write to database before broadcasting
   - Event sourcing pattern
   - Regular backups

5. **How to debug issues in production?**
   - Centralized logging (ELK)
   - Distributed tracing (Jaeger)
   - Metrics dashboards (Grafana)
   - Error tracking (Sentry)

---

Built with ❤️ for scalable real-time collaboration
