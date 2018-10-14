import { Role } from '../../@core/enum';

export class MenuItem {

    constructor(name: string, roles: Array<Role>, link?: string, iconClass?: string) {
        this.name = name;
        this.roles = roles;
        this.link = link;
        this.iconClass = iconClass;
        this.children = new Array<MenuItem>();
        this.displayRoles = roles;
        this.isCertificationLink = false;
    }

    name: string;
    link?: string;
    iconClass?: string;
    children?: Array<MenuItem>;
    roles: Array<Role>; // Controls which roles have permission to access a given page
    displayRoles: Array<Role>; // Controls which roles can see the link in the menu
    isCertificationLink: boolean;
}
