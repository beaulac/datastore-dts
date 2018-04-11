// Type definitions for @google-cloud/datastore 1.3
// Project: https://github.com/googleapis/nodejs-datastore
// Definitions by: Antoine Beauvais-Lacasse <https://github.com/beaulac>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.7

/// <reference types="node" />

declare module '@google-cloud/datastore' {
    export = Datastore;

    import {
        DatastoreKey,
        KEY_SYMBOL,
        DatastoreInt,
        DatastoreDouble,
        DatastoreGeopoint,
        DatastoreKeyPath,
        DatastoreKeyOptions,
        DatastoreCoords,
        OneOrMany,
    } from '@google-cloud/datastore/entity';
    import { DatastoreTransaction } from '@google-cloud/datastore/transaction';
    import DatastoreRequest = require('@google-cloud/datastore/request');
    import Query = require('@google-cloud/datastore/query');

    class Datastore extends DatastoreRequest {
        constructor(options: InitOptions);

        readonly KEY: typeof KEY_SYMBOL;
        readonly MORE_RESULTS_AFTER_CURSOR: Query.MoreResultsAfterCursor;
        readonly MORE_RESULTS_AFTER_LIMIT: Query.MoreResultsAfterLimit;
        readonly NO_MORE_RESULTS: Query.NoMoreResults;

        static readonly KEY: typeof KEY_SYMBOL;
        static readonly MORE_RESULTS_AFTER_CURSOR: Query.MoreResultsAfterCursor;
        static readonly MORE_RESULTS_AFTER_LIMIT: Query.MoreResultsAfterLimit;
        static readonly NO_MORE_RESULTS: Query.NoMoreResults;

        static readonly Query: typeof Query;
        static readonly DatastoreRequest: typeof DatastoreRequest;
        static readonly Transaction: typeof DatastoreTransaction;

        // tslint:disable-next-line unified-signatures (Arg is semantically different)
        createQuery(namespace: string, kind: string): Query;
        createQuery(kind: string): Query;

        save(entities: OneOrMany<object>, callback: DatastoreRequest.CommitCallback): void;
        save(entities: OneOrMany<object>): Promise<DatastoreRequest.CommitResult>;

        delete(keyOrKeys: DatastoreKey | ReadonlyArray<DatastoreKey>, callback: DatastoreRequest.CommitCallback): void;
        delete(keyOrKeys: DatastoreKey | ReadonlyArray<DatastoreKey>): Promise<DatastoreRequest.CommitResult>;

        transaction(): DatastoreTransaction;

        int(value: string | number): DatastoreInt;

        isInt(value: any): value is DatastoreInt;

        double(value: string | number): DatastoreDouble;

        isDouble(value: any): value is DatastoreDouble;

        geoPoint(coordinates: DatastoreCoords): DatastoreGeopoint;

        isGeoPoint(value: any): value is DatastoreGeopoint;

        key(pathOrOptions: DatastoreKeyPath | DatastoreKeyOptions): DatastoreKey;

        isKey(value: any): value is DatastoreKey;

        determineBaseUrl_(customApiEndpoint?: string): void;
    }

    interface InitOptions {
        apiEndpoint?: string;
        namespace?: string;
        projectId?: string;
        keyFilename?: string;
        credentials?: object;
    }
}

declare module '@google-cloud/datastore/entity' {
    interface DatastoreInt {
        value: string;
    }

    interface DatastoreDouble {
        value: string;
    }

    interface DatastoreCoords {
        latitude: number;
        longitude: number;
    }

    interface DatastoreGeopoint {
        value: DatastoreCoords;
    }

    /**
     * DatastoreKeyPath is structured as [kind, identifier, kind, identifier, ...]
     * `kind` must be a string, `identifier` is a PathElement
     */
    type PathElement = string | number | DatastoreInt;
    type DatastoreKeyPath = PathElement[];

    interface DatastoreKeyOptions {
        namespace?: string;
        path: ReadonlyArray<PathElement>;
    }

    interface DatastoreKey {
        kind: string;
        id?: string;
        name?: string;

        readonly path: DatastoreKeyPath;

