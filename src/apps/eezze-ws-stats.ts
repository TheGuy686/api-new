require('../../plugins/eezze/init-app');

const EezzeWsStats = require('../servers/eezze-ws-stats').default;

new EezzeWsStats().run();