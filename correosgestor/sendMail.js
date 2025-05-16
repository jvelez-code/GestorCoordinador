// Importar Nodemailer
const nodemailer = require('nodemailer');

// Configuración del transporte
const transporter = nodemailer.createTransport({
    host: 'mail.jaimetorres.net',
    port: 25, // Usar este puerto para STARTTLS
    secure: false, // Indica que la conexión se asegurará después de establecerse
    auth: {
        user: 'gestorclientes@jaimetorres.net',
        pass: 'G3st0r3*',
    },
    logger: true,
    debug: true,

});

// Configuración del correo
const mailOptions = {
    from: 'gestorclientes@jaimetorres.net', // Remitente
    to: 'jaimev_tec@jaimetorres.net', // Destinatario
    subject: 'Asunto del correo', // Asunto
    text: 'Cuerpo del correo en texto plano', // Cuerpo en texto plano
    html: '<h1>Cuerpo del correo en HTML</h1>' // Cuerpo en HTML (opcional)
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error al enviar el correo: ' + error);
    }
    console.log('Correo enviado: ' + info.response);
});
