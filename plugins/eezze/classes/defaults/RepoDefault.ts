import { ERepository, ERepositoryI } from '../../decorators/RepositoryDecorators';
import BaseFileStorage from '../../../eezze/base/datasources/BaseFileStorage';
import BaseRepository from '../../base/BaseRepository';
import BaseMailServiceRepository from '../../base/datasources/BaseMailServiceRepository';

export function createDefaultRepo(args: ERepositoryI) {
    switch (args.datasourceType) {
        case 'FileStorage': {
            @ERepository(args)
            class DefaultFSRepo extends BaseFileStorage {};

            return DefaultFSRepo;
        }
        case 'SmtpMailService': {
            @ERepository(args)
            class DefaultEmailServRepo extends BaseMailServiceRepository {};

            return DefaultEmailServRepo;
        }
        // This is just here to make sure there always a repository
        default: {
            @ERepository(args)
            class DefaultRepo extends BaseRepository {};

            return DefaultRepo;
        }
    }
}