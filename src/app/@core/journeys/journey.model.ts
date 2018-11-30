import { BaseEntity } from '../baseEntity.model';
import { RagStatus } from '../enum';
import { Driver } from '../drivers/driver.model';
import { Vehicle } from '../vehicle/vehicle.model';

export class Address {
    name: string;
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    county: string;
    postcode: string;
}

export class Journey extends BaseEntity {

    constructor() {
        super();
    }

    driver: Driver;
    vehicle: Vehicle;
    pickupLongitude: number;
    pickupLatitude: number;
    pickupAddress: Address;
    dropoffLongitude: number;
    dropoffLatitude: number;
    dropoffAddress: Address;
    pickupDate: Date;
    dropoffDate: Date;
    passengerCount: number;
    journeyDuration: number;
    isNew: boolean;
    description: string;
}
