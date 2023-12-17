import { SocketContrller, OnConnection, OnDisconnect, OnMessage, On } from './decorators';

@SocketContrller({path: '/channel'})
export default class SocketContrller1 {
    // @EPost({path: '/role', success: 'evt_success', fail: 'key-fail'})
	// static async createRole() {}

    @On({event: 'client-message'})
    async _clientMessage(socket: any, data: any) {
        console.log('On Client Message: ', data);
    }

    @OnMessage()
    async _(data: any) {
        console.log('On Message ', data);
    }
}