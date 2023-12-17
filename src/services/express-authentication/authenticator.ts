import { BaseAuthenticator } from '@eezze/base';
import { ActionDataManager as ADM, LogicChain } from '@eezze/classes';
import EJson from '@eezze/classes/logic/json';
import { EAuthenticator } from '@eezze/decorators';

@EAuthenticator({
	type: 'jwt',
	additionalHeaders: { type: 'id-token' },
	secret: process.env.JWT_SECRET,
	sources: [
		{ src: (adm: ADM) => adm.request.urlParams?.authorization },
		{ src: (adm: ADM) => adm.request.urlParams?.token },
		{ src: (adm: ADM) => adm.request.requestHeaders?.authorization },
	],
	user: async (adm: ADM, lc: LogicChain) => {
		try {
			lc.object(adm.result?.payload);

			lc.object((cur: any) => ({
				id: cur.id,
				firstName: cur.firstName,
				lastName: cur.lastName,
				username: cur.username,
				email: cur.email,
				emailVerified: cur.emailVerified,
				handle: cur.handle,
				avatar: cur.avatar,
				active: cur.active,
				roles: EJson.parseKeyArray(cur, 'roles'),
			}));

			return await lc.result();
		}
		catch (err) {
			console.log('Error: ', err);
		}
	},
	roles: (adm: ADM) => EJson.parseKeyArray(adm.result?.payload, 'roles'),
})
export default class ExpressAuthenticationAuthenticator extends BaseAuthenticator {}