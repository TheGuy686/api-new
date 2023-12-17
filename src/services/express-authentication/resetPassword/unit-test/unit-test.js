const Request = require('@eezze/base/unit-test/Request');

const opperationId = 'getVerifyEmail';

module.exports = class GetUnitTest {
	static async run(logger) {
		try {
			const ReqInfo = require('./request');

			let url = `${ReqInfo.host}${ReqInfo.path}`;

			logger.debug({
				opperationId,
				data: {
					message: `Get ExpressAuthentication UNIT TEST RUN FROM: ${__dirname}`,
				},
			});

			logger.info({ opperationId, data: { message: url } });

			let res = await Request.get(url)
				.then((data) => data.toObject())
				.catch((data) => data.toObject());

			let payload = {
				opperationId,
				data: {
					requestInfo: {
						parameters: Request.parameters,
					},
					...res,
				},
			};

			if (res.success) logger.success(payload);
			else logger.error(payload);

			return 	;
		} catch (e) {
			logger.error({ opperationId, data: { error: e.message } });
		}
	}
};
