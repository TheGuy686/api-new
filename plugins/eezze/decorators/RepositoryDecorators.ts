import DatabaseSource from '../base/datasources';
import { generateRandomString } from '../libs/StringMethods';

export interface ERepositoryI {
    targetEntity: string;
    datasourceType: BASE_REPO_TYPES;
    datasource: string;
}

// const RepoArgsMain: any = {};

// export const RepoArgs = RepoArgsMain;

export function ERepository(args: ERepositoryI) {
    const te = args?.targetEntity;

    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        Object.defineProperty(constructor, 'metadata', {
            value: {
                props: args
            },
            writable: false
        });

        constructor.prototype.type = args.datasourceType;
        constructor.prototype.name = args.targetEntity;
        // RepoArgsMain[`${args.datasourceType}.${args.targetEntity.replace(/Model$/, '')}`] = args;
    };
}

const RepositoryDecorators = {
    ERepository,
}

export default RepositoryDecorators;