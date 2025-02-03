const { request, response} = require('express');
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
                cc: 'coordcontactcenter_asc@jaimetorres.net,lauravg_asc@jaimetorres.net,lidercalidadoperaciones@jaimetorres.net',
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


const usuariosGet = (req, res) => {
    res.send('Hello World -12');
};

const correosCalidad = async (req = request, res = response) => {
    console.log(req.body); 
    const { email, subject, nombre, mensaje, template } = req.body;

    try {
        await sendEmail(email, subject, nombre, mensaje, template);
        //res.status(200).send('Correo enviado con éxito');
        res.json(
            {
                ok: "Correo enviado con éxito"
            });

    } catch (error) {
        console.error('Error en usuariosPost:', error); 
        //res.status(500).send('Error al enviar el correo');
        res.json(
            {
                ok: "Error al enviar el correo"
            });
    }
};

    

module.exports = {
    usuariosGet,
    correosCalidad
}
