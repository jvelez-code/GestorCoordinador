import "reflect-metadata"
import app from './app';

const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');


// const options = {
//     key: fs.readFileSync('certs/web_enlace.key', 'utf8'),
//     cert: fs.readFileSync('certs/SSL_wc.enlace-apb.com.cer', 'utf8'),
//   };



 async function main () {
     try {
       

        const httpServer = http.createServer(app);
       // const httpsServer = https.createServer(options, app);
        

              // Iniciar el servidor HTTP
              httpServer.listen(process.env.PORT, () => {
                console.log(`Servidor HTTP escuchando en el puerto ${process.env.PORT}`);
              });
              
              // // Iniciar el servidor HTTPS
              // httpsServer.listen(process.env.PORTS, () => {
              //   console.log(`Servidor HTTPS escuchando en el puerto ${process.env.PORTS}`);
              // });

     } catch (error) {
         console.log(error);
         
     }     
    }
    main()
     
