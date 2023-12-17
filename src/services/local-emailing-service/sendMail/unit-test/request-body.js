module.exports = {
	requestBody: {
		username: {
			key: 'username',
			type: 'string',
			example: 'TheGuy',
			required: true,
		},
		password: {
			key: 'password',
			type: 'string',
			example: 'Password123!76',
			required: true,
		},
	},
	flattened: {
		username: 'TheGuy',
		password: 'Password123!76',
	},
};
