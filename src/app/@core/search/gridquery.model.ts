import { forEach } from 'lodash';

export class GridQueryFilter {
    column: string;
    value: string;
}

export class GridQuery {
    sort = '';
    sortAscending = true;
    replaceUnapproved = false;
    search = '';
    filters: GridQueryFilter[] = [];
    pageSize?: number;

    getQueryString(): string {
        let query = `replaceUnapproved=${this.replaceUnapproved}&sort=${encodeURIComponent(this.sort)}&sortAscending=${this.sortAscending}`;
        if (this.pageSize !== undefined) {
            query = query + `&pageSize=${this.pageSize}`;
        }
        forEach(this.filters, f => {
            query = query + `&f=${encodeURIComponent(f.column)}&v=${encodeURIComponent(f.value)}`;
        });

        return query;
    }

}
