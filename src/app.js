import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
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

export default app;
