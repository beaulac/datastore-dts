// Type definitions for @google-cloud/datastore v1.0.2
// Project: https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga
// Definitions by: OctHuber Inc. / Antoine Beauvais-Lacasse <abeaulac@octhuber.com>

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
        OneOrMany
    } from '@google-cloud/datastore/entity';
    import { DatastoreRequest as DatastoreRequest_, ApiResult } from '@google-cloud/datastore/request';
    import { Query as DatastoreQuery } from '@google-cloud/datastore/query';
    import { DatastoreTransaction } from '@google-cloud/datastore/transaction';

    class Datastore extends DatastoreRequest_ {
        constructor(options: InitOptions);

        readonly KEY: KEY_SYMBOL;
        readonly MORE_RESULTS_AFTER_CURSOR: Datastore.MoreResultsAfterCursor;
        readonly MORE_RESULTS_AFTER_LIMIT: Datastore.MoreResultsAfterLimit;
        readonly NO_MORE_RESULTS: Datastore.NoMoreResults;

        /** If second param is omitted, first param is taken as 'kind' */
        createQuery(namespaceOrKind: string, kind?: string): DatastoreQuery;

        save<T>(entities: OneOrMany<T>): Promise<ApiResult>;

        delete(keys: DatastoreKey | DatastoreKey[]): Promise<ApiResult>;

        transaction(): DatastoreTransaction;

        int(value: string | number): DatastoreInt;

        double(value: string | number): DatastoreDouble;

        geoPoint(coordinates: DatastoreCoords): DatastoreGeopoint;

        key(pathOrOptions: DatastoreKeyPath | DatastoreKeyOptions): DatastoreKey;

        determineBaseUrl_(customApiEndpoint?: string): void;
    }

    interface InitOptions {
        apiEndpoint?: string;
        namespace?: string;
        projectId?: string;
        keyFilename?: string;
        credentials?: {};
    }

    namespace Datastore {
        type MoreResultsAfterCursor = 'MORE_RESULTS_AFTER_CURSOR';
        type MoreResultsAfterLimit = 'MORE_RESULTS_AFTER_LIMIT';
        type NoMoreResults = 'NO_MORE_RESULTS';

        const KEY: KEY_SYMBOL;
        const MORE_RESULTS_AFTER_CURSOR: MoreResultsAfterCursor;
        const MORE_RESULTS_AFTER_LIMIT: MoreResultsAfterLimit;
        const NO_MORE_RESULTS: NoMoreResults;

        const Query: typeof DatastoreQuery;
        const DatastoreRequest: typeof DatastoreRequest_;
        const Transaction: typeof DatastoreTransaction;
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

    type DatastoreKeyPath = Array<string | number | DatastoreInt>;
    interface DatastoreKeyOptions {
        namespace?: string;
        path: DatastoreKeyPath;
    }
    interface DatastoreKey {
        kind: string;
        id?: string;
        name?: string;

        path: DatastoreKeyPath;

        parent?: DatastoreKey;
    }

    type KEY_SYMBOL = symbol;

    interface DatastorePayload<T> {
        key: DatastoreKey;
        // TODO Include possibility of 'raw data' with indexing options, etc:
        data: T | any;
    }
    /**
     * NB: TS does not support defining symbol-keyed properties on interfaces.
     * If using a raw T object, it MUST have property with key={@link Datastore#KEY} & value:{@link DatastoreKey}.
     */
    type ObjOrPayload<T> = T | DatastorePayload<T>;
    type OneOrMany<T> = ObjOrPayload<T> | Array<ObjOrPayload<T>>;
}

declare module '@google-cloud/datastore/query' {
    import { DatastoreKey } from '@google-cloud/datastore/entity';
    import { MoreResultsAfterCursor, MoreResultsAfterLimit, NoMoreResults } from '@google-cloud/datastore';

    class Query {
        constructor(scope: string, kinds: string, namespace: string);

        filter(property: string, operator: QueryFilterOperator, value: any): this;
        filter(property: string, value: any): this;

        hasAncestor(key: DatastoreKey): this;

        order(property: string, options?: OrderOptions): this;

        groupBy(properties: string | string[]): this;

        select(properties: string | string[]): this;

        start(cursorToken: string): this;

        end(cursorToken: string): this;

        limit(n: number): this;

        offset(n: number): this;

        run<T>(callback: QueryCallback<T>): void;
        run<T>(options: QueryOptions, callback: QueryCallback<T>): void;
        run<T>(options?: QueryOptions): Promise<QueryResult<T>>;

        runStream(): NodeJS.ReadableStream;
    }

