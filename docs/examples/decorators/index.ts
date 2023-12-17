import {
    EAction,
    RenderTemplate,
    SocketAction,
    GetAll,
    GetOne,
    DeleteOne,
    CreateOne,
    CreateOneIfNotExists,
    UpdateOne,
    List,
    EWhen,
    When,
    Success,
    GetOneAndUpdate,
    ServiceCaller,
    Run,
    Command
} from '@eezze/decorators';
import { ESet, EMath } from '@eezze/classes/logic';
import BaseAction from '@eezze/base/action/BaseAction';
import { ActionDataManager } from '@eezze/classes';
import { toolresults } from 'googleapis/build/src/apis/toolresults';
import { kebabCase } from '@eezze/libs/StringMethods';

@EAction({
    targetRepo: 'FileStorage.RoleRepo',
})
export default class RunTestAction extends BaseAction {
    /**
     * @decorator params:
     *  - returnResultAsObjects? (optional): boolean;
     *  - transformResult? (optional): (result: any, adm: ActionDataManager) => any; custom function to transform the datasource result with.
     *
     * @param adm: ActionDataManager
     */
    @GetAll()

    /**
     * @decorator params:
     *  - checkOn (required): string[] - uses this property to query on.
     *  - map? (optional): if map is used, the 'checkOn' property should be in the return object(!)
     *  - transformResult? (optional): (result: any, adm: ActionDataManager) => any;
     *
     * @param adm: ActionDataManager
     */
    @GetOne({
        checkOn: ['key'],
        map: (adm: ActionDataManager) => {
            return {
                key: adm.getLastAction().result[0]['key']
            }
        },
        transformResult: (result: any, adm: ActionDataManager) => {
            return result //no transformation
        }
    })

    /**
     * @decorator params:
     * 
     * checkOn: (required): attribute used for the `getOne` query.
     * map (optional): Required if you need to map previous action value to this action.
     * withValues (optional): set/change model attributes.
     * 
     * Update and Create operations return results in the `body` object always!
     * 
     * transformResult? (optional): (result: any, adm: ActionDataManager) => any;
     */
    @GetOneAndUpdate({
        checkOn: ['key'],
        map: (adm: ActionDataManager) => {
            return {
                key: adm.getLastAction().result['key']
            }
        },
        withValues: () => { return { "role": "test-user" } }
    })

    /**
     * @decorator params:
     * - keyOn (optional) set the attribute where the UID is set on.
     * - map: (optional) map the input variables to this decorator.
     * - transformResult? (optional): (result: any, adm: ActionDataManager) => any;
     */
    @CreateOne({
        map: (adm: ActionDataManager) => {
            const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;
            return {
                key: "role_customer_" + randomNumber,
                role: "customer_" + randomNumber
            }
        }
    })

    /**
     * @decorator params:
     * - checkOn (required) attribute used for the `getOne` query.
     * - map: (optional) map the input variables to this decorator.
     * - transformResult? (optional): (result: any, adm: ActionDataManager) => any;
     */
    @CreateOneIfNotExists({
        checkOn: ['key'],
        map: (adm: ActionDataManager) => {
            const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;
            return {
                key: "role_customer_" + randomNumber,
                role: "customer_" + randomNumber
            }
        }
    })
    /**
     * @decorator params:
     * - keyOn (optional) set the attribute where the UID is set on.
     * - map: (optional) map the input variables to this decorator.
     * - transformResult? (optional): (result: any, adm: ActionDataManager) => any;
     */
    @UpdateOne({
        map: (adm: ActionDataManager) => {
            return {
                key: "role_admin",
                role: "administrator"
            }
        }
    })

    /**
     * @decorator params:
     * - map (required) set the attribute to be used to query the delete operation on.
     * - transformResult? (optional): (result: any, adm: ActionDataManager) => any;
     */
    @DeleteOne({
        map: (adm: ActionDataManager) => {
            return {
                key: adm.action(3).result.body.key // deletes the 'CreateOneIfNotExists' created role.
            }
        }
    })

    /**
     *  @decorator List params:
     * - source: source must be of an Array type
     * - action: loops over the source Array, operations can be performed similar to regular programming code in loops.
     * 
     *  @decorator ESet decorator applies; source[key] = value; It can therefore add additional properties to return objects
     * 
     *  @decorator EMath has many mathematics functions that can be applied on 1 or 2 parameters containing number values.
     * 
     */
    @List({
        source: (adm: ActionDataManager) => adm.action(0).result, //@GetAll result
        action: (item: any) => {
            item.val1 = 5;
            item.val2 = 2;

            ESet(
                item,
                'key',
                EMath.addition(item.val1, item.val2)
            )
        }
    })

