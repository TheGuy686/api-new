require('../../plugins/eezze/init-app');

const GenerationWsServer = require('../servers/generation-ws-server').default;

new GenerationWsServer().run();