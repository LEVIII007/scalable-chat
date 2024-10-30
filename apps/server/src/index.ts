import http from 'http';
import SocketService from './services/socket';

async function init() {
    const httpserver = http.createServer();
    const socketService = new SocketService();

    // Attach the HTTP server to the SocketService instance
    socketService.io.attach(httpserver);

    const PORT = process.env.PORT || 8000;
    httpserver.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    socketService.initListeners();
}

init();