const RequestBody = require('./request-body');
// isDev=true
module.exports = {
	host: `${process.env['SERVER_HOST']}:${process.env['SERVER_PORT']}`,
	path: `/login`,
	body: RequestBody.flattened,
};
