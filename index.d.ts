// Type definitions for @google-cloud/datastore v1.0.2
// Project: https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga
// Definitions by: OctHuber Inc. / Antoine Beauvais-Lacasse <abeaulac@octhuber.com>
import {
    DatastoreCoordinates,
    DatastoreDouble,
    DatastoreGeopoint,
    DatastoreInt,
    DatastoreKey,
    DatastoreKeyOptions,
    DatastoreKeyPath,
    KEY_SYMBOL
} from './';

export = Datastore;

declare class Datastore extends DatastoreRequest {
    constructor(options: Datastore.DatastoreInitOptions);

    readonly KEY: KEY_SYMBOL;

    /** If kind is omitted, then "namespace" param is interpreted as 'kind' */
    createQuery(namespace: string, kind?: string): DatastoreQuery;

    save<T>(entities: OneOrMany<T>): Promise<DatastoreRequest.ApiResult>;

    'delete'(keys: DatastoreKey | DatastoreKey[]): Promise<DatastoreRequest.ApiResult>;

    transaction(): DatastoreTransaction;

    int(value: string | number): DatastoreInt;

    double(value: string | number): DatastoreDouble;

    geoPoint(coordinates: DatastoreCoordinates): DatastoreGeopoint;

    key(pathOrOptions: DatastoreKeyPath | DatastoreKeyOptions): DatastoreKey;

    readonly MORE_RESULTS_AFTER_CURSOR: 'MORE_RESULTS_AFTER_CURSOR';
    readonly MORE_RESULTS_AFTER_LIMIT: 'MORE_RESULTS_AFTER_LIMIT';
    readonly NO_MORE_RESULTS: 'NO_MORE_RESULTS';

    determineBaseUrl_(customApiEndpoint?: string): void;
}
declare namespace Datastore {
    interface DatastoreInitOptions {
        apiEndpoint?: string;
        namespace?: string;
        projectId?: string;
        keyFilename?: string;
        credentials?: {};
    }

    interface DatastoreInt {
        value: string;
    }
    interface DatastoreDouble {
        value: string;
    }

    interface DatastoreCoordinates {
        latitude: number;
        longitude: number;
    }
    interface DatastoreGeopoint {
        value: DatastoreCoordinates;
    }

    type DatastoreKeyPath = Array<string | number | DatastoreInt>;
    interface DatastoreKeyOptions {
        namespace?: string;
        path: DatastoreKeyPath;
    }
    interface DatastoreKey {
        id?: string;
        name?: string;

        kind: string;
        path: DatastoreKeyPath;

        parent?: DatastoreKey;
    }

    type KEY_SYMBOL = symbol;

    interface DatastorePayload<T> {
        key: DatastoreKey;
        // TODO Include possibility of 'raw data' with indexing options, etc:
        data: T | any;
    }
}

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

declare class DatastoreRequest {
    allocateIds(incompleteKey: DatastoreKey, n: number, callback: DatastoreRequest.AllocationCallback): void;
    allocateIds(incompleteKey: DatastoreKey, n: number): Promise<DatastoreRequest.AllocationResult>;

    createReadStream(keys: DatastoreKey | DatastoreKey[], options: DatastoreQuery.QueryOptions): NodeJS.ReadableStream;

    'delete'<T>(keys: DatastoreKey | DatastoreKey[], callback: DatastoreRequest.ApiCallback): void;
    /**
     * Overridden inconsistently:
     * {@link DatastoreTransaction} has void implementation
     * {@link Datastore} has Promise<DatastoreRequest.ApiResult> implementation
     */
    'delete'<T>(keys: DatastoreKey | DatastoreKey[]): Promise<DatastoreRequest.ApiResult> | void;

    get<T>(key: DatastoreKey, options: DatastoreQuery.QueryOptions, callback: DatastoreRequest.SingleGetCallback<T>): void;
    get<T>(keys: DatastoreKey[], options: DatastoreQuery.QueryOptions, callback: DatastoreRequest.MultiGetCallback<T>): void;

