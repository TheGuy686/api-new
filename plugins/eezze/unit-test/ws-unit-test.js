const Request = require('@eezze/classes/Request').default;
const { serializeUrl } = require('@eezze/libs/HttpMethods');

module.exports = class WsUnitTest {
	static async run({
        logger,
        opId,
        url,
        path,
        urlParams,
        method,
        requestBody,
        headers,
    }) {
		try {
			logger.debug({
				opId,
				data: {
					message: `"${method.toUpperCase()}" ExpressAuthentication UNIT TEST RUN FROM: ${__dirname}`,
				},
			});

			logger.info({ opId, data: { message: url } });

            const urlP = serializeUrl(url, path, urlParams);

            console.log(urlP);

			let res = await Request[method](urlP, requestBody ?? {}, false, headers ?? {}, { logger })
				.then((data) => data.toObject())
				.catch((data) => data.toObject());

			const payload = {
				opId,
				data: {
					requestInfo: { requestBody },
					...res,
				},
			};

			if (res.statusCode > 199 && res.statusCode < 300) logger.success(payload);
			else logger.error(payload);

			return res;
		}
		catch (e) {
			logger.error({ operationId: opId, data: { error: e.message } });
		}
	}
};
