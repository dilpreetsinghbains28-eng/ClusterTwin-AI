require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');

const connectDB = require('./database/db');
const { errorHandler } = require('./middleware/errorMiddleware');


const app = express();

const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const logger = require('./utils/logger');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Production Hardening: Security and utility middleware
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
  },
}));
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Production Hardening: Compression
app.use(compression());

// Production Hardening: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sanitize data (NoSQL Injection)
app.use(mongoSanitize());
// Prevent XSS attacks
app.use(xss());
// Prevent HTTP Param Pollution
app.use(hpp());

// API Documentation (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST']
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  socket.on('join_factory', (factoryId) => {
    socket.join(`factory_${factoryId}`);
    console.log(`Client ${socket.id} joined room: factory_${factoryId}`);
  });

  socket.on('leave_factory', (factoryId) => {
    socket.leave(`factory_${factoryId}`);
    console.log(`Client ${socket.id} left room: factory_${factoryId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'ClusterTwin AI Platform API Running' });
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const factoryRoutes = require('./routes/factoryRoutes');
const machineRoutes = require('./routes/machineRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const productionRoutes = require('./routes/productionRoutes');
const energyRoutes = require('./routes/energyRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const reportRoutes = require('./routes/reportRoutes');
const aiRoutes = require('./routes/aiRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const transferRoutes = require('./routes/transferRoutes');

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/factories', factoryRoutes);
app.use('/api/v1/machines', machineRoutes);
app.use('/api/v1/sensors', sensorRoutes);
app.use('/api/v1/production', productionRoutes);
app.use('/api/v1/energy', energyRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/simulations', simulationRoutes);
app.use('/api/v1/transfers', transferRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start services
connectDB().then(() => {
  // Optionally start IoT Simulator within this process
  if (process.env.ENABLE_SIMULATOR?.trim() === 'true') {
    const startSimulator = require('./scripts/iotSimulator');
    startSimulator(io);
  }

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch(err => {
  console.error("Database connection failed", err);
  process.exit(1);
});
