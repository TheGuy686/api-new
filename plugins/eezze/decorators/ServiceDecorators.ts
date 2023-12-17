import ProjectDependancyCaches from '../classes/ProjectDependancyCaches';
import RouteArgsI from '../interfaces/RouteArgsI';

const serviceAccessArgs: any = {};

interface EServiceArgsI {
    authenticator?: string;
}

export function EService(decArgs: EServiceArgsI = {}) {
    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        return class ServiceExtended extends constructor {
            action: any;
            auth: any;

            constructor(...args: any) {
                super(...args);

                let props: any, action: any, auth: any;

                if (args[0]?.authenticator) {
                    // this is where we create a new instancec of the authenticator
                    auth = ProjectDependancyCaches.getAuthenticator(
                        args[0]?.authenticator
                    );
                }

                props = ProjectDependancyCaches.getCachedMicroServiceProps(args[0].serviceId);

                action = new (require(`${props?.action?.path}/action`).default);

                this.action = action;
                this.auth = auth;

                this.action.service = this;

                if (this.auth) {
                    this.auth = new (this.auth)();
                }
            }
        };
    }
}

export function setServiceAccessArgs(key: string, options: RouteArgsI) {
    serviceAccessArgs[key] = options;
}