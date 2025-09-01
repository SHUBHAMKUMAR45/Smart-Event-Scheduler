'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Mock socket implementation for development
    // In production, you would implement proper Socket.IO with a custom server
    const mockSocket = {
      emit: (event: string, data: any) => {
        console.log('Mock socket emit:', event, data);
      },
      on: (event: string, handler: Function) => {
        console.log('Mock socket listener registered:', event);
      },
      off: (event: string, handler: Function) => {
        console.log('Mock socket listener removed:', event);
      },
      disconnect: () => {
        console.log('Mock socket disconnected');
      },
    };

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      setIsConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};