import express, { Request, Response } from 'express';

const app = express();

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

// API Routes
// app.use('/api/v1', router);

// Error Handler
// app.use(notFoundHandler);
// app.use(errorHandler);

export default app;
