require('../../../../plugins/eezze/init-app');

import { ESocket, Logger } from '@eezze/classes';

console.clear();

let ws: any;

const idToken = 'eyJzaWciOiIxNmVhYTVmYjg2NjQ4YjlhNGIxNzAzYWNmZTU4ZDE1NjEzMDQ2ZjE4MjhjM2ZjMzVjN2Y3OGJjM2I1NDU5ZDhhIiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QiLCJ0eXBlIjoiOWZkOTliNTBhNmE5OThiNWFmMzMyOTUwYzlkY2Q3NGY5YTYyY2IwMWQ3ZTRjZmE4MGU2NGIwMWY2MTdlMmY3MyJ9.eyJwYXlsb2FkIjp7InVzZXJJZCI6MTQ3LCJmaXJzdE5hbWUiOiJKb2UiLCJsYXN0TmFtZSI6IkJsb2dzIiwidXNlcm5hbWUiOiJSeWFuQ29va2UiLCJlbWFpbCI6InJ5YW5qY29va2VAaG90bWFpbC5jb20iLCJlbWFpbFZlcmlmaWVkIjoxLCJyb2xlcyI6WyJST0xFX1VTRVIiXX0sInNpZ25hdHVyZSI6IjE2ZWFhNWZiODY2NDhiOWE0YjE3MDNhY2ZlNThkMTU2MTMwNDZmMTgyOGMzZmMzNWM3Zjc4YmMzYjU0NTlkOGEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDEiLCJpYXQiOjE2MzY3MDc5MjY4ODksImV4cCI6NzIwMDAwMCwiZXhwQXQiOjE2MzY3MTUxMjY4ODl9.TlEk1e35cgnSsh29qoVOkgEQ7J_V0ae5ZrS0_A3jgZA';

function emit(event: string, data: any) {
console.log(JSON.stringify({event, data}));
    ws.send(JSON.stringify({event, data}));
}

setTimeout(() => {
    const WS = require('websocket').w3cwebsocket;

    ws = new WS(`ws://localhost:2000/v1?authorization=${idToken}`);

    const counter = 0;

    ws.onopen = function() {
        console.log('ws open');
        emit('generate-controllers', {});

        // setInterval(
        //     () => {
        //         console.clear();
        //         console.log('Emitted: ' + counter);
        //         emit('generate-controllers', {});
        //         counter++;
        //     },
        //     15000
        // );
    };

    ws.onclose = function() {
        // process.exit()
        console.log('ws closed');
    };

}, 1000);