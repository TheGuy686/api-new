const Request = require('@eezze/base/unit-test/Request');

const opperationId = 'deleteRemoveAuthUser';

module.exports = class DeleteUnitTest {
	static async run(logger) {
		try {
			const ReqInfo = require('./request');

			let url = `${ReqInfo.host}${ReqInfo.path}`;

			logger.debug({
				opperationId,
				data: {
					message: `Delete ExpressAuthentication UNIT TEST RUN FROM: ${__dirname}`,
				},
			});

			logger.info({ opperationId, data: { message: url } });

			let res = await Request.delete(url)
				.then((data) => data.toObject())
				.catch((data) => data.toObject());

			logger.info({ opperationId, data: res });

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

			return res;
		} catch (e) {
			logger.error({ opperationId, data: { error: e.message } });
		}
	}
};
