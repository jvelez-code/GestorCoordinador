const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    host: 'mail.jaimetorres.net',
    port: 25,
    secure: false,
    auth: {
        user: 'gestorclientes@jaimetorres.net',
        pass: process.env.EMAIL_PASSWORD
    },
});


async function sendEmail(to, subject, nombre, mensaje, template) {
    const filePath = path.join(__dirname, '../templates/', `${template}.html`);
    // Retornar una promesa
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, html) => {
            if (err) {
                console.error('Error leyendo el archivo:', err);
                return reject(err);
            }

            const template = handlebars.compile(html);
            const data = {
                nombre: nombre,
                mensaje: mensaje
            };
            const htmlConDatos = template(data);

            const mailOptions = {
                from: 'gestorclientes@jaimetorres.net',
                to: to,
                cc: 'jaimev_tec@jaimetorres.net',
                subject: subject,
                html: htmlConDatos
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error al enviar el correo:', error);
                    return reject(error);
                }
                console.log('Correo enviado:', info.response);
                resolve(info);
            });
        });
    });
}



const correosMongo = async (email, subject, nombre, mensaje, template) => {

    try {
        await sendEmail(email, subject, nombre, mensaje, template);
    } catch (error) {
        console.error('Error en correosMongo:', error);
    }
};



module.exports = {
    correosMongo
}
