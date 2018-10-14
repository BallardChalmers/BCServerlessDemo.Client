export class SearchResults<T> {
    constructor() {
        this.results = new Array<T>();
    }

    count: number;
    total: number;
    results: T[];
    token: string;
}
