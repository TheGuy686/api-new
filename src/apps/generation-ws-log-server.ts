require('../../plugins/eezze/init-app');

const GenerationWsLogServer = require('../servers/generation-ws-log-server').default;

new GenerationWsLogServer().run();