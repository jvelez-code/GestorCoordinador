

    import { Request , Response } from 'express';
    // Ami-io
    const AmiIo = require("ami-io");

    const SilentLogger = new AmiIo.SilentLogger();

    // Login Credentials
    const amiuser = {
        port: 5038,
        host: '10.1.0.186',
        login: 'gestor',
        password: 'gestor',
        encoding: 'ascii',
        logger: SilentLogger
    };

    // Create AMI Client
    const amiio = AmiIo.createClient(amiuser);

    // Action Login
    amiio.connect();

    // Response Login Success
    amiio.on('connected', function () {

        const numbers = ['83222863219', '83504321330'];
        // Action Originate
        function llamar(numero: any){
        var action = new AmiIo.Action.Originate();
        action.Channel = 'PJSIP/1430';
        action.Context = 'SalidaLlamadaCelular';
        action.Exten = numero;
        action.Priority = 1;
        action.Async = true;

        amiio.send(action, function (err: any, data: any) {
            if (err) {
                console.log('Originate Failed...');
            } else {
                console.log('Originate Success...');
            }
        });
    }

    numbers.forEach(llamar)

        setTimeout(function () {
            // Action Logoff
            amiio.disconnect();

            amiio.on('disconnected', process.exit());
        }, 120000);
    });



    amiio.on('incorrectServer', function () {
        amiio.logger.error("Invalid AMI welcome message.");
        process.exit();
    });

    amiio.on('connectionRefused', function () {
        amiio.logger.error("Connection refused.");
        process.exit();
    });

    amiio.on('incorrectLogin', function () {
        amiio.logger.error("Login or Password Incorrect.");
        process.exit();
    });

    // Received Events https://medium.com/asterisk-tips-101/ami-asterisk-management-interface-e0c82813d448
    amiio.on('event', function (event: any) {
        switch (event.event) {
            case 'DeviceStateChange':
                console.log(`DeviceStateChange: ${event.device} - ${event.state}`);
                break
            case 'OriginateResponse':
                console.log(`OriginateResponse: ${event.response} - ${event.channel}`);
                break;
            case 'HangupRequest':
                console.log(`HangupRequest: ${event.channel}`);
                break;
            case 'BridgeCreate':
                console.log(`BridgeCreate: ${event.bridgeuniqueid}`);
                break;
            case 'BridgeEnter':
                console.log(`BridgeEnter: ${event.bridgeuniqueid} - ${event.channel}`);
                break;
            case 'BridgeLeave':
                console.log(`BridgeLeave: ${event.bridgeuniqueid} - ${event.channel}`);
                break;
            default:
                // Others Events
                break;
        }
    });