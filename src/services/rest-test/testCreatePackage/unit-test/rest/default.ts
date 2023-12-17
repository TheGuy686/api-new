export default {
	type: 'rest',
	method: 'get',
	url: `http://${process.env.HOST_IP}:2002/v1`,
	path: '/log/test',
	headers: {},
	urlParams: {},
	requestBody: {},
};