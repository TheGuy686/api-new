const Request = require('@eezze/classes/Request').default;
const { serializeUrl } = require('@eezze/libs/HttpMethods');

module.exports = class RestUnitTest {
	static async run({
		id,
		opId,
		url,
		path,
		urlParams,
		method,
		requestBody,
		headers,
		logger,
		adm,
	}) {
		try {
			logger.info(
				{
					id,
					operationId: opId,
					data: {
						message: `"${method.toUpperCase()}" "${id}" UNIT TEST RUN FROM: ${__dirname}`,
					},
				}, 
				{ _srcId: 'unit-test-exec', operationId: opId, id },
				adm,
				[ 'info' ],
				false,
			);

			const urlP = serializeUrl(url, path, urlParams);

			const res = await Request[method](urlP, requestBody ?? {}, false, headers ?? {}, { logger })
							.then((data) => data.toObject())
							.catch((data) => data.toObject());

			const payload = {
				id,
				operationId: opId,
				data: {
					requestInfo: { requestBody },
					...res,
					operationId: opId,
					id,
				},
			};

			if (res.statusCode > 199 && res.statusCode < 300) {
				adm.setResult(payload);
				logger.success(
					{
						id,
						operationId: opId,
						data: {
							message: `"${method.toUpperCase()}" "${id}" Successfully ran`,
						},
					}, 
					{ _srcId: 'unit-test-success', operationId: opId, id }, 
					adm,
					[ 'success' ],
					false,
				);
			}
			else {
				logger.error(
					payload, 
					{ _srcId: 'unit-test-error', operationId: opId, id }, 
					adm,
					[ 'error' ],
					false,
				);
			}

			return res;
		}
		catch (e) {
			logger.error({ operationId: opId, data: { error: e.message } }, { _srcId: 'unit-test-error', operationId: opId, id}, adm);
		}
	}
};
