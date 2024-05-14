import { io, Socket } from "socket.io-client";


class SocketService {
    socket = Socket | null;

    conect(url) {
        return new Promise((res, rej) => {
            this.socket = io(url);

            if (!this.socket) return rej();

            this.socket.on('connnect', () => {
                res(this.socket)
            })

            this.socket.on('connect_error', (err) => {
                console.log('Connection error: ', err);
                rej(err);
            })

        })
    }
}

export default new SocketService();