export class SignInNames {
    type: string;
    value: string;
}

export class AppUser {
    id: string;
    name: string;
    objectId: string;
    driverId: string;
    organisationId: string;
    organisationName: string;
    appRole: string;
    appRoleDisplayName: string;
    trainerId: string;
    accountEnabled: boolean;
    city: string;
    companyName: string;
    country: string;
    creationType: string;
    displayName: string;
    givenName: string;
    immutableId: string;
    isCompromised: boolean;
    jobTitle: string;
    mail: string;
    mailNickname: string;
    mobile: string;
    onPremisesDistinguishedName: string;
    onPremisesSecurityIdentifier: string;
    postalCode: string;
    state: string;
    streetAddress: string;
    surname: string;
    telephoneNumber: string;
    signInNames: SignInNames[];
    userIdentities: string[];
    userPrincipalName: string;
    userType: string;
}