    /**
     *  @decorator params:
     * 
     * listSource (array): this must be of type Array ALTERNATIVELY `source` parameter is to be used for type Object
     * actions (array): array of action definitions that contain
     *      condition: definition that must have a boolean as end result (true or false)
     *      action: what to do when the condition is met
     * 
     * In the case there's just one object source and one action (can also be combined, one object source, multiple actions):
     * action (singular)
     * source (singular) 
     */
    @EWhen({
        listSource: (adm: ActionDataManager) => adm.getLastAction().result,
        actions: [{
            condition: (adm: ActionDataManager, item: any) => {
                return item.key === 7
            },
            action: (adm: ActionDataManager, item: any) => {
                // ... do something
                console.log('DO SOMERTING FROM WHEN: ', item)
            }
        }, {
            condition: (adm: ActionDataManager, item: any) => {
                return item.roleId === 'role_admin'
            },
            action: (adm: ActionDataManager, item: any) => {
                // ... do something
                console.log('DO SOMERTING FROM SECOND WHEN: ', item)
            }
        }]
    })

    /**
     * @decorator params:
     * 
     * templateName (required): name of the template
     * linter: (optional): json | yaml 
     * toPath (required): where to store results of the template rendering, it requires the return object { path: '', input: {}} 
     *    Input object should contain the variables needed for the path string.
     * templateVars (required): variables required inside of the template.
     */
    @RenderTemplate({
        templateName: 'controller',
        // linter: 'json',
        toPath: (adm: ActionDataManager) => {
            const roleId = kebabCase(adm.action(0).result[0].roleId)
            return `${process.env['PROJECTS_FILE_ROOT']}\/${roleId}/controller.ts`
        },
        templateVars: (adm: ActionDataManager) => ({
            controller: adm.getLastAction().result[0].serviceId
        })
    })

    /**
     * @decorator params:
     * 
     * rootFolder: (required): folder the command will execute from.
     * isAsync (optional): runs the command as a child_process in the background.
     * command: (required): command to execute on the server command line.
     * map: (optional): maps input from any prior Action (adm.getLastAction() ) or from the Input (adm.input)
     */
    @Command({
        rootFolder: "",
        isAsync: true,
        command: `cd ..`
    })

    /**
     * @decorator params:
     * 
     * service (required): registered Service on the same Server, format; serviceName:operationName
     * 
     * Choose one of these two;
     * actionListSource (optional): processes an array object (loop), sends along each item of the array in serial execution.
     * payload: (optional): if there's one object to send, use payload.
     * 
     */
    @ServiceCaller({
        service: 'RestControllersService:createController',
        // actionListSource: (adm: ActionDataManager) => adm.getLastAction().result,
        payload: (adm: ActionDataManager) => {
            return {
                urlParams: {
                    // authorization: adm.request.auth?.idToken,
                },
                requestBody:
                {
                    "userId": "user1",
                    "projectId": "project1",
                    "serviceId": "login",
                    "controllerId": "login",
                    "operationId": "create",
                    "type": "ws",
                    "key": "login",
                    "keyValueItems": [
                        {
                            "eventName": "login",
                            "functionName": "login"
                        }
                    ],
                    "name": "controller1",
                    "description": "controller"
                }
                ,
            };
        },
    })

    /**
     * within _exec other code can be run if required.
     */
    async _exec(adm: ActionDataManager) { }
}


/**
* ! DO NOT USE!
* 
* WHEN is deprecated, no results and errors are saved in the ActionDataManager.
* 
* hook types: 'pre' | 'post' | 'preActionConditions'
* 
* @decorator params:
* 
* roles (optional): string[]
* condition (required): function containing the condition for execution, must result in boolean.
* onPassThrow (optional): this will override the original call back and throw an error message instead which will get processed by the business rules engine.
 
@When({
   //: ['role_admin'],
   hook: 'post',
   condition: (adm: ActionDataManager) => adm.getLastAction().result['key'] === 'role_superuser' 
})
async _doSomeStuffBeforeEverythingElse(adm: ActionDataManager) {
   console.log('superuser role')
   return {
       "role": "super-user"
   }
}*/


/**
* @decorator params:
* 
* data(required) function that returns a new datastructure as result.Datastructure can be of 'any' type.
*/    
@DataTransformer({
    data: (adm: ActionDataManager) => {
        const item = adm.action('1').result.body
        // if user already exists, there's no previous result.
        if (typeof item !== 'undefined') {
            // delete secrets
            delete item.salt
            delete item.verifier

            return item
        }

        return {}
    }
})
async _exec(adm: ActionDataManager) { }