const socket = io();  // Esto se conecta al servidor por defecto (puedes especificar el puerto si es necesario)

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

txtMensaje.addEventListener('keyup', (keyCode) => {
    const mensaje = txtMensaje.value;

    console.log(mensaje,'llegada')

    if (keyCode !== 13) { return; }
    if (mensaje.length === 0) { return; }
    socket.emit('enviar-mensajes', { mensaje })
})


// Escuchar el evento 'enviar-mensajes' desde el servidor
socket.on('enviar-mensajes', (payload) => {
    console.log('Mensaje recibido:', payload);

    // Crear un nuevo elemento de lista para el mensaje
    const li = document.createElement('li');
    li.textContent = `${payload.uid}: ${payload.mensaje}`;

    // Agregar el mensaje a la lista de mensajes
    ulMensajes.appendChild(li);
});

socket.on('recibir-mensaje',(payload)=>{
    console.log('llego chat')

});

socket.on('usuarios-activos', (usuarios) => {
    console.log('Usuarios activos:', usuarios);

    // Dibujar los usuarios en la lista
    let usersHtml = '';
    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <strong>${nombre}</strong> - <span class="text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
});
