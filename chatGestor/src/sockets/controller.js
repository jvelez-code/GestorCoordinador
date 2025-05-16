
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes();





const socketController = (socket, io) => {

    console.log('Mensaje socket.id:', socket.id);



    const usuario = { id: socket.id, nombre: 'Jaime' }

    socket.on('enviar-mensajes', (payload) => {
        console.log('Mensaje recibido:', payload);
        io.emit('recibir-mensaje', payload)
        socket.broadcast.emit('enviar-mensajes', payload);
   })

   socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
});




    // //MODULO INDEX

    // console.log('Cliente Conectado', socket.id);

    // socket.on('disconnect', () => {
    //     console.log('Cliente Desconectado', socket.id);
    // });

    // socket.on('enviar-mensaje', (payload, callback) => {
    //     const id = usuario.nombre;
    //     callback(id);

    //     socket.broadcast.emit('enviar-mensaje', payload);

    // });

}

module.exports = {
    socketController
}