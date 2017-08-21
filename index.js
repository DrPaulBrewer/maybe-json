/* Copyright 2017 Paul Brewer, Economic and Financial Technology Consulting LLC <drpaulbrewer@eaftc.com> */
/* License: The MIT License */

/**
 * logs and provides Promise-interface to new JSON files less than 1 MB in size.
 * Assumes  google cloud function environment
 *
 * Returned promise resolves to undefined (not a file event) or {file: google-cloud-file-metadata,  data: json-parsed-file-contents}
 *
 * @param {Object} event passed by Google Cloud Function environment
 * @return {Promise<{file: Object, data: Object>} Promise of file event object and JSON-parsed data object from file contents
 */

const storage = require('@google-cloud/storage');

const promiseRetry = require('promise-retry');

module.exports = function maybeJSON(event){
    return new Promise(function(resolve, reject){
	const file = event.data;
	if (!file){
	    console.log("not a file event");
	    return resolve();
	}
	if (file.resourceState === 'not_exists'){
	    console.log("file deletion event");
	    return resolve();
	}
	if (file.contentType !== 'application/json'){
	    console.log("not a json file");
	    return resolve();
	}
	if (file.size > 10000000){
	    console.log("rejecting file "+file.name+" larger than 10 MB");
	    return resolve();
	}
	if (!file.bucket){
	    console.log("bucket not provided");
	    return resolve();
	}
	if (!file.name){
	    console.log("file name not provided");
	    return resolve();
	}
	promiseRetry(function(retry, attempt){	
	    return (storage
	     .bucket(file.bucket)
	     .file(file.name)
	     .download()
	     .then(function(data){
		 if (data)
		     return data.toString('utf-8');
	     }, function(e){
		 console.log("attempt: "+attempt);
		 console.log(e);
		 retry();
	     })
		   );
	}).then(function(data){
	    if (data) {
		console.log("read json file:"+file.name);
		resolve({file:file,data:JSON.parse(data)});
	    }
	}, function(e){
	    reject(e);
	});
    });
};

