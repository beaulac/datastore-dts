import Datastore = require('@google-cloud/datastore');
import { DatastoreDouble, DatastoreGeopoint, DatastoreInt, DatastoreKey } from '@google-cloud/datastore/entity';
import { QueryResult } from '@google-cloud/datastore/query';

class Whatever {
}

const ds: Datastore = new Datastore({});

const transaction = new Datastore.Transaction(ds);


ds.determineBaseUrl_();
ds.determineBaseUrl_('http://localhost:8081');


function buildQuery() {
    return ds.createQuery('myKind')
             .filter('aProp', '<', 0)
             .filter('otherProp', 'implicitEquals')
             .select(['1', '2'])
             .groupBy(['group', 'props'])
             .limit(1000)
             .offset(10);
}

const testKey: DatastoreKey = ds.key(['myKind', 'entityName']);

ds.get<Whatever>(testKey).then((data: [Whatever]) => data[0]);

ds.get<Whatever>(testKey, {maxApiCalls: 1})
  .then((data: [Whatever]) => {
      const blah: Whatever = data[0];
  });

ds.get<number>([testKey, testKey], {maxApiCalls: 1})
  .then((data: [number[]]) => {
      const blah: number[] = data[0];
  });

ds.get(testKey, (err: Error, data: any[]) => data[0]);


const dsInt: DatastoreInt = ds.int(42);
const dsDouble: DatastoreDouble = ds.double('3.14');
const dsGeopoint: DatastoreGeopoint = ds.geoPoint({latitude: 0, longitude: 0});


let readableStream: NodeJS.ReadableStream = buildQuery().runStream();

let run = buildQuery()
    .run<Whatever>()
    .then((data: QueryResult<Whatever>) => {
    });
