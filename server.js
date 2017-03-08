// -- init nats-proxy with app name and optional options. static files for application are in "app" directory by default
var appCore = require('node-app-core')('entity-store', {
    "nats": {
        "url": "nats://phoenix-nats:4222"
    }
});

// -- add rest api handlers
require('./api/rest/crud')(appCore);
// -- add realtime api handlers
//require('./pubsub/pubsub')(appCore.realtime);
