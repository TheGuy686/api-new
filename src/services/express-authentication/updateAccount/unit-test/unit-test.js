const Request = require('@eezze/base/unit-test/Request');

const opperationId = 'postRegister';

module.exports = class PostUnitTest {
	static async run(logger) {
		try {
			const ReqInfo = require('./request');

			let url = `${ReqInfo.host}${ReqInfo.path}`;

			logger.debug({
				opperationId,
				data: {
					message: `Post ExpressAuthentication UNIT TEST RUN FROM: ${__dirname}`,
				},
			});

			logger.info({ opperationId, data: { message: url } });

			let res = await Request.post(url, ReqInfo.body)
				.then((data) => data.toObject())
				.catch((data) => data.toObject());

			let payload = {
				opperationId,
				data: {
					requestInfo: {
						requestBody: Request.requestBody,
					},
					...res,
				},
			};

			if (res.success) logger.success(payload);
			else logger.error(payload);

			return res;
		}
		catch (e) {
			logger.error({ opperationId, data: { error: e.message } });
		}
	}
};
