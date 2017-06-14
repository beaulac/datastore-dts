#### Typescript definitions for [google-cloud-datastore](https://github.com/GoogleCloudPlatform/google-cloud-node/tree/master/packages/datastore) v1.
* This is a temporary effort until definitions are bundled with the official library.

#### TODO:
* Explicitly support 'raw data array' form of datastore entities, e.g.:
    ```javascript
    var entity = {
      key: datastore.key('Company'),
      data: [{
        name: 'rating',
        value: 10,
        excludeFromIndexes: true
      }]
    };
    ```
* Generate `typings.json` files so that definitions can be installed using [typings](https://github.com/typings/typings).
* Generate documentation to be added to the definition files.
* Generate tests to go along with the definition files.
* Submit definitions to [DefinitelyTyped](http://definitelytyped.org/).
* A whole lotta testing
