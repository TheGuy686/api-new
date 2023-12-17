const UrlParameters = require('./url-parameters');
// isDev=true
module.exports = {
	host: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
	path: `/auth/user?${UrlParameters.urlFlattened}`,
};