import http from 'http';
import socketService from './services/socket';

async function init() {
    const httpserver = http.createServer();

    // Attach the HTTP server to the SocketService instance
    socketService.io.attach(httpserver);

    const PORT = process.env.PORT || 8000;
    httpserver.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

init();