        parent?: DatastoreKey;

        namespace: string;
    }

    const KEY_SYMBOL: unique symbol;

    type KeyedBySymbol<T> = T & { [KEY_SYMBOL]: DatastoreKey };

    interface KeyedByProperty {
        key: DatastoreKey;
    }

    interface LongPayload<T> extends KeyedByProperty {
        data: Array<EntityDataProperty<T>>;
    }

    interface EntityDataProperty<T> {
        name: keyof T;
        value: any;
        excludeFromIndexes?: boolean;
    }

    interface ShortPayload<T> extends KeyedByProperty {
        data: T;
        excludeFromIndexes?: string[];
    }

    type DatastorePayload<T> = LongPayload<T> | ShortPayload<T>;

    type ObjOrPayload<T> = KeyedBySymbol<T> | DatastorePayload<T>;
    type OneOrMany<T extends object = object> = ObjOrPayload<T> | Array<ObjOrPayload<T>>;
}

declare module '@google-cloud/datastore/query' {
    // tslint:disable-next-line no-duplicate-imports (This rule is broken for multiple modules per file)
    import { DatastoreKey } from '@google-cloud/datastore/entity';
    import DatastoreRequest = require('@google-cloud/datastore/request');

    export = Query;

    class Query {
        scope: DatastoreRequest;
        kinds: string;
        namespace?: string;

        constructor(scope: DatastoreRequest, kinds: string, namespace: string);

        filter(property: string, operator: Query.QueryFilterOperator, value: any): this;
        filter(property: string, value: any): this;

        hasAncestor(key: DatastoreKey): this;

        order(property: string, options?: Query.OrderOptions): this;

        groupBy(properties: string | ReadonlyArray<string>): this;

        select(properties: string | ReadonlyArray<string>): this;

        start(cursorToken: string): this;

        end(cursorToken: string): this;

        limit(n: number): this;

        offset(n: number): this;

        run(callback: Query.QueryCallback): void;
        run(options: Query.QueryOptions, callback: Query.QueryCallback): void;
        run(options?: Query.QueryOptions): Promise<Query.QueryResult>;

        runStream(): NodeJS.ReadableStream;
    }

    namespace Query {
        type QueryFilterOperator = '<' | '<=' | '=' | '>=' | '>';

        interface OrderOptions {
            descending?: boolean;
        }

        interface QueryOptions {
            consistency?: 'strong' | 'eventual';
            maxApiCalls?: number;
        }

        type MoreResultsAfterCursor = 'MORE_RESULTS_AFTER_CURSOR';
        type MoreResultsAfterLimit = 'MORE_RESULTS_AFTER_LIMIT';
        type NoMoreResults = 'NO_MORE_RESULTS';

        interface QueryInfo {
            endCursor?: string;
            readonly moreResults: MoreResultsAfterCursor | MoreResultsAfterLimit | NoMoreResults;
        }

        type QueryCallback = (err: Error, entities: object[], info: QueryInfo) => void;
        type QueryResult = [object[], QueryInfo];
    }
}

declare module '@google-cloud/datastore/request' {
    // tslint:disable-next-line no-duplicate-imports (This rule is broken for multiple modules per file)
    import { DatastoreKey, OneOrMany } from '@google-cloud/datastore/entity';
    import Query = require('@google-cloud/datastore/query');
    import QueryOptions = Query.QueryOptions;
    import QueryCallback = Query.QueryCallback;
    import CommitCallback = DatastoreRequest.CommitCallback;
    import CommitResult = DatastoreRequest.CommitResult;
    import GetCallback = DatastoreRequest.GetCallback;

    export = DatastoreRequest;

    /**
     * Creates requests to the Datastore endpoint.
     * Designed to be inherited by {@link Datastore} & {@link DatastoreTransaction}
     */
    abstract class DatastoreRequest {
        allocateIds(incompleteKey: DatastoreKey, n: number, callback: DatastoreRequest.AllocateIdsCallback): void;
        allocateIds(incompleteKey: DatastoreKey, n: number): Promise<DatastoreRequest.AllocateIdsResult>;

