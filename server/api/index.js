import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from '../configs/db.js'; // Vercel requires relative pathing
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from '../inngest/index.js'; // adjust if needed

const app = express();
let isConnected = false; // Prevent multiple DB connections

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/inngest', serve({ client: inngest, functions }));

// Vercel handler
export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return app(req, res);
}