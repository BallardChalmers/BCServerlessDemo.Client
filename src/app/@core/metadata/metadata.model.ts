import { LookupString } from './lookupString.model';
import { BaseEntity } from '../baseEntity.model';

export class Metadata extends BaseEntity {

    constructor() {
        super();

    }

    checklistItems: Array<LookupString>;
    riskHazardTypes: Array<LookupString>;
    riskPeople: Array<LookupString>;
    ethnicities: Array<LookupString>;
    learnerRatingQuestions: Array<LookupString>;
}
