import { BaseEntity } from '../baseEntity.model';

export class ChangeRecord extends BaseEntity {
    action: string;
    subjectId: string;
    subjectType: string;
    subjectDescription: string;
    before: any;
    after: any;
}
