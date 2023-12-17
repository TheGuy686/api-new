import { CreateOne, CreateOneIfNotExists, EAction, GetOne, Query, ReplaceOne, ServiceCaller } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import ActionDataManager from '@eezze/classes/ActionDataManager';
import EezzeJwtToken from '@eezze/classes/EezzeJwtToken';
import { LogicChain, datasource } from '@eezze/classes';

@EAction({
	roles: ['ROLE_ADMIN', 'ROLE_USER'],
	targetRepo: 'Mysql.User',
})
export default class CreateMemberAction extends BaseAction {
	@GetOne({
        checkOn: [ 'email' ],
        onSuccess: async (adm: ActionDataManager, lc: LogicChain) => {
            lc.stash.assign.object('user', adm.result);

            await lc.result();
        }
    })
    // @ReplaceOne({
    //     repo: 'Mysql.MemberRepo',
    //     input: (adm: ActionDataManager) => {
    //         return {
    //             createdBy: adm.request?.auth?.user?.id,
    //             user: adm.result.id,
    //             team: adm.input.teamId,
    //             accepted: false,
    //         };
    //     }
    // })
	@CreateOneIfNotExists({
        checkOn: [ 'teamId', 'userId' ],
		repo: 'Mysql.MemberRepo',
        input: (adm: ActionDataManager) => {
            return {
                teamId: adm.input.teamId,
                userId: adm.result.id,
            };
        },
		withValues: (adm: ActionDataManager) => {
            return {
                createdBy: adm.request?.auth?.user?.id,
                user: adm.result.id,
                team: adm.input.teamId,
                accepted: false,
            };
        },
	})
	@ServiceCaller({
		debug:  true,
        service: 'LocalEmailingService:sendMail',
		headers: (adm: ActionDataManager) => ({
			authorization: adm.request?.auth?.idToken,
		}),
        requestBody: (adm: ActionDataManager, lc: LogicChain) => {
			const user = lc.stash.prop('user');

			// process.env.ACCEPT_INVITATION_LINK
			// http://192.168.83.180:2002/v1/member/accept-invitation

			const ds = datasource('integration-eezze-rest');

            return {
                to: [ user.email ],
                from: process.env.EMAIL_SERVICE_FROM_EMAIL,
                fromFirstName: process.env.EMAIL_SERVICE_FROM_FIRST_NAME,
                fromLastName: process.env.EMAIL_SERVICE_FROM_LAST_NAME,
                subject: 'Eezze Team Invitation',
                template: 'team-invitation',
                templateVars: {
                    acceptInvitationLink: `${ds.source.host}/v1/member/accept-invitation`,
                    username: user.username,
                    name: `${user.firstName} ${user.lastName}`,
                    token: EezzeJwtToken.sign(
                        { id: adm.result?.id },
                        { minutes: 5 },
                        '',
                        { type: 'accept-member-invitation' }
                    ).token,
                },
            };
        }
    })
	async _exec() {}
}
