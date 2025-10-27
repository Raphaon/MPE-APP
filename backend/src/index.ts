import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';

import { env } from '@/config/env';
import prisma from '@/config/prisma';
import router from '@/routes';
import { errorHandler } from '@/middleware/error-handler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
app.use(errorHandler);

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', socket => {
  socket.on('private-message', async ({ senderId, receiverId, content }) => {
    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
    });
    socket.emit('message-sent', message);
    socket.to(receiverId).emit('message-received', message);
  });

  socket.on('join', (userId: string) => {
    socket.join(userId);
  });
});

httpServer.listen(env.port, () => {
  console.log(`BRETHRENFGM backend listening on port ${env.port}`);
});
