const lblOnline = document.querySelector('#lblOnline')
const lblOffline = document.querySelector('#lblOffline')
const txtMensaje = document.querySelector('#txtMensaje')
const btnEnviar = document.querySelector('#btnEnviar')


const socket = io();

socket.on('connect', () =>{
    lblOffline.style.display = 'none';
    lblOnline.style.display = '';
});

socket.on('disconnect', () =>{
    console.log('Desonectado del servidor')
    lblOnline.style.display = 'none';
    lblOffline.style.display = '';
});

socket.on('enviar-mensaje', ( payload ) =>{
    console.log( 'que es ',payload )
})


btnEnviar.addEventListener('click', () =>{
    const mensaje  = txtMensaje.value;
    const payload = {
        mensaje,
        id: '123ABC',
        fecha: new Date().getTime()

    }

    socket.emit('usuarios-activos', payload, (id)=>{
        console.log('Desde el server', payload, id );
    });
})