const XMLHREQ = require('xmlhttprequest').XMLHttpRequest;

export default class Request {
	static doRequest(url: string, method: string, body?: Object, showUploadFeedBackCb?: Function, headers?: any, context?: any) {
		if (!/^(https|http)/.test(url)) url = `http://${url}`;

		if (context?.logger) {
			if (context?.logger?.adm) {
				context?.logger.info(`Reqeust->doRequest: ${method}: ${url}`, 'Request->doRequest', context.adm);
			}
		}
		else {
			console.log(`Reqeust->doRequest: ${method}: ${url}`);
		}

		if (typeof body !== 'object') body = {};

		const Http = new XMLHREQ();

		Http.open(method, url, true);

		Http.setRequestHeader('Content-Type', 'application/json');

		if (typeof headers == 'object') {
			for (const k in headers) {
				Http.setRequestHeader(k, headers[k]);
			}
		}

		if (typeof showUploadFeedBackCb == 'function') {
			Http.upload.addEventListener(
				'progress',
				function(evt: any)
				{
					if (evt.lengthComputable)
					{
						const percentComplete = (evt.loaded / evt.total) * 100;

						showUploadFeedBackCb(percentComplete);
					}
				},
				false
			);
		}

		return new Promise(
			(resolve) => {
				if (typeof body == 'object' && Object.keys(body).length > 0) {
					Http.send(JSON.stringify(body));
				}
				else Http.send();

				Http.onreadystatechange = (e: any) => {
					if (Http.readyState == 4) {
						// console.log('RESPONSE TEXT: ', Http.responseText);

						const status = Http.status;

						const success = status > 199 && status < 300;

						const resOut: any = {statusCode: Http.status};

						try {
							resOut.body = JSON.parse(Http.responseText);
						}
						catch (err) {
							resOut.body = Http.responseText;
							resOut.error = err.message || err;
						}

						resolve(
							{
								body: Http.responseText,
								status: Http.status,
								success,
								toObject () {
									return resOut;
								}
							}
						);
					}
				}

				Http.onerror = () => resolve({
                    body: Http.responseText,
                    status: Http.status,
					success: false,
                    toObject () {
                        try
                        {
                            return {
								statusCode: Http.status,
								...JSON.parse(Http.responseText)
							};
                        }
                        catch (e) {
							console.log('doRequest:onError: ', e);

                            return {
                                status: Http.status,
                                body: Http.responseText,
                                error: e.message,
                            };
                        }
                    }
                });
			}
		);
	}

	static async get(url: string, body?: any, showUploadFeedBackCb?: Function, headers?: any, context?: any) {
		return await this.doRequest(url, 'GET', body, showUploadFeedBackCb, headers, context);
	}

	static async post(url: string, body?: any, showUploadFeedBackCb?: Function, headers?: any, context?: any) {
		return await this.doRequest(url, 'POST', body, showUploadFeedBackCb, headers, context);
	}

	static async put(url: string, body?: any, showUploadFeedBackCb?: Function, headers?: any, context?: any) {
		return await this.doRequest(url, 'PUT', body, showUploadFeedBackCb, headers, context);
	}

	static async delete(url: string, body?: any, showUploadFeedBackCb?: Function, headers?: any, context?: any) {
		return await this.doRequest(url, 'DELETE', body, showUploadFeedBackCb, headers, context);
	}
}