        createReadStream(keys: DatastoreKey | ReadonlyArray<DatastoreKey>,
                         options: QueryOptions): NodeJS.ReadableStream;

        delete(keyOrKeys: DatastoreKey | ReadonlyArray<DatastoreKey>, callback: CommitCallback): void;
        delete(keyOrKeys: DatastoreKey | ReadonlyArray<DatastoreKey>): Promise<CommitResult> | void;

        get(key: DatastoreKey, options: QueryOptions, callback: GetCallback<object>): void;
        get(keys: ReadonlyArray<DatastoreKey>, options: QueryOptions, callback: GetCallback<object[]>): void;
        get(key: DatastoreKey, callback: GetCallback<object>): void;
        get(keys: ReadonlyArray<DatastoreKey>, callback: GetCallback<object[]>): void;

        get(key: DatastoreKey, options?: QueryOptions): Promise<[object | undefined]>;
        get(keys: ReadonlyArray<DatastoreKey>, options?: QueryOptions): Promise<[object[]]>;

        runQuery(query: Query, options: QueryOptions, callback: QueryCallback): void;
        runQuery(query: Query, callback: QueryCallback): void;
        runQuery(query: Query, options?: QueryOptions): Promise<Query.QueryResult>;

        runQueryStream(query: Query, options?: QueryOptions): NodeJS.ReadableStream;

        save(entities: OneOrMany, callback: CommitCallback): void;
        // tslint:disable-next-line void-return (Rule seems broken: this IS a return value)
        save(entities: OneOrMany): Promise<CommitResult> | void;

        insert(entities: OneOrMany, callback: CommitCallback): void;
        insert(entities: OneOrMany): Promise<CommitResult>;

        update(entities: OneOrMany, callback: CommitCallback): void;
        update(entities: OneOrMany): Promise<CommitResult>;

        upsert(entities: OneOrMany, callback: CommitCallback): void;
        upsert(entities: OneOrMany): Promise<CommitResult>;
    }

    namespace DatastoreRequest {
        interface MutationResult {
            key: DatastoreKey;
            conflictDetected: boolean;
            version: number;
        }

        interface CommitResponse {
            mutationResults: MutationResult[];
            indexUpdates: number;
        }

        type CommitCallback = (err: Error, result: CommitResponse) => void;
        type CommitResult = [CommitResponse];

        type GetCallback<T> = (err: Error, entity: T) => void;

        type AllocateIdsCallback = (err: Error, keys: DatastoreKey[]) => void;
        type AllocateIdsResult = [DatastoreKey[]];
    }
}

declare module '@google-cloud/datastore/transaction' {
    import Datastore_ = require('@google-cloud/datastore');
    import Query = require('@google-cloud/datastore/query');
    // tslint:disable-next-line no-duplicate-imports
    import DatastoreRequest = require('@google-cloud/datastore/request');
    // tslint:disable-next-line no-duplicate-imports (This rule is broken for multiple modules per file)
    import { DatastoreKey, OneOrMany } from '@google-cloud/datastore/entity';

    class DatastoreTransaction extends DatastoreRequest {
        constructor(datastore: Datastore_);

        // tslint:disable-next-line unified-signatures (Arg is semantically different)
        createQuery(namespace: string, kind: string): Query;
        createQuery(kind: string): Query;

        save(entities: OneOrMany<object>): void;

        delete(keyOrKeys: DatastoreKey | ReadonlyArray<DatastoreKey>): void;

        commit(): Promise<DatastoreRequest.CommitResult>;
        commit(callback: DatastoreRequest.CommitCallback): void;

        rollback(): Promise<RollbackResult>;
        rollback(callback: RollbackCallback): void;

        run(callback: TransactionCallback): void;
        run(): Promise<TransactionResult>;
    }

    interface BeginTransactionResponse {
        transaction: string;
    }

    type RollbackCallback = (err: Error, rollbackResponse: {}) => void;
    type RollbackResult = [{}];

    type TransactionCallback = (err: Error,
                                tx: DatastoreTransaction,
                                beginTxResponse: BeginTransactionResponse) => void;
    type TransactionResult = [DatastoreTransaction, BeginTransactionResponse];
}
