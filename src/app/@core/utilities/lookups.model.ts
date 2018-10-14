import { LookupString } from '../metadata/lookupString.model';
import { Lookup } from './lookup.model';

export class Lookups {
    auditTypes: Array<Lookup>;
    approvalItemTypes: Array<Lookup>;
    approvalActions: Array<Lookup>;
    approvalStatuses: Array<Lookup>;
    insuranceTypes: Array<Lookup>;
    journeyTypes: Array<Lookup>;
    markedOptions: Array<Lookup>;
    checklistItems: Array<LookupString>;
    riskHazardTypes: Array<LookupString>;
    riskPeople: Array<LookupString>;
    ethnicities: Array<LookupString>;
    ratingQuestions: Array<LookupString>;
    ragStatuses: Array<Lookup>;
    lowEvaluationLevel: number;
    highEvaluationLevel: number;
    certificationDate: string;
    journeyApprovalsEnabled: boolean;
}
