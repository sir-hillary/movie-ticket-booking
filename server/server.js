import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./inngest/index.js";
import showRouter from "./routes/showRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhook.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
await connectDB();


//Stripe webhooks route

app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY
}));

//Routes
app.get("/", (req, res) => {
  res.send("Welcome to the QuickShow API");
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/shows", showRouter);
app.use("/api/booking", bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
