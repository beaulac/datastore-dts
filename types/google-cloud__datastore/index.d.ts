// Type definitions for @google-cloud/datastore 1.4
// Project: https://github.com/googleapis/nodejs-datastore
// Definitions by: Antoine Beauvais-Lacasse <https://github.com/beaulac>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.7

/// <reference types="node" />

declare module '@google-cloud/datastore' {
    export = Datastore;

    import {
        DatastoreCoords,
        DatastoreDouble,
        DatastoreGeopoint,
        DatastoreInt,
        DatastoreKey,
        DatastoreKeyOptions,
        DatastoreKeyPath,
        KEY_SYMBOL,
        OneOrMany,
    } from '@google-cloud/datastore/entity';
    import DatastoreRequest = require('@google-cloud/datastore/request');
    import DatastoreTransaction = require('@google-cloud/datastore/transaction');
    import Query = require('@google-cloud/datastore/query');
    import CommitCallback = DatastoreRequest.CommitCallback;
    import CommitResult = DatastoreRequest.CommitResult;

    class Datastore extends DatastoreRequest {
        constructor(options: Datastore.InitOptions);

        readonly KEY: typeof KEY_SYMBOL;
        readonly MORE_RESULTS_AFTER_CURSOR: Query.MoreResultsAfterCursor;
        readonly MORE_RESULTS_AFTER_LIMIT: Query.MoreResultsAfterLimit;
        readonly NO_MORE_RESULTS: Query.NoMoreResults;

        static readonly Query: typeof Query;
        static readonly DatastoreRequest: typeof DatastoreRequest;
        static readonly Transaction: typeof DatastoreTransaction;

        // tslint:disable-next-line unified-signatures (Arg is semantically different)
        createQuery(namespace: string, kind: string): Query;
        createQuery(kind: string): Query;

        save(entities: OneOrMany, callback: CommitCallback): void;
        save(entities: OneOrMany): Promise<CommitResult>;

        save(entities: OneOrMany, callback: CommitCallback): void;
        save(entities: OneOrMany): Promise<CommitResult>;

        insert(entities: OneOrMany, callback: CommitCallback): void;
        insert(entities: OneOrMany): Promise<CommitResult>;

        update(entities: OneOrMany, callback: CommitCallback): void;
        update(entities: OneOrMany): Promise<CommitResult>;

        upsert(entities: OneOrMany, callback: CommitCallback): void;
        upsert(entities: OneOrMany): Promise<CommitResult>;

        delete(keyOrKeys: DatastoreKey | ReadonlyArray<DatastoreKey>, callback: CommitCallback): void;
        delete(keyOrKeys: DatastoreKey | ReadonlyArray<DatastoreKey>): Promise<CommitResult>;

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

    namespace Datastore {
        const KEY: typeof KEY_SYMBOL;
        const MORE_RESULTS_AFTER_CURSOR: Query.MoreResultsAfterCursor;
        const MORE_RESULTS_AFTER_LIMIT: Query.MoreResultsAfterLimit;
        const NO_MORE_RESULTS: Query.NoMoreResults;

        function int(value: string | number): DatastoreInt;

        function isInt(value: any): value is DatastoreInt;

        function double(value: string | number): DatastoreDouble;

        function isDouble(value: any): value is DatastoreDouble;

        function geoPoint(coordinates: DatastoreCoords): DatastoreGeopoint;

        function isGeoPoint(value: any): value is DatastoreGeopoint;

        function isKey(value: any): value is DatastoreKey;

        interface InitOptions {
            apiEndpoint?: string;
            namespace?: string;
            projectId?: string;
            keyFilename?: string;
            credentials?: object;
        }
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

    type KeyedBySymbol<T extends object = object> = T & { [KEY_SYMBOL]: DatastoreKey };

    interface KeyedByProperty {
        key: DatastoreKey;
    }

    /**
     * @deprecated
     */
    interface LegacyEntity<T extends object = object> extends KeyedByProperty {
        data: Array<EntityDataProperty<T>>;
    }

    interface EntityDataProperty<T extends object = object> {
        name: keyof T;
        value: EntityValue;
        excludeFromIndexes?: boolean;
    }

    interface NestedEntityValue {
        [key: string]: EntityValue;
    }

    interface EntityValueArray {
        [index: number]: EntityValue;
    }

