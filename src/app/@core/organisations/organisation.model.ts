import { BaseEntity } from '../baseEntity.model';
import { AppUser } from '../user/appUser.model';

export class Organisation extends BaseEntity {

    constructor() {
        super();
        this.primaryContact = new AppUser();
    }

    photoId?: string;
    primaryContact: AppUser;
    proprietor: string;
    isDisabled: boolean;
    isNew: boolean;
}
