module.exports = {
	requestBody: {
		username: {
			key: 'username',
			type: 'string',
			example: 'TheGuy',
			required: true,
		},
		email: {
			key: 'email',
			type: 'string',
			example: 'example@email.com',
			required: true,
		},
		password: {
			key: 'password',
			type: 'string',
			example: 'Password123!&^',
			required: true,
		},
	},
	flattened: {
		username: 'TheGuy',
		email: 'example@email.com',
		password: 'Password123!&^',
	},
};