    type QueryFilterOperator = '<' | '=' | '>';
    interface OrderOptions {
        descending: boolean;
    }
    interface QueryOptions {
        consistency?: 'strong' | 'eventual';
        maxApiCalls?: number;
    }

    interface QueryInfo {
        endCursor?: string;
        moreResults: MoreResultsAfterCursor | MoreResultsAfterLimit | NoMoreResults;
    }
    type QueryCallback<T> = (err: Error, entities: T[], info: QueryInfo) => void;
    type QueryResult<T> = [T[], QueryInfo];
}

declare module '@google-cloud/datastore/request' {
    import * as stream from 'stream';
    import { DatastoreKey, OneOrMany } from '@google-cloud/datastore/entity';
    import { Query, QueryCallback, QueryOptions, QueryResult } from '@google-cloud/datastore/query';

    /**
     * Creates requests to the Datastore endpoint.
     * Designed to be inherited by {@link Datastore} & {@link DatastoreTransaction}
     */
    abstract class DatastoreRequest {
        allocateIds(incompleteKey: DatastoreKey, n: number, callback: AllocationCallback): void;
        allocateIds(incompleteKey: DatastoreKey, n: number): Promise<AllocationResult>;

        createReadStream(keys: DatastoreKey | DatastoreKey[], options: QueryOptions): stream.Readable;

        delete<T>(keys: DatastoreKey | DatastoreKey[], callback: ApiCallback): void;

        get<T>(key: DatastoreKey, options: QueryOptions, callback: GetCallback<T>): void;
        get<T>(keys: DatastoreKey[], options: QueryOptions, callback: GetCallback<T[]>): void;
        get<T>(key: DatastoreKey, callback: GetCallback<T>): void;
        get<T>(keys: DatastoreKey[], callback: GetCallback<T[]>): void;
        get<T>(key: DatastoreKey, options?: QueryOptions): Promise<[T]>;
        get<T>(keys: DatastoreKey[], options?: QueryOptions): Promise<[T[]]>;

        runQuery<T>(query: Query, options: QueryOptions, callback: QueryCallback<T>): void;
        runQuery<T>(query: Query, callback: QueryCallback<T>): void;
        runQuery<T>(query: Query, options?: QueryOptions): QueryResult<T>;

        runQueryStream(query: Query, options?: QueryOptions): stream.Readable;

        save<T, U>(entities: OneOrMany<T>, callback: ApiCallback): void;

        insert<T, U>(entities: OneOrMany<T>, callback: ApiCallback): void;
        insert<T>(entities: OneOrMany<T>): Promise<ApiResult>;

        update<T, U>(entities: OneOrMany<T>, callback: ApiCallback): void;
        update<T>(entities: OneOrMany<T>): Promise<ApiResult>;

        upsert<T, U>(entities: OneOrMany<T>, callback: ApiCallback): void;
        upsert<T>(entities: OneOrMany<T>): Promise<ApiResult>;
    }

    // TODO Flesh this out with other property keys:
    interface ApiResponse {
        mutationResults?: any;
        [otherKeys: string]: any;
    }
    type ApiCallback = (err: Error, result: ApiResponse) => void;
    type ApiResult = [ApiResponse];

    type GetCallback<T> = (err: Error, entity: T) => void;

    type AllocationCallback = (err: Error, keys: DatastoreKey[], apiResponse: ApiResponse) => void;
    type AllocationResult = [DatastoreKey[], ApiResponse];
}

declare module '@google-cloud/datastore/transaction' {
    import Datastore = require('@google-cloud/datastore');
    import { DatastoreKey, OneOrMany } from '@google-cloud/datastore/entity';
    import { Query } from '@google-cloud/datastore/query';
    import { DatastoreRequest, ApiCallback, ApiResponse, ApiResult } from '@google-cloud/datastore/request';

    class DatastoreTransaction extends DatastoreRequest {
        constructor(datastore: Datastore);

        /** If second param is omitted, first param is taken as 'kind' */
        createQuery(namespaceOrKind: string, kind?: string): Query;

        save<T>(entities: OneOrMany<T>): void;

        delete(keys: DatastoreKey | DatastoreKey[]): void;

        commit(): Promise<ApiResult>;
        commit(callback: ApiCallback): void;

        rollback(): Promise<ApiResult>;
        rollback<U>(callback: ApiCallback): void;

        run(callback: TransactionCallback): void;
        run(): Promise<TransactionResult>;
    }

    type TransactionCallback = (err: Error, transaction: DatastoreTransaction, apiResponse: ApiResponse) => void;
    type TransactionResult = [DatastoreTransaction, ApiResponse];
}
