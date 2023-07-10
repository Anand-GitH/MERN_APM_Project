// JavaScript
"use strict";
const loganalytics = require("oci-loganalytics");
const common = require("oci-common");
const log4js = require('log4js');
var bunyan = require('bunyan');

function generateStreamFromString(data) {
  let Readable = require("stream").Readable;
  let stream = new Readable();
  stream.push(data);
  stream.push(null);
  return stream;
}

function ocilogging(data){

//initialization of the OCI logging parameters
//config contains API key and tenancy, user details & profile to use

const configurationFilePath = "~/.oci/config";
const configProfile = "DEFAULT";
const provider = new common.ConfigFileAuthenticationDetailsProvider(
  configurationFilePath,
  configProfile
);

//Using node js OCI logging analytics client to send log message to the LA
(async () => {
  try {
    // Create a service client
    const client = new loganalytics.LogAnalyticsClient({ authenticationDetailsProvider: provider });
    var bodytext = Buffer.from(data, 'utf8');
    // Create a request and dependent object(s).
    const uploadLogFileRequest = {
      namespaceName: "omcinternal",
      uploadName: "Test_anand",
      logSourceName: "MernApp",  
      filename: "Node.log",
      opcMetaLoggrpid: "ocid1.loganalyticsloggroup.oc1.iad.amaaaaaae5xv5jia25z5hocr7gtkep3i7ifxfrqw6lrmfzqnt7tdbhnuanaq",
      uploadLogFileBody: bodytext,
    };

    // Send request to the Client.
    const uploadLogFileResponse = client.uploadLogFile(uploadLogFileRequest);
  } catch (error) {
    console.log("uploadLogFile Failed with error  " + JSON.stringify(error));
  }
})()
}

function OCIInfoStream() {}

OCIInfoStream.prototype.write = function(data) {
  ocilogging(data)
}

function DebugInfoStream() {}

DebugInfoStream.prototype.write = function(data) {
  ocilogging(data)
}

function getLogger(){
  
  var log = bunyan.createLogger({
    name: "OCILogger",
    streams: [{
      level: "info",
      stream: new OCIInfoStream()
    }, {
      level: "debug",
      stream: new DebugInfoStream()
    }]
  })

  return log;

}

var log=getLogger()
log.level(bunyan.DEBUG)
log.debug("debug1 anand me")
log.debug("debug2 anand me")