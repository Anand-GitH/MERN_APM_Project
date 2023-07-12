const {fetch, setGlobalDispatcher, Agent } = require('undici')
setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }) )

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
    const client = new loganalytics.LogAnalyticsClient({ authenticationDetailsProvider: provider }, {
      retryConfiguration : { 
         delayStrategy : new common.FixedTimeDelayStrategy(5),
         terminationStrategy : new common.MaxTimeTerminationStrategy(30),
         retryCondition : (error) => { return error.statusCode >= 500; 
      }
    }});

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


    //Log before sending data to OCI
    //console.log('Data before sending it to OCI:'+ data )
    // Send request to the Client.
    //const uploadLogFileResponse = await client.uploadLogFile(uploadLogFileRequest);
    const uploadLogFileResponse = client.uploadLogFile(uploadLogFileRequest);
  } catch (error) {
    console.log("uploadLogFile Failed with error  " + JSON.stringify(error));
  }
})();
}

function InfoStream() {}

InfoStream.prototype.write = function(data) {
  //console.log('Inside Info')
  ocilogging(data)
}

function DebugInfoStream() {}

DebugInfoStream.prototype.write = function(data) {
  //console.log('Inside debug')
  ocilogging(data)
}

function ErrorInfoStream() {}

ErrorInfoStream.prototype.write = function(data) {
  //console.log('Inside error')
  ocilogging(data)
}

function WarnInfoStream() {}

WarnInfoStream.prototype.write = function(data) {
  //console.log('Inside warn')
  ocilogging(data)
}

module.exports = {
  getlogger: function () {
    var log = bunyan.createLogger({
      src: true,
      name: "OCILogger",
      streams: [{
        level: "info",
        stream: new InfoStream()
      },
      {
        level: "debug",
        stream: new DebugInfoStream()
      },
      {
        level: "error",
        stream: new ErrorInfoStream()
      },
      {
      level: "warn",
      stream: new WarnInfoStream()
      }]
    })
  
    return log;
  }
};




