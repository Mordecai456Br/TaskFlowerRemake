import express from 'express';
import projectsRouter from "./routes/projects";
import cors from "cors";
import securityMiddleware from "./middleware/security.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();
const port = 3000;

if(!process.env.FRONTEND_URL) throw new Error("Missing FRONTEND_URL in .env file");

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(securityMiddleware);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use('/api/projects', projectsRouter);

app.get('/', (req, res) => {
    res.send("Welcome to TaskFlower!")
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
})

app.use(express.json());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
})
