import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    path: '/api/socketio',
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
    });

    // Join calendar room for collaboration
    socket.on('join-calendar', (calendarId) => {
      socket.join(`calendar:${calendarId}`);
    });

    // Handle real-time event updates
    socket.on('event-updated', (data) => {
      socket.to(`calendar:${data.calendarId}`).emit('event-updated', data);
    });

    // Handle real-time event creation
    socket.on('event-created', (data) => {
      socket.to(`calendar:${data.calendarId}`).emit('event-created', data);
    });

    // Handle real-time event deletion
    socket.on('event-deleted', (data) => {
      socket.to(`calendar:${data.calendarId}`).emit('event-deleted', data);
    });

    // Handle typing indicators for notes
    socket.on('typing-start', (data) => {
      socket.to(`calendar:${data.calendarId}`).emit('typing-start', data);
    });

    socket.on('typing-stop', (data) => {
      socket.to(`calendar:${data.calendarId}`).emit('typing-stop', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};