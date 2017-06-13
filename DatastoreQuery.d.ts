import { DatastoreKey } from './DatastoreEntity';

export interface DatastoreOrderOptions {
    descending: boolean;
}

export type QueryCallback<T, U> = (err: Error | undefined, entities: T[], info: QueryCallbackInfo) => U;

export type QueryPromiseData<T> = [T[], QueryCallbackInfo];

export interface QueryCallbackInfo {
    endCursor?: string;
    moreResults: 'MORE_RESULTS_AFTER_CURSOR' | 'MORE_RESULTS_AFTER_LIMIT' | 'NO_MORE_RESULTS';
}
export interface DatastoreQueryOptions {
    consistency?: 'strong' | 'eventual';
    maxApiCalls?: number;
}

export interface DatastoreQuery {
    filter(property: string, operator: '<' | '=' | '>', value: any): this;
    filter(property: string, value: any): this;

    hasAncestor(key: DatastoreKey): this;
    order(property: string, options?: DatastoreOrderOptions): this;
    groupBy(properties: string | string[]): this;
    select(properties: string | string[]): this;

    start(cursorToken: string): this;
    end(cursorToken: string): this;

    limit(n: number): this;
    offset(n: number): this;

    run<T, U>(callback: QueryCallback<T, U>): void;
    run<T, U>(options: DatastoreQueryOptions, callback: QueryCallback<T, U>): void;
    run<T>(options?: DatastoreQueryOptions): Promise<QueryPromiseData<T>>;

    runStream(): NodeJS.ReadableStream;
}
