import { SocketContrller, OnConnection, OnDisconnect } from './decorators';

@SocketContrller({path: '/'})
export default class SocketContrller2 {
    @OnConnection()
    _conn() {
        console.log('connected from SocketContrller2');
    }
}