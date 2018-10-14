import { SignInNames } from './appUser.model';

export class AppCreateUser {
    constructor() {

    }
    organisationId: string;
    organisationName: string;
    appRole: string;
    appRoleDisplayName: string;
    trainerId: string;
    accountEnabled: boolean;
    signInNames: SignInNames[];
    creationType: string;
    displayName: string;
    mailNickname: string;
    passwordProfile: {
        password: string;
        forceChangePasswordNextLogin: boolean;
    };
    passwordPolicies: string;
    givenName: string;
    surname: string;
}