    get<T>(key: DatastoreKey, callback: DatastoreRequest.SingleGetCallback<T>): void;
    get<T>(keys: DatastoreKey[], callback: DatastoreRequest.MultiGetCallback<T>): void;

    get<T>(key: DatastoreKey, options?: DatastoreQuery.QueryOptions): Promise<DatastoreRequest.SingleGetResult<T>>;
    get<T>(keys: DatastoreKey[], options?: DatastoreQuery.QueryOptions): Promise<DatastoreRequest.MultiGetResult<T>>;

    runQuery<T>(query: DatastoreQuery, options: DatastoreQuery.QueryOptions, callback: DatastoreQuery.QueryCallback<T>): void;
    runQuery<T>(query: DatastoreQuery, callback: DatastoreQuery.QueryCallback<T>): void;

    runQuery<T>(query: DatastoreQuery, options?: DatastoreQuery.QueryOptions): DatastoreQuery.QueryPromiseData<T>;

    runQueryStream(query: DatastoreQuery, options?: DatastoreQuery.QueryOptions): NodeJS.ReadableStream;

    save<T, U>(entities: OneOrMany<T>, callback: DatastoreRequest.ApiCallback): void;
    /**
     * Overridden inconsistently:
     * {@link DatastoreTransaction} has void implementation
     * {@link Datastore} has Promise<DatastoreRequest.ApiResult> implementation
     */
    save<T>(entities: OneOrMany<T>): Promise<DatastoreRequest.ApiResult> | void;

    insert<T, U>(entities: OneOrMany<T>, callback: DatastoreRequest.ApiCallback): void;
    insert<T>(entities: OneOrMany<T>): Promise<DatastoreRequest.ApiResult>;

    update<T, U>(entities: OneOrMany<T>, callback: DatastoreRequest.ApiCallback): void;
    update<T>(entities: OneOrMany<T>): Promise<DatastoreRequest.ApiResult>;

    upsert<T, U>(entities: OneOrMany<T>, callback: DatastoreRequest.ApiCallback): void;
    upsert<T>(entities: OneOrMany<T>): Promise<DatastoreRequest.ApiResult>;
}
declare namespace DatastoreRequest {
    // TODO Flesh this out with other properties:
    interface ApiResponse {
        mutationResults?: any;
        [otherKeys: string]: any;
    }
    type ApiCallback = (err: Error | undefined, result: ApiResponse) => void;
    type ApiResult = [ApiResponse];

    type SingleGetCallback<T> = (err: Error | undefined, entity: T) => void;
    type SingleGetResult<T> = [T, DatastoreQuery.QueryCallbackInfo];

    type MultiGetCallback<T> = SingleGetCallback<T[]>;
    type MultiGetResult<T> = SingleGetResult<T[]>;

    type AllocationCallback = (err: Error | undefined, keys: DatastoreKey[], apiResponse: ApiResponse) => void;
    type AllocationResult = [DatastoreKey[], ApiResponse];
}

declare interface DatastoreTransaction extends DatastoreRequest {
    /** If kind is omitted, then "namespace" param is interpreted as 'kind' */
    createQuery(namespace: string, kind?: string): DatastoreQuery;

    save<T>(entities: OneOrMany<T>): void;
    'delete'(keys: DatastoreKey | DatastoreKey[]): void;

    commit(): Promise<DatastoreRequest.ApiResult>;
    commit(callback: DatastoreRequest.ApiCallback): void;

    rollback(): Promise<DatastoreRequest.ApiResult>;
    rollback<U>(callback: DatastoreRequest.ApiCallback): void;

    run(callback: DatastoreTransaction.TransactionCallback): void;
    run(): Promise<DatastoreTransaction.TransactionResult>;
}
declare namespace DatastoreTransaction {
    type TransactionCallback = (error: Error | undefined, transaction: DatastoreTransaction, apiResponse: DatastoreRequest.ApiResponse) => void;
    type TransactionResult = [DatastoreTransaction, DatastoreRequest.ApiResponse];
}

type ObjOrPayload<T> = T | Datastore.DatastorePayload<T>;
type OneOrMany<T> = ObjOrPayload<T> | Array<ObjOrPayload<T>>;
