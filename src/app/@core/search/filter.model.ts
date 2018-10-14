
export class BaseModel {
  id: string;
  name: string;
}

export class Filter {
  offices: BaseModel[];
  organisations: BaseModel[];
  nvqCertificateTitles: string[];
  fromDateCardExpiry: Date;
  toDateCardExpiry: Date;
  fromDateBirth: Date;
  toDateBirth: Date;
  fromDateNVQCert: Date;
  toDateNVQCert: Date;
  organisationId: String;
  fromDateEvidenceExpiry: Date;
  toDateEvidenceExpiry: Date;
  photosIsNull: boolean;
  HasExpiredDocs: boolean;
}
