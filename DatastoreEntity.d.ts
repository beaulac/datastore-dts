export interface DatastoreInt {
    value: string;
}

export interface DatastoreDouble {
    value: string;
}

export interface DatastoreCoordinates {
    latitude: number;
    longitude: number;
}

export interface DatastoreGeopoint {
    value: DatastoreCoordinates;
}

export interface DatastoreKeyOptions {
    namespace?: string;
    path: DatastoreKeyPath;
}

export type DatastoreKeyPath = Array<string | number | DatastoreInt>;

export interface DatastoreKey {
    id?: string;
    name?: string;

    kind: string;
    path: DatastoreKeyPath;

    parent?: DatastoreKey;
}

export type KEY_SYMBOL = symbol;
