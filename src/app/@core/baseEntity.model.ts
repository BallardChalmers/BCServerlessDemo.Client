export class BaseEntity {

    id: string;
    name: string;
    type: string;
    changedOn: Date;
    changedById: string;
    changedByName: string;
    deleted: boolean;

    approvalStatus: number;
    approvalStatusName: string;
}
