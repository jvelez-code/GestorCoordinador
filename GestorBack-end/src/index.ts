import "reflect-metadata"
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('src/web_enlace.key', 'utf8');
var certificate = fs.readFileSync('src/web_enlace.cer', 'utf8');





import app from './app';
import { DataSourceGestor, DataSourceContact }  from  './db';


 async function main () {
     try {
       
          await DataSourceGestor.initialize();
          console.log("Conexion ok Gestor");

          await DataSourceContact.initialize();
          console.log("Conexion ok Contact");

            var credentials = {key: privateKey, cert: certificate};

            var httpServer = http.createServer(app);
            var httpsServer = https.createServer(credentials, app);

         
          
            httpServer.listen(process.env.PORT, ()=>{
                console.log("PuertosHttp", process.env.PORT)

            });
            httpsServer.listen(process.env.PORTS, ()=> {
                console.log("PuertosHttps", process.env.PORTS)

            });

           
           

     } catch (error) {
         console.log(error);
         
     }     
    }
    main()
     

