import { BaseModel } from '@eezze/base';
import { EModel, UID, String } from '@eezze/decorators/models';
import { OneToOne } from '@eezze/decorators/models/relation-types/OneToOne';
import TypeModel from '../type-model';

@EModel()
export default class TypeDetailModel extends BaseModel {
    @UID() id: string;
    @String() description: string;
    @OneToOne({ joinOn: ['id'], model: 'TypeModel', foreignKey: 'typeDetailId' }) type: TypeModel;

    constructor(args: any) {
        super();

        this.id = args.id;
        this.description = args.description;
    }

    public setType(type: TypeModel) {
        this.type = type;
    }
}