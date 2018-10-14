import { take } from 'lodash';

export class ViewportCollectionService<T> {
    private _collection: T[];
    private _view: T[];
    private _displayed = 25;
    private _total = 25;

    constructor() {

    }

    get displayed(): number {
        return this._displayed;
    }

    get total(): number {
        return this._total;
    }

    set total(total: number) {
        this._total = total;
    }

    get view(): T[] {
        return this._view;
    }

    get collection(): T[] {
        return this._collection;
    }

    set collection(collection: T[]) {
        this._collection = collection;
        this._view = take(this._collection, this._displayed);
    }

    reset() {
        this._view = take(this._collection, this._displayed);
    }

    loadMore() {
        this._displayed += 25;
        this._view = take(this._collection, this._displayed);
    }
}
