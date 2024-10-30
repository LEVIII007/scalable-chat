import { Server } from 'socket.io';
import http from 'http';
import {Redis} from 'iovalkey';

const pub = new Redis(
    {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    }
)
const sub = new Redis(
    {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    }
);

class SocketService {
    private _io: Server;

    constructor() {
        console.log('SocketService constructor');
        const server = http.createServer();
        this._io = new Server(server, {
            cors: {
                origin: '*',
                allowedHeaders: '*',
            },
            // Add any necessary options here
        });
        sub.subscribe('MESSAGES');


    }

    public initListeners() {
        const io = this._io;
        console.log('SocketService initListeners');
        this._io.on('connect', (socket) => {
            console.log('new Socket connected', socket.id);
            // Add any necessary listeners here

            socket.on('disconnect', () => {
                console.log('Socket disconnected', socket.id);
            });

            socket.on('event:message', async({message} : {message : string}) => {
                console.log('message', message);
                await pub.publish('MESSAGES', JSON.stringify({message}));
                // socket.emit('event:message', {message});
            }
            
            );

        });

        sub.on('message', async (channel, message) => {
            if(channel === 'MESSAGES') {
                console.log('message received', message);
                io.emit('event:message', JSON.parse(message));
            }
    }


    get io() {
        return this._io;
    }
}

export default new SocketService();