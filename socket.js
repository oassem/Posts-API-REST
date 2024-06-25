const { Server } = require('socket.io')

let io

module.exports = {
    init: httpServer => {
        io = new Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        })

        return io
    },

    getIO: () => {
        if (!io) {
            throw new Error('IO not initialized')
        }

        return io
    }
}