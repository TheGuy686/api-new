import { BaseModel } from '@eezze/base';
import { EModel, UID, Decimal, String, Int } from '@eezze/decorators/models';
import { ManyToOne } from '@eezze/decorators/models/relation-types/relations';
import DateMethods from '@eezze/libs/Date';
import StoreModel from 'models/store-model';
import UserModel from 'models/user-model';

import moment from 'moment';

@EModel()
export default class StoreReviewModel extends BaseModel {
    @UID() id: string;
    @Decimal() rating: string;
    @String() comment: string;
    @String({ 
        default: DateMethods.formatDatePattern('YYYY-MM-DD hh:mm:ss'),
        serialize: (value: any) => {
            value = value.replace(/([0-9]{2})T([0-9]{2})/, '$1 $2');
            value = value.replace(/(.[0-9]+Z)/, '');
            
            return value;
        }
    }) reviewedAt: string;
    @String({ isTransient: true }) author: string = '';

    @ManyToOne({ joinOn: ['id'], model: 'StoreModel', column: 'storeId', direction: 'input' }) store: StoreModel;
    @ManyToOne({ joinOn: ['id'], model: 'UserModel', column: 'reviewer', direction: 'input' }) reviewer: UserModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.rating = args.rating;
        this.comment = args.comment;
        this.reviewedAt = args?.reviewedAt;
    }

    setStore(store: StoreModel) {
        this.store = store;
    }

    setReviewer(user: UserModel) {
        this.reviewer = user;
        this.author = `${user.firstName} ${user.lastName}`; 
    }
}