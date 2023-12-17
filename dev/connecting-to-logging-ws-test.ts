require('dotenv-json')({ path: '.env.json' });

const ESocket = require('../dist/plugins/eezze/classes/ESocket').default;
const Logger = require('../dist/plugins/eezze/classes/Logger').default;

(async () => {

    const args = {
        host: `ws://${process.env.HOST_IP}`,
        port: process.env.DEFAULT_WS_LOGGING_SERVER_PORT,
        logger: new Logger('logging-server-con-test'),
        autoReconnect: true,
        path: '/v1'
    };

    const socket = new ESocket(
        args,
        {
            onConnect: () => {
                console.log('Connected successfully');
            },
            onDisconnect: () => {
                console.log('Disconnected');
            },
        }
    );

    socket.connect(args); 

})();