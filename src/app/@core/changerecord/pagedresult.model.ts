import { ChangeRecord } from './changerecord.model';

export class PagedResult {
    records: ChangeRecord[] = [];
    token: string;
}
