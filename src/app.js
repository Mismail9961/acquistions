import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import securityMiddleware from './middleware/security.middleware.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(securityMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.body !== undefined) return next();

  const contentType = req.headers['content-type'] || '';
  if (!contentType || contentType.includes('text') || contentType.includes('json')) {
    let rawData = '';
    req.setEncoding('utf8');
    req.on('data', chunk => { rawData += chunk; });
    req.on('end', () => {
      if (rawData.length === 0) return next();
      try {
        req.body = JSON.parse(rawData);
      } catch {
        req.body = rawData;
      }
      next();
    });
    req.on('error', next);
  } else {
    next();
  }
});
app.use(cookieParser());
app.use(cors());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.get('/', (req, res) => {
  logger.info('Received a request to the root endpoint');
  res.status(200).send('Hello for Acquistions API');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' , timestamp: new Date().toISOString() , uptime: process.uptime() });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Acquisitions API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((req,res) => {
  res.status(404).json({ error: 'Router not found' });
});

export default app;
