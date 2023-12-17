const Request = require('@eezze/base/unit-test/Request');

const operationId = 'createDatasource';

module.exports = class GetUnitTest {
	static async run(logger) {
		try {
			const ReqInfo = require('./request');

			let url = `${ReqInfo.host}${ReqInfo.path}`;

			logger.debug({
				operationId,
				data: {
					message: `Get ${operationId} UNIT TEST RUN FROM: ${__dirname}`,
				},
			});

			logger.info({ operationId, data: { message: url } });

			let res = await Request.get(url)
				.then((data) => data.toObject())
				.catch((data) => data.toObject());

			let payload = {
				operationId,
				data: {
					requestInfo: {
						parameters: Request.parameters,
					},
					...res,
				},
			};

			if (res.success) logger.success(payload);
			else logger.error(payload);

			return;
		}
		catch (e) {
			logger.error({ operationId, data: { error: e.message } });
		}
	}
};
