// Type definitions for google-cloud-datastore
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
} from './DatastoreEntity';
import { DatastoreQuery } from './DatastoreQuery';
import { DatastoreRequest } from './DatastoreRequest';

export interface DatastoreInitOptions {
    apiEndpoint?: string;
    namespace?: string;
    projectId?: string;
    keyFilename?: string;
    credentials?: {};
}

export interface Datastore extends DatastoreRequest {
    readonly KEY: KEY_SYMBOL;

    /** If kind is omitted, then "namespace" param is interpreted as 'kind' */
    createQuery(namespace: string, kind?: string): DatastoreQuery;

    int(value: string | number): DatastoreInt;
    double(value: string | number): DatastoreDouble;
    geoPoint(coordinates: DatastoreCoordinates): DatastoreGeopoint;
    key(pathOrOptions: DatastoreKeyPath | DatastoreKeyOptions): DatastoreKey;

    readonly MORE_RESULTS_AFTER_CURSOR: 'MORE_RESULTS_AFTER_CURSOR';
    readonly MORE_RESULTS_AFTER_LIMIT: 'MORE_RESULTS_AFTER_LIMIT';
    readonly NO_MORE_RESULTS: 'NO_MORE_RESULTS';

    determineBaseUrl_(customApiEndpoint: string): void;
}

export default function Datastore(options: DatastoreInitOptions): Datastore;
