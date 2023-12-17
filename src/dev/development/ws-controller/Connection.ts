import { EezzeWsRequest, Logger } from "@eezze/classes";
import { pascalCase } from "@eezze/libs/StringMethods";
import { EWebSocket } from '@eezze/classes/EWebSocket';

interface ConnectionArgsI {
    logger: Logger;
    request: any;
    connId: string;
}

// function originIsAllowed(origin) {
//     // put logic here to detect whether the specified origin is allowed.
//     return true;
// }

// if (!originIsAllowed(request.origin)) {
//     // Make sure we only accept requests from an allowed origin
//     request.reject();
//     console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
//     return;
// }

export default class Connection {
    private _isValidConnection: boolean = false;
    private server: any;
    private connection: any;
    private connectionRequest: EezzeWsRequest;

    public get isValidConnection() {return this._isValidConnection}
    public get connPath() {return this.connectionRequest.urlPath}

    constructor(args: ConnectionArgsI, server: EWebSocket) {
        this.server = server;
        if (!this.setConnection(args)) return;
        this.setEvents();
    }

    private setConnection(args: ConnectionArgsI) {
        const request = args.request;

        this.connectionRequest = new EezzeWsRequest(request, args.logger, this.server);

        if (!this.server.checkPath(this.connPath)) {
            console.log(`Path "${this.connPath}" was not a valid path`);
            return false;
        }

        console.log(`"${(new Date())}" Recieved a new connection from origin "${request.host}"`);

        this.connection = request.accept(null, request.host);

        (async () => {
            await this.server.emit(
                'on-connection',
                this.connection,
                {},
                this.connPath
            );
        })();

        this._isValidConnection = true;
        this.server.incrementTotal();

        return true;
    }

    private setEvents() {
        this.connection.on('message', async (data: any) => {
            try {
                data = JSON.parse(data.utf8Data);

                await this.server.emit(
                    `On${pascalCase(data.event)}`,
                    this.connection,
                    {
                        success: true,
                        data: data.data
                    },
                    this.connPath
                );

                return;
            }
            catch (e) {
                console.log(e);
                console.log(data);
                console.log(`Coule not parse message: Got "${data.utf8Data}"`);
            }

            await this.server.emit(
                'OnMessage',
                this.connection,
                {
                    success: false,
                    data: data.utf8Data
                },
                this.connPath
            );
        });

        this.connection.on('close', async (conn: any) => {
            await this.server.emit(
                'on-disconnect',
                this.connection,
                {},
                this.connPath
            );
            this.server.deincrementTotal();
        });
    }
}