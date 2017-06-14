import { DatastoreKey } from './DatastoreEntity';
import { ApiCallback, ApiResponse, ApiResult, OneOrMany } from './DatastoreRequest';
import Request = require('./DatastoreRequest');
import Query = require('./DatastoreQuery');

export = DatastoreTransaction;

declare interface DatastoreTransaction extends Request {
    /** If kind is omitted, then "namespace" param is interpreted as 'kind' */
    createQuery(namespace: string, kind?: string): Query;

    save<T>(entities: OneOrMany<T>): void;
    'delete'(keys: DatastoreKey | DatastoreKey[]): void;

    commit(): Promise<ApiResult>;
    commit(callback: ApiCallback): void;

    rollback(): Promise<ApiResult>;
    rollback<U>(callback: ApiCallback): void;

    run(callback: DatastoreTransaction.TransactionCallback): void;
    run(): Promise<DatastoreTransaction.TransactionResult>;
}

declare namespace DatastoreTransaction {
    type TransactionCallback = (error: Error | undefined, transaction: DatastoreTransaction, apiResponse: ApiResponse) => void;
    type TransactionResult = [DatastoreTransaction, ApiResponse];
}
