import { BaseModel } from '@eezze/base';
import { EModel, UID, Decimal, String, Json, Boolean, Int } from '@eezze/decorators/models';
import { OneToMany, ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import StoreServiceGroupModel from 'models/store-service-group-model';
import StoreReviewModel from 'models/store-review-model';

import StoreServiceConnectionModel from 'models/store-service-connection-model';
import StoreServiceConfigModel from 'models/store-service-config-model';
import StoreServiceRoleModel from 'models/store-service-role-model';
import StoreServiceDatasourceModel from 'models/store-service-datasource-model';
import StoreServiceValueStoreModel from 'models/store-service-value-store-model';
import StoreServiceCredentialsVaultModel from 'models/store-service-credentials-vault-model';
import UserModel from 'models/user-model';

@EModel()
export default class StoreModel extends BaseModel {
    @UID() id: string;
    @Int() srcProjectId: number;
    @String() name: string;
    @String() description: string;
    @String() tags: string;
    @String() scope: string;
    @String() type: string;
    @String() shortFunction: string;
    @String() sgFunction: string;
    @Json() metadata: string;
    @Boolean() publishApproved: boolean;
    @String() categoryOne: string;
    @String() categoryTwo: string;
    @String() categoryThree: string;
    @String() categoryFour: string;
    @String() categoryFive: string;
    @String() categorySix: string;
    @String() stories: string;
    @Decimal() version: string;
    @Boolean() active?: boolean;

    @OneToMany({ joinOn: ['storeId'], model: 'StoreServiceGroupModel', column: 'id', direction: 'output' }) serviceGroups: StoreServiceGroupModel[] = [];
    @OneToMany({ joinOn: ['storeId'], model: 'StoreReviewModel', column: 'id', direction: 'output'}) reviews: StoreReviewModel[] = [];
    @OneToMany({ joinOn: ['storeId'], model: 'StoreServiceConnectionModel', column: 'id', direction: 'output'}) connections: StoreServiceConnectionModel[] = [];
    @OneToMany({ joinOn: ['storeId'], model: 'StoreServiceRoleModel', column: 'id', direction: 'output' }) roles: StoreServiceRoleModel[] = [];
    @OneToMany({ joinOn: ['storeId'], model: 'StoreServiceDatasourceModel', column: 'id', direction: 'output' }) datasources: StoreServiceDatasourceModel[] = [];
    @OneToMany({ joinOn: ['storeId'], model: 'StoreServiceConfigModel', column: 'id', direction: 'output' }) serviceConfigs: StoreServiceConfigModel[] = [];
    @OneToMany({ joinOn: ['storeId'], model: 'StoreServiceValueStoreModel', column: 'id', direction: 'output'}) valueStore: StoreServiceValueStoreModel[] = [];
    @OneToMany({ joinOn: ['storeId'], model: 'StoreServiceCredentialsVaultModel', column: 'id', direction: 'output'}) vault: StoreServiceCredentialsVaultModel[] = [];

    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'publishedBy', direction: 'input'}) publishedBy: UserModel;
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'createdBy', direction: 'input'}) createdBy: UserModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.srcProjectId = args.srcProjectId;
        this.scope = args.scope;
        this.name = args.name;
        this.description = args.description;
        this.tags = args.tags;
        this.metadata = args.metadata;
        this.publishApproved = args.publishApproved;
        this.type = args.type;
        this.shortFunction = args.shortFunction;
        this.sgFunction = args.sgFunction;
        this.categoryOne = args.categoryOne;
        this.categoryTwo = args.categoryTwo;
        this.categoryThree = args.categoryThree;
        this.categoryFour = args.categoryFour;
        this.categoryFive = args.categoryFive;
        this.categorySix = args.categorySix;
        this.stories = args.stories;
        this.version = args.version;
        this.active = args.active;
    }

    public setServiceGroups(serviceGroup: StoreServiceGroupModel) {
        this.serviceGroups.push(serviceGroup);
    }

    public setReviews(review: StoreReviewModel) {
        this.reviews.push(review);
    }

    public setServiceConfigs(sc: StoreServiceConfigModel) {
        this.serviceConfigs.push(sc);
    }

    public setConnections(conn: StoreServiceConnectionModel) {
        this.connections.push(conn);
    }

    public setRoles(role: StoreServiceRoleModel) {
        this.roles.push(role);
    }

    public setDatasources(datasource: StoreServiceDatasourceModel) {
        this.datasources.push(datasource);
    }

    public setValueStore(value: StoreServiceValueStoreModel) {
        this.valueStore.push(value);
    }

    public setVault(vault: StoreServiceCredentialsVaultModel) {
        this.vault.push(vault);
    }

    public setPublishedBy(publishedBy: UserModel) {
        this.publishedBy = publishedBy;
    }

    public setCreatedBy(user: UserModel) {
        this.createdBy = user;
    }
}