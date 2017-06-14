import { DatastoreKey } from './DatastoreEntity';
import { QueryCallback, QueryCallbackInfo, QueryOptions, QueryPromiseData } from './DatastoreQuery';
import ApiResult = DatastoreRequest.ApiResult;
import ApiCallback = DatastoreRequest.ApiCallback;
import SingleGetCallback = DatastoreRequest.SingleGetCallback;
import MultiGetCallback = DatastoreRequest.MultiGetCallback;
import SingleGetResult = DatastoreRequest.SingleGetResult;
import MultiGetResult = DatastoreRequest.MultiGetResult;
import OneOrMany = DatastoreRequest.OneOrMany;
import AllocationCallback = DatastoreRequest.AllocationCallback;
import AllocationResult = DatastoreRequest.AllocationResult;

import DatastoreQuery = require('./DatastoreQuery');

export = DatastoreRequest;

declare class DatastoreRequest {
    allocateIds(incompleteKey: DatastoreKey, n: number, callback: AllocationCallback): void;
    allocateIds(incompleteKey: DatastoreKey, n: number): Promise<AllocationResult>;

    createReadStream(keys: DatastoreKey | DatastoreKey[], options: QueryOptions): NodeJS.ReadableStream;

    'delete'<T>(keys: DatastoreKey | DatastoreKey[], callback: ApiCallback): void;
    /**
     * Overridden inconsistently:
     * {@link DatastoreTransaction} has void implementation
     * {@link Datastore} has Promise<ApiResult> implementation
     */
    'delete'<T>(keys: DatastoreKey | DatastoreKey[]): Promise<ApiResult> | void;

    get<T>(key: DatastoreKey, options: QueryOptions, callback: SingleGetCallback<T>): void;
    get<T>(keys: DatastoreKey[], options: QueryOptions, callback: MultiGetCallback<T>): void;

    get<T>(key: DatastoreKey, callback: SingleGetCallback<T>): void;
    get<T>(keys: DatastoreKey[], callback: MultiGetCallback<T>): void;

    get<T>(key: DatastoreKey, options?: QueryOptions): Promise<SingleGetResult<T>>;
    get<T>(keys: DatastoreKey[], options?: QueryOptions): Promise<MultiGetResult<T>>;

    runQuery<T>(query: DatastoreQuery, options: QueryOptions, callback: QueryCallback<T>): void;
    runQuery<T>(query: DatastoreQuery, callback: QueryCallback<T>): void;

    runQuery<T>(query: DatastoreQuery, options?: QueryOptions): QueryPromiseData<T>;

    runQueryStream(query: DatastoreQuery, options?: QueryOptions): NodeJS.ReadableStream;

    save<T, U>(entities: OneOrMany<T>, callback: ApiCallback): void;
    /**
     * Overridden inconsistently:
     * {@link DatastoreTransaction} has void implementation
     * {@link Datastore} has Promise<ApiResult> implementation
     */
    save<T>(entities: OneOrMany<T>): Promise<ApiResult> | void;

    insert<T, U>(entities: OneOrMany<T>, callback: ApiCallback): void;
    insert<T>(entities: OneOrMany<T>): Promise<ApiResult>;

    update<T, U>(entities: OneOrMany<T>, callback: ApiCallback): void;
    update<T>(entities: OneOrMany<T>): Promise<ApiResult>;

    upsert<T, U>(entities: OneOrMany<T>, callback: ApiCallback): void;
    upsert<T>(entities: OneOrMany<T>): Promise<ApiResult>;
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
    type SingleGetResult<T> = [T, QueryCallbackInfo];

    type MultiGetCallback<T> = SingleGetCallback<T[]>;
    type MultiGetResult<T> = SingleGetResult<T[]>;

    type AllocationCallback = (err: Error | undefined, keys: DatastoreKey[], apiResponse: ApiResponse) => void;
    type AllocationResult = [DatastoreKey[], ApiResponse];

    interface DatastorePayload<T> {
        key: DatastoreKey;
        // TODO Include possibility of 'raw data' with indexing options, etc:
        data: T | any;
    }

    type ObjOrPayload<T> = T | DatastorePayload<T>;

    type OneOrMany<T> = ObjOrPayload<T> | Array<ObjOrPayload<T>>;
}
