module.exports = {
	parameters: {
		urlParameterUserId: {
			key: 'urlParameterUserId',
			name: 'User Id',
			description: 'This is an example of how to create a user parameter',
			example: '1123',
			type: 'string',
		},
	},
	urlFlattened: 'urlParameterUserId=1123',
	flattened: {
		urlParameterUserId: '1123',
	},
};
