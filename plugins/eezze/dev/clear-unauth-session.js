#!/usr/bin/env node
require('dotenv-json')({ path: __dirname + '/../../../.env.json' });

const WebSocketServer = require('websocket').server;
const http = require('http');

const shelljs = require('shelljs'), fs = require('fs');

console.clear();

// let hst = 'localhost', port = 4567;
const masterHost = '34.195.92.118';

const isMasterHost = process.env.IS_MASTER_HOST == 'true';

let hst = isMasterHost ? 'localhost' : 'ec2-34-195-92-118.compute-1.amazonaws.com', port = 4567;

const cacheDir = `${shelljs.exec('echo $HOME', {silent: true}).replace('\n', '')}/.eezze`;
const host = `ws://${hst}:${port}`;

console.log('host: ', host);

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(port, hst, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

let adminConnection;

const connections = [];

let sessions = {};

if (!shelljs.test('-d', cacheDir)) shelljs.exec(`mkdir ${cacheDir}`);

function writeSession(access, data = {}) {
    let osId = data?.computerInfo?.os?.uuid?.os;

    if (!(!!osId)) osId = data?.computerInfo?.os?.uuid?.macs[0];

    //console.log('osId: ', data?.computerInfo?.os?.uuid?.macs[0], ' : ', osId, ' : ', !!osId);

    const sessionPath = `${cacheDir}/${access}-${osId}.session`;

    //console.log(`Writing to "${sessionPath}"`);

    if (!shelljs.test('-f', sessionPath)) shelljs.exec(`touch ${sessionPath}`);

    fs.writeFileSync(`${sessionPath}`, JSON.stringify(data, null, 4));
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    const params = request.resourceURL.query,
          access = (params?.access ?? '').replace('\n', '');

    // console.log('Someone connected with paramas: ', params);

    const apiKey = (params?.apiKey ?? '').replace('\n', '');

    writeSession(access);

    if (typeof apiKey != 'undefined' && apiKey != '' && apiKey == 'ALPOIIROEUIYTCI459NDN39479DK_EZ12') {
        console.log(`API KEY BYPASS: "${access}" "${apiKey}"`);
        // request.reject();
        // return;
    }

    if (typeof access == 'undefined' || access == '') {
        request.reject();
        return;
    }

    const connection = request.accept(null, request.origin);

    if ((access == 'theguy' || access == 'theguy-admin') && params?.isAdmin) {
        adminConnection = connection;

        adminConnection.on('message', function(message) {
            try {
                const data = JSON.parse(message.utf8Data);
    
                switch (data.eventName) {
    
                    case 'do-users-delete':

                        console.log('Initiating user delete projects');

                        for (let con of connections) {
                            con.send(JSON.stringify({eventName: 'clear-up-session'}, null, 4));
                        }
                }
            }
            catch (err) {
                console.log('Error parsing event: ', err);
            }
        });
    }
    else connections.push(connection);

    console.log((new Date()) + ' Connection accepted: ' + access);

    connection.on('message', function(message) {
        try {
            const data = JSON.parse(message.utf8Data);

            switch (data.eventName) {

                case 'user-stats':
                    sessions[data.data.access] = data.data.stats;

                    writeSession(data.data.access, data.data.stats);

                    if (adminConnection) {
                        adminConnection.send(JSON.stringify({ eventName: 'user-stats-update', data: data.data }, null, 4));
                        break;
                    }
                    
            }
        }
        catch (err) {
            console.log('Error parsing event: ', err);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});