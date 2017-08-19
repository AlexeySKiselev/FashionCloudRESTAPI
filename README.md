# FashionCloudRESTAPI
Fashion Cloud REST API

This Simple REST API is working with cache, which stores in MongoDB Objects represented by keys. Each object has "key", "ttl", "lastused" fields. All necessary data is stored in "data" field. In this case "data" field contains {"string": "<random string>"} object.
Cache Base has limit of stored key. While addib=nf a new key we exceed this limit - script automatically remove record with smallest "lastused" value from base.

# Requirements
Mongo Shell

# Run Server
Just type "npm start". For tests type "npm test".

# GET request to /api/cache
Returns an array with all stored objects in Cache Database.

# GET request to /api/cache/:key
Returns an object's "data" fields, represented by :key. It :key is not exists, script will automatically create new key with random data. If key's TTL is exceeded, script update record, represented by :key with random data.

# POST request to /api/cache/:key
Will create (if the :key is not exists) or update ixisting key with "data" field equals to sending object (for example, string='new value'). Returns object from "data" filed ({string: 'new value'}).

# DELETE request to /api/cache/:key
Will remove record from base, represented by the :key. Returns {status: 'ok'} object.

# DELETE request to /api/cache
Will remove all objects from base. Returns {status: 'ok'} object.
