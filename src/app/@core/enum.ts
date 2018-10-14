export enum Action {
    RequestAudit = 'RequestAudit',
    EnableDisableOrg = 'EnableDisableOrg',
    EnableDisableDriver = 'EnableDisableDriver',
    AddOrg = 'AddOrg',
    EditOrg = 'EditOrg',
    EditApprovedJourney = 'EditApprovedJourney',
    FilterByOrg = 'FilterByOrg',
    AddEditDriver = 'AddEditDriver',
    EditDriverRagStatus = 'EditDriverRagStatus',
    AddEditJourney = 'AddEditJourney',
    AddEditReadOnlyJourney = 'AddEditReadOnlyJourney',
    ConfirmCertificates = 'ConfirmCertificates',
    AddLearner = 'AddLearner',
    DeleteJourney = 'DeleteJourney',
    CertifyOrg = 'CertifyOrg',
    CertifyDriver = 'CertifyDriver',
    AddHeaJourney = 'AddHeaJourney',
    PrintCertificates = 'PrintCertificates'
}

export enum ApprovalStatus {
    Draft = 0,
    Pending = 1,
    Approved = 2,
    Rejected = 3,
    NotRequired = 4
}

export enum ApprovalAction {
    OrganisationCreated = 0,
    OrganisationUpdated = 1,
    OrganisationDeleted = 2,
    DriverCreated = 3,
    DriverUpdated = 4,
    DriverDeleted = 5,
    JourneyCreated = 6,
    JourneyUpdated = 7,
    JourneyDeleted = 8,
    AuditActionResolved = 9
}

export enum ApprovalItemType {
    Organisation = 0,
    Driver = 1,
    Journey = 2,
    AuditAction = 3
}

export enum AuditActionStatus {
    NotSet = 0,
    NonConformance = 1,
    Observation = 2,
    Satisfied = 3
}

export enum AuditType {
    Organisation = 1,
    Journey = 2,
    Investigation = 3
}

export enum AuditStatus {
    Draft = 0,
    Submitted = 1,
    Completed = 2
}

export enum JourneyType {
    FullJourney = 0,
    Apprentice = 1,
    Refresher = 2,
}

export enum FilterKeys {
    ContactEmail = 'ContactEmail',
    ContactName = 'ContactName',
    ContactPhone = 'ContactPhone',
    InsuranceType = 'InsuranceType',
    Organisations = 'Organisations',
    Proprietor = 'Proprietor'
}

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Undetermined = 'Undetermined'
}

export enum RagStatus {
    Auto = 0,
    Red = 1,
    Amber = 2,
    Green = 3
}

export enum Role {
    Manager = 'Manager',
    Admin = 'Admin',
    OrgAdmin = 'OrgAdmin',
    Driver = 'Driver'
}

export enum RiskLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export class EnumUtils {
    public static spacedName(name: string): string {
        let spacedName: string = null;
        if (name) {
            spacedName = name.replace(/([A-Z])/g, ' $1').trim();
        }
        return spacedName;
    }

    static getNames(e: any) {
        return Object.keys(e).filter(k => typeof e[k] === 'number') as string[];
    }

    static getSpacedNames(e: any) {
        const spacedNames: string[] = [];
        Object.keys(e)
            .filter(k => typeof e[k] === 'number')
            .forEach(s => spacedNames.push(EnumUtils.spacedName(s)));
        return spacedNames;
    }
}
