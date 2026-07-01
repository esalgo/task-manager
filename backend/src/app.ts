import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { statisticsRouter } from './modules/statistics/statistics.routes.js';
import { tasksRouter } from './modules/tasks/tasks.routes.js';
import { usersRouter } from './modules/users/users.routes.js';

export const app: any = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/statistics', statisticsRouter);

app.get("/health", (req: void, res: any) => {
    res.json("La api está corriendo...")
})


app.use(errorHandler);
