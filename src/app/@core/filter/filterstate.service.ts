import { Injectable } from '@angular/core';
import { Filter } from '../search/filter.model';

@Injectable()
export class FilterStateService {
  private currentFilter: Filter = null;

  setFilter(filter: Filter) {
    this.currentFilter = filter;
  }

  getFilter(): Filter {
    if (!this.currentFilter) {
      this.currentFilter = new Filter();

      this.currentFilter.offices = [];
      this.currentFilter.organisations = [];
      this.currentFilter.nvqCertificateTitles = [];
    }
    return this.currentFilter;
  }

  clearFilter(): void {
    this.currentFilter = null;
  }

  isClear(): boolean {
    return this.currentFilter == null;
  }
}
