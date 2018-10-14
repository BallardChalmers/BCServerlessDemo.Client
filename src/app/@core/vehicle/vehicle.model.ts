import { BaseEntity } from '../baseEntity.model';

export class Vehicle extends BaseEntity {

    constructor() {
        super();
    }

        symboling: string;
        normalizedLosses: string;
        make: string ;
        fuelType: string ;
        aspiration: string ;
        numOfDoors: string ;
        bodyStyle: string ;
        driveWheels: string ;
        engineLocation: string ;
        wheelBase: string ;
        length: string;
        width: string ;
        height: string ;
        curbWeight: string ;
        engineType: string ;
        numOfCylinders: string ;
        engineSize: string ;
        fuelSystem: string ;
        bore: string ;
        stroke: string ;
        compressionRatio: string ;
        horsePower: string ;
        peakRPM: string ;
        cityMPG: string ;
        highwayMPG: string ;
        price: string ;
}
