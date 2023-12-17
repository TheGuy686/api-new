require('../../plugins/eezze/init-app');

const EezzeProjectApi = require('../servers/eezze-project-api').default;

new EezzeProjectApi().run();