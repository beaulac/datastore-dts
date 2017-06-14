import { DatastoreKey } from './DatastoreEntity';

export = DatastoreQuery;

declare interface DatastoreQuery {
    filter(property: string, operator: '<' | '=' | '>', value: any): this;
    filter(property: string, value: any): this;

    hasAncestor(key: DatastoreKey): this;
    order(property: string, options?: DatastoreQuery.OrderOptions): this;
    groupBy(properties: string | string[]): this;
    select(properties: string | string[]): this;

    start(cursorToken: string): this;
    end(cursorToken: string): this;

    limit(n: number): this;
    offset(n: number): this;

    run<T>(callback: DatastoreQuery.QueryCallback<T>): void;
    run<T>(options: DatastoreQuery.QueryOptions, callback: DatastoreQuery.QueryCallback<T>): void;
    run<T>(options?: DatastoreQuery.QueryOptions): Promise<DatastoreQuery.QueryPromiseData<T>>;

    runStream(): NodeJS.ReadableStream;
}

declare namespace DatastoreQuery {
    interface OrderOptions {
        descending: boolean;
    }

    type QueryCallback<T> = (err: Error | undefined, entities: T[], info: QueryCallbackInfo) => void;

    type QueryPromiseData<T> = [T[], QueryCallbackInfo];

    interface QueryCallbackInfo {
        endCursor?: string;
        moreResults: 'MORE_RESULTS_AFTER_CURSOR' | 'MORE_RESULTS_AFTER_LIMIT' | 'NO_MORE_RESULTS';
    }
    interface QueryOptions {
        consistency?: 'strong' | 'eventual';
        maxApiCalls?: number;
    }
}
