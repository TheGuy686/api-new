import { EAction, Run, List, RestAction, SocketAction } from '@eezze/decorators';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';

@EAction({
    datasources: [ 'integration-eezze-ws', 'json-db-action' ],
})
export default class RunTest2Action extends BaseAction {
    /**
     * @decorator params:
	 * headers (optional) upon REST connection these parameters are added to the Header.
	 * datasource (required) Eezze Datasource definition, containing the server connectivity details.
	 * urlPath (required) REST operation that needs to be called
	 * method (required) REST method 
	 * payload (required) Data that is send to the server as part of the REST call Body.
	 * 
    
    @RestAction({
        headers: (adm: ActionDataManager) => {
            return {
                //'authorization': adm.request.auth?.idToken
            }
        },
        urlPath: '/project/test/ryan',
        datasource: 'integration-eezze-rest',
        method: 'post',
        payload: (adm: ActionDataManager) => {
            adm.input
            return {}
        }
    }) */

	/**
	 * @decorator params:
	 * urlParams (optional) upon Websocket connection these parameters are added to the URL connection string
	 * headers (optional) upon Websocket connection these parameters are added to the Header.
	 * eventName (required) Websocket channel/event to connect to, if it's on an Eezze service specify one of the event names from the WS controller listed events.
	 * datasource (required) Eezze Datasource definition, containing the server connectivity details.
	 * payload (required) Data that is send to the server via a websocket message
	 * 
	 * ! These parameters do not work: error, success
	 * 
	 * @param adm 
	 */
    @SocketAction({
		urlParams: (adm: ActionDataManager) => {
		 	return {
		 		'test': 'test'
		 	}
		},
		headers: (adm: ActionDataManager) => {
			return {
				// 'authorization': adm.request.auth?.idToken
			}
		},
		eventName: 'generate-test',
		datasource: 'integration-eezze-ws',
		payload: (adm: ActionDataManager) => {
			return {
				/* "userId": "user1",
				"projectId": "project1",
				"serviceId": "login",
				"operationId": "create",
				"type": "ws",
				"keyValueItems": [
					{
						"eventName": "login",
						"functionName": "login"
					}
				],
				"description": "controller" */
			}
		}
	})
    async _exec(adm: ActionDataManager) {
		console.log(adm.getLastAction().result)
	}
}