    type EntityValue = undefined | null
        | boolean | number | string | Date | Buffer
        | DatastoreKey | DatastoreGeopoint | DatastoreInt | DatastoreDouble
        | NestedEntityValue | EntityValueArray;

    interface Entity<T extends object = object> extends KeyedByProperty {
        data: T;
        excludeFromIndexes?: string[];
    }

    type DatastorePayload<T extends object = object> = Entity<T> | LegacyEntity<T>;

    type ObjOrPayload<T extends object = object> = KeyedBySymbol<T> | DatastorePayload<T>;
    type OneOrMany<T extends object = object> = ObjOrPayload<T> | Array<ObjOrPayload<T>>;
}

declare module '@google-cloud/datastore/query' {
    export = Query;

    import { DatastoreKey } from '@google-cloud/datastore/entity';
    import DatastoreRequest = require('@google-cloud/datastore/request');

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
    export = DatastoreRequest;

    import { DatastoreKey, KeyedBySymbol, OneOrMany } from '@google-cloud/datastore/entity';
    import Query = require('@google-cloud/datastore/query');
    import QueryOptions = Query.QueryOptions;
    import QueryCallback = Query.QueryCallback;
    import CommitCallback = DatastoreRequest.CommitCallback;
    import CommitResult = DatastoreRequest.CommitResult;
    import GetCallback = DatastoreRequest.GetCallback;

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

        get(key: DatastoreKey, options: QueryOptions, callback: GetCallback<KeyedBySymbol | undefined>): void;
        get(keys: ReadonlyArray<DatastoreKey>, options: QueryOptions, callback: GetCallback<KeyedBySymbol[]>): void;
        get(key: DatastoreKey, callback: GetCallback<KeyedBySymbol | undefined>): void;
        get(keys: ReadonlyArray<DatastoreKey>, callback: GetCallback<KeyedBySymbol[]>): void;

        get(key: DatastoreKey, options?: QueryOptions): Promise<[KeyedBySymbol | undefined]>;
        get(keys: ReadonlyArray<DatastoreKey>, options?: QueryOptions): Promise<[KeyedBySymbol[]]>;

        runQuery(query: Query, options: QueryOptions, callback: QueryCallback): void;
        runQuery(query: Query, callback: QueryCallback): void;
        runQuery(query: Query, options?: QueryOptions): Promise<Query.QueryResult>;

        runQueryStream(query: Query, options?: QueryOptions): NodeJS.ReadableStream;

        save(entities: OneOrMany, callback?: CommitCallback): Promise<CommitResult> | void;

        insert(entities: OneOrMany, callback?: CommitCallback): Promise<CommitResult> | void;

        update(entities: OneOrMany, callback?: CommitCallback): Promise<CommitResult> | void;

        upsert(entities: OneOrMany, callback?: CommitCallback): Promise<CommitResult> | void;
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

        type GetCallback<T> = (err: Error, entity: [T]) => void;

        type AllocateIdsCallback = (err: Error, keys: DatastoreKey[]) => void;
        type AllocateIdsResult = [DatastoreKey[]];
    }
}

declare module '@google-cloud/datastore/transaction' {
    export = DatastoreTransaction;

    import Datastore = require('@google-cloud/datastore');
    import Query = require('@google-cloud/datastore/query');
    import DatastoreRequest = require('@google-cloud/datastore/request');
    import { DatastoreKey, OneOrMany } from '@google-cloud/datastore/entity';

    class DatastoreTransaction extends DatastoreRequest {
        constructor(datastore: Datastore);

        // tslint:disable-next-line unified-signatures (Arg is semantically different)
        createQuery(namespace: string, kind: string): Query;
        createQuery(kind: string): Query;

        save(entities: OneOrMany): void;

        insert(entities: OneOrMany): void;

        update(entities: OneOrMany): void;

        upsert(entities: OneOrMany): void;

        delete(keyOrKeys: DatastoreKey | ReadonlyArray<DatastoreKey>): void;

        commit(): Promise<DatastoreRequest.CommitResult>;
        commit(callback: DatastoreRequest.CommitCallback): void;

        rollback(): Promise<DatastoreTransaction.RollbackResult>;
        rollback(callback: DatastoreTransaction.RollbackCallback): void;

        run(callback: DatastoreTransaction.TransactionCallback): void;
        run(): Promise<DatastoreTransaction.TransactionResult>;
    }

    namespace DatastoreTransaction {
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
}
