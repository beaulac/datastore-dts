import { DatastoreKey } from './DatastoreEntity';
import { DatastoreQuery } from './DatastoreQuery';
import {
    ApiCallback,
    ApiResult,
    DatastoreApiResponse,
    DatastoreRequest,
    OneOrMany,
    OptionalError
} from './DatastoreRequest';

type TransactionCallback<U> = (error: OptionalError, transaction: DatastoreTransaction, apiResponse: DatastoreApiResponse) => U;
type TransactionResult = [DatastoreTransaction, DatastoreApiResponse];

export interface DatastoreTransaction extends DatastoreRequest {
    /** If kind is omitted, then "namespace" param is interpreted as 'kind' */
    createQuery(namespace: string, kind?: string): DatastoreQuery;

    /** NB: If a callback is supplied, it is *ignored*! */
    save<T>(entities: OneOrMany<T>, callback?: never): void;
    delete(keys: DatastoreKey | DatastoreKey[], callback?: never): void;

    commit(): Promise<ApiResult>;
    commit<U>(callback: ApiCallback<U>): void;

    rollback(): Promise<ApiResult>;
    rollback<U>(callback: ApiCallback<U>): void;

    run<U>(callback: TransactionCallback<U>): void;
    run(): Promise<TransactionResult>;
}
