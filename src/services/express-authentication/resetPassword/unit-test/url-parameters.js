module.exports = {
	parameters: {
		urlParameterEmailVerifyToken: {
			key: 'urlParameterEmailVerifyToken',
			name: 'Email Verify Token',
			description:
				'This param is what will be supplied from the verify email sent out. Once a valid token has been processed this will then update the user to is verified',
			example: 'lkajsdfoieurlkajsdflkasdfu987aflkjselrkjaslkdjfljkj',
			type: 'string',
		},
	},
	urlFlattened: 'urlParameterEmailVerifyToken=lkajsdfoieurlkajsdflkasdfu987aflkjselrkjaslkdjfljkj',
	flattened: {
		urlParameterEmailVerifyToken: 'lkajsdfoieurlkajsdflkasdfu987aflkjselrkjaslkdjfljkj',
	},
};
