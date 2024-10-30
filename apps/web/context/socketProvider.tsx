'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client';

interface SockerProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (message: string) => any;
    messages: string[];
}



const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) { 
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return state;
}

export const SocketProvider: React.FC<SockerProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);


    const sendMessage : ISocketContext['sendMessage'] = useCallback((msg) => {
        console.log('Message sent:', msg);
        if(socket)[
            socket.emit('event:message', { message: msg })
        ]
    }, [socket]);

    const onMessageReceived = useCallback((msg: string) => {
        const {message} = JSON.parse(msg) as {message: string};
        setMessages((prev) => [...prev, msg]);
    }
    , []);

    useEffect(() => {
        const _socket = io('http://localhost:8000');
        _socket.on('message', onMessageReceived);
        _socket.on('connect', () => {
            console.log('Connected to server');
        });
        setSocket(_socket);

        return () => {
            _socket.off("message", onMessageReceived);
            _socket.disconnect();
            setSocket(undefined);
        };
    }
    , []);

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>

        {children}
  
      </SocketContext.Provider>
    );
    }