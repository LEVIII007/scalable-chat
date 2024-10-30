import { Server } from 'socket.io';
import http from 'http';

class SocketService {
    private _io: Server;

    constructor() {
        console.log('SocketService constructor');
        const server = http.createServer();
        this._io = new Server(server, {
            // Add any necessary options here
        });

    }

    public initListeners() {
        console.log('SocketService initListeners');
        this._io.on('connect', (socket) => {
            console.log('new Socket connected', socket.id);
            // Add any necessary listeners here

            socket.on('disconnect', () => {
                console.log('Socket disconnected', socket.id);
            });

            socket.on('event:message', async({message} : {message : string}) => {
                console.log('message', message);
                // socket.emit('event:message', {message});
            }
            );

        });
    }


    get io() {
        return this._io;
    }
}

export default new SocketService();