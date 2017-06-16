import Datastore = require('@google-cloud/datastore');
import { DatastoreDouble, DatastoreGeopoint, DatastoreInt, DatastoreKey } from '@google-cloud/datastore/entity';
import { Query, QueryInfo, QueryResult } from '@google-cloud/datastore/query';
import { DatastoreTransaction } from '@google-cloud/datastore/transaction';

interface TestEntity {
    name?: string;
    location?: string;
    symbol?: string;

    [otherKeys: string]: any
}

const datastore: Datastore = new Datastore({});

let key: DatastoreKey = datastore.key(['Company', 'Google']);

datastore.get(key, function (err, entity) {
    // entity = The record.
    // entity[datastore.KEY] = The key for this entity.
});


// <h3>Querying Records</h3>
//
// Create a query with {module:datastore#createQuery}.
//-
var query = datastore.createQuery('Company');

//-
// Multiple records can be found that match criteria with
// {module:datastore/query#filter}.
//-
query.filter('location', 'CA');

//-
// Records can also be ordered with {module:datastore/query#order}.
//-
query.order('name');

//-
// The number of records returned can be specified with
// {module:datastore/query#limit}.
//-
query.limit(5);

//-
// Records' key structures can also be queried with
// {module:datastore/query#hasAncestor}.
//-
const ancestorKey: DatastoreKey = datastore.key(['ParentCompany', 'Alphabet']);

query.hasAncestor(ancestorKey);

//-
// Run the query with {module:datastore#runQuery}.
//-
datastore.runQuery<TestEntity>(query, function (err: Error, entities: TestEntity[]) {
    // entities = An array of records.

    // Access the Key object for an entity.
    var firstEntityKey: DatastoreKey = entities[0][Datastore.KEY];
});

//-
// <h3>Paginating Records</h3>
//
// Imagine building a website that allows a user to sift through hundreds of
// their contacts. You'll likely want to only display a subset of these at
// once, so you set a limit.
//-
var query: Query = datastore.createQuery('Contacts')
                            .limit(10);

datastore.runQuery<TestEntity>(query, function (err: Error, entities: TestEntity[], info: QueryInfo) {
    if (err) {
        // Error handling omitted.
        return;
    }

    // Respond to the front end with the contacts and the cursoring token
    // from the query we just ran.
    const frontEndResponse: any = {
        contacts: entities
    };

    // Check if  more results may exist.
    if (info.moreResults !== datastore.NO_MORE_RESULTS) {
        frontEndResponse.nextPageCursor = info.endCursor;
    }
});


//-
// <h3>Creating Records</h3>
//
// New entities can be created and persisted with {module:datastore#save}.
// The entitiy must have a key to be saved. If you don't specify an
// identifier for the key, one is generated for you.
//
// We will create a key with a `name` identifier, "Google".
//-
key = datastore.key(['Company', 'Google']);

var data: TestEntity = {
    name: 'Google',
    location: 'CA'
};

datastore.save(
    {key: key, data: data},
    function (err) {
        if (!err) {
            // Record saved successfully.
        }
    });

//-
// We can verify the data was saved by using {module:datastore#get}.
//-
datastore.get(
    key,
    function (err, entity) {
        // entity = {
        //   name: 'Google',
        //   location: 'CA'
        // }
    });

//-
// If we want to update this record, we can modify the data object and re-
// save it.
//-
data.symbol = 'GOOG';

datastore.save({
    key: key, // defined above (datastore.key(['Company', 'Google']))
    data: data
}, function (err, entity) {
    if (!err) {
        // Record updated successfully.
    }
});

//-
// <h3>Deleting Records</h3>
//
// Entities can be removed from Datastore by passing the entity's key object
// to {module:datastore#delete}.
//-
key = datastore.key(['Company', 'Google']);

datastore.delete(key, function (err) {
    if (!err) {
        // Record deleted successfully.
    }
});

//-
// <h3>Transactions</h3>
//
// Complex logic can be wrapped in a transaction with
// {module:datastore#transaction}. All queries and updates run within
// the transaction will be applied when the `done` function is called.
//-
const transaction: DatastoreTransaction = datastore.transaction();

transaction.run(function (err) {
    if (err) {
        // Error handling omitted.
    }

    const key = datastore.key(['Company', 'Google']);

    transaction.get(key, function (err: Error, entity: TestEntity) {
        if (err) {
            // Error handling omitted.
        }

        entity.symbol = 'GOOG';

        transaction.save(entity);

        transaction.commit(function (err) {
            if (!err) {
                // Transaction committed successfully.
            }
        });
    });
});


const ds: Datastore = new Datastore({});


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

ds.get<TestEntity>(testKey).then((data: [TestEntity]) => data[0]);

ds.get<TestEntity>(testKey, {maxApiCalls: 1})
  .then((data: [TestEntity]) => {
      const blah: TestEntity = data[0];
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
    .run<TestEntity>()
    .then((data: QueryResult<TestEntity>) => {
    });
