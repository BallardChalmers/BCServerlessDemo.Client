import { BaseEntity } from '../baseEntity.model';
import { RagStatus } from '../enum';
import { Organisation } from '../organisations/organisation.model';
import { AppUser } from '../user/appUser.model';

export class Driver extends BaseEntity {

    constructor() {
        super();
    }

    givenName: string;
    surname: string;
    description: string;
    relatedUser: AppUser;
    photoId: string;
    organisation: Organisation;
}
