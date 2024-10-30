'use client'

import React, { useCallback, useEffect } from 'react'
import { io } from 'socket.io-client';

interface SockerProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (message: string) => any;

}



const SocketContext = React.createContext<ISocketContext | null>(null);

export const SockerProvider: React.FC = ({ children }: SockerProviderProps) => {

    const sendMessage : ISocketContext['sendMessage'] = useCallback((msg) => {
        console.log('Message sent:', msg);
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:8000');
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        return () => {
            socket.disconnect();
        };
    }
    , []);

    return (
        <SocketContext.Provider value={{ sendMessage }}>
            {children}
        </SocketContext.Provider>
    );
    }