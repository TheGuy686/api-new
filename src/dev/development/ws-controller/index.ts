require('../../../../plugins/eezze/init-app');

import SocketServerDatasource from './ds';

(async () => {await new SocketServerDatasource().run()})();