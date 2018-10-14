import { Injectable } from '@angular/core';
import { filter } from 'lodash';

import { GridQuery } from './gridquery.model';

@Injectable()
export class GridQueryStateService {
  private _queries: { [key: string]: GridQuery } = {};

  getQuery(key: string): GridQuery {
    if (!this._queries[key]) {
      this.createKey(key);
    }

    return this._queries[key];
  }

  setQuery(key: string, query: GridQuery) {
    this._queries[key] = query;
  }

  clearFilter(key: string): void {
    if (!this._queries[key]) {
      this.createKey(key);
    }
    this._queries[key].filters.length = 0;
  }

  clearAllFilters(): void {
    this._queries = {};
  }

  isFilterClear(key: string): boolean {
    if (!this._queries[key]) {
      this.createKey(key);
    }

    return this._queries[key].filters.length === 0;
  }

  setSearchQuery(query: GridQuery, searchTerm: string) {
    query.filters = filter(query.filters, f => f.column !== 'SearchTerm'); // Remove any existing SearchTerm query first
    if (searchTerm !== '') {
      query.filters.push({ column: 'SearchTerm', value: searchTerm });
    }
  }

  private createKey(key: string): void {
    const query = new GridQuery();

    this._queries[key] = query;
  }
}

export const QueryKeys = {
  Approvals: 'Approvals',
  ApprovedCourses: 'ApprovedCourses',
  Audits: 'Audits',
  AuditActions: 'AuditActions',
  ChangeRecords: 'ChangeRecords',
  Journeys: 'Journeys',
  Organisations: 'Organisations',
  RequiredDocuments: 'RequiredDocuments',
  Drivers: 'Drivers'
};
