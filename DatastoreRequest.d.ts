import { DatastoreKey } from './DatastoreEntity';
import {
    DatastoreQuery,
    DatastoreQueryOptions,
    QueryCallback,
    QueryCallbackInfo,
    QueryPromiseData
} from './DatastoreQuery';

// TODO Flesh this out with other properties:
export interface DatastoreApiResponse {
    mutationResults?: any;
    [otherKeys: string]: any;
}

type OptionalError = Error | undefined;

type SingleGetCallback<T, U> = (err: OptionalError, entity: T) => U;
type SingleGetResult<T> = [T, QueryCallbackInfo];

type MultiGetCallback<T, U> = SingleGetCallback<T[], U>;
type MultiGetResult<T> = SingleGetResult<T[]>;

type KeyAllocationCallback<U> = (err: OptionalError, keys: DatastoreKey[], apiResponse: DatastoreApiResponse) => U;
type AllocationResult = [DatastoreKey[], DatastoreApiResponse];

type ApiCallback<U> = (err: OptionalError, result: DatastoreApiResponse) => U;
type ApiResult = [DatastoreApiResponse];

export interface DatastorePayload<T> {
    key: DatastoreKey;
    // TODO Include possibility of 'raw data' with indexing options, etc:
    data: T | any;
}

type ObjOrPayload<T> = T | DatastorePayload<T>;

type OneOrMany<T> = ObjOrPayload<T> | Array<ObjOrPayload<T>>;

export interface DatastoreRequest {
    allocateIds<T>(incompleteKey: DatastoreKey, n: number, callback: KeyAllocationCallback<T>): void;
    allocateIds<T>(incompleteKey: DatastoreKey, n: number): Promise<AllocationResult>;

    createReadStream(keys: DatastoreKey | DatastoreKey[], options: DatastoreQueryOptions): NodeJS.ReadableStream;

    delete<T>(keys: DatastoreKey | DatastoreKey[], callback: ApiCallback<T>): void;
    /**
     * Overridden inconsistently:
     * {@link DatastoreTransaction} has void implementation
     * {@link Datastore} has Promise<ApiResult> implementation
     */
    delete<T>(keys: DatastoreKey | DatastoreKey[]): Promise<ApiResult> | void;

    get<T, U>(key: DatastoreKey, options: DatastoreQueryOptions, callback: SingleGetCallback<T, U>): void;
    get<T, U>(keys: DatastoreKey[], options: DatastoreQueryOptions, callback: MultiGetCallback<T, U>): void;

    get<T, U>(key: DatastoreKey, callback: SingleGetCallback<T, U>): void;
    get<T, U>(keys: DatastoreKey[], callback: MultiGetCallback<T, U>): void;

    get<T>(key: DatastoreKey, options?: DatastoreQueryOptions): Promise<SingleGetResult<T>>;
    get<T>(keys: DatastoreKey[], options?: DatastoreQueryOptions): Promise<MultiGetResult<T>>;

    runQuery<T, U>(query: DatastoreQuery, options: DatastoreQueryOptions, callback: QueryCallback<T, U>): void;
    runQuery<T, U>(query: DatastoreQuery, callback: QueryCallback<T, U>): void;

    runQuery<T>(query: DatastoreQuery, options?: DatastoreQueryOptions): QueryPromiseData<T>;

    runQueryStream(query: DatastoreQuery, options?: DatastoreQueryOptions): NodeJS.ReadableStream;

    save<T, U>(entities: OneOrMany<T>, callback: ApiCallback<U>): void;
    /**
     * Overridden inconsistently:
     * {@link DatastoreTransaction} has void implementation
     * {@link Datastore} has Promise<ApiResult> implementation
     */
    save<T>(entities: OneOrMany<T>): Promise<ApiResult> | void;

    insert<T, U>(entities: OneOrMany<T>, callback: ApiCallback<U>): void;
    insert<T>(entities: OneOrMany<T>): Promise<ApiResult>;

    update<T, U>(entities: OneOrMany<T>, callback: ApiCallback<U>): void;
    update<T>(entities: OneOrMany<T>): Promise<ApiResult>;

    upsert<T, U>(entities: OneOrMany<T>, callback: ApiCallback<U>): void;
    upsert<T>(entities: OneOrMany<T>): Promise<ApiResult>;
}
