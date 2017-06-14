// Type definitions for google-cloud-datastore
// Project: https://github.com/GoogleCloudPlatform/google-cloud-node#cloud-datastore-ga
// Definitions by: OctHuber Inc. / Antoine Beauvais-Lacasse <abeaulac@octhuber.com>
import {
    DatastoreCoordinates,
    DatastoreDouble,
    DatastoreGeopoint,
    DatastoreInt,
    DatastoreKey as Key,
    DatastoreKeyOptions,
    DatastoreKeyPath,
    KEY_SYMBOL
} from './DatastoreEntity';
import * as Query from './DatastoreQuery';
import * as Request from './DatastoreRequest';
import * as Transaction from './DatastoreTransaction';

export = Datastore;

declare class Datastore extends Request {
    constructor(options: Datastore.DatastoreInitOptions);

    readonly KEY: KEY_SYMBOL;

    /** If kind is omitted, then "namespace" param is interpreted as 'kind' */
    createQuery(namespace: string, kind?: string): Query;

    save<T>(entities: Request.OneOrMany<T>): Promise<Request.ApiResult>;

    'delete'(keys: Key | Key[]): Promise<Request.ApiResult>;

    transaction(): Transaction;

    int(value: string | number): DatastoreInt;

    double(value: string | number): DatastoreDouble;

    geoPoint(coordinates: DatastoreCoordinates): DatastoreGeopoint;

    key(pathOrOptions: DatastoreKeyPath | DatastoreKeyOptions): Key;

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
}
