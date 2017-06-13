import { DatastoreKey } from './DatastoreEntity';
import { DatastoreQuery, DatastoreQueryOptions, QueryCallback, QueryPromiseData } from './DatastoreQuery';

// TODO Flesh this out with other properties:
export interface DatastoreApiResponse {
    mutationResults?: any;
}

type KeyAllocationCallback<U> = (err: Error | undefined, keys: DatastoreKey[]) => U;
type AllocationResult = [DatastoreKey[], DatastoreApiResponse];

type SingleGetCallback<T, U> = (err: Error | undefined, entities: T[]) => U;
type SingleGetResult<T> = [T, DatastoreApiResponse];

type MultiGetResult<T> = SingleGetResult<T[]>;
type MultiGetCallback<T, U> = SingleGetCallback<T[], U>;

type ApiCallback<U> = (err: Error, result: DatastoreApiResponse) => U;
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
    delete<T>(keys: DatastoreKey | DatastoreKey[]): Promise<ApiResult>;

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
    save<T>(entities: OneOrMany<T>): Promise<ApiResult>;

    insert<T, U>(entities: OneOrMany<T>, callback: ApiCallback<U>): void;
    insert<T>(entities: OneOrMany<T>): Promise<ApiResult>;

    update<T, U>(entities: OneOrMany<T>, callback: ApiCallback<U>): void;
    update<T>(entities: OneOrMany<T>): Promise<ApiResult>;

    upsert<T, U>(entities: OneOrMany<T>, callback: ApiCallback<U>): void;
    upsert<T>(entities: OneOrMany<T>): Promise<ApiResult>;
}
