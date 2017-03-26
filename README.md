# maybe-json

Google Cloud Function helper to log and transform bucket events to Promises of new json file metadata and json data

This is a helper or skeleton for writing back-end events that trigger on change to a google storage bucket.

All uploaded json file contents are logged, and then returned from a new Promise, provided file size < 1 MB

## Usage

    const maybejSON = require('maybe-json');

    exports.myGoogleCloudFunction = function myGoogleCloudFunction(event){
        return (maybeJSON(event)
	        .then(function(filedata){
		   if (filedata) {  // note, filedata can be "undefined" for non-file events or deletion events
		       const file = filedata.file;   // the google cloud function file event
		       const data = filedata.data;   // the parsed json data contained in the new file
		       // do something useful with the data
		   }
		 })
		 );
    }

### Copyright

Copyright 2017, Paul Brewer, Economic and Financial Technology Consulting LLC <drpaulbrewer@eaftc.com>

### License

MIT


