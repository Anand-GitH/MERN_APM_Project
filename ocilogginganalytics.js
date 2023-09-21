// JavaScript
"use strict";
const loganalytics = require("oci-loganalytics");
const common = require("oci-common");
var bunyan = require('bunyan');

class LogBuffer {
  constructor(bufferSize, flushInterval, logFunction) {
    this.bufferSize = bufferSize;
    this.flushInterval = flushInterval;
    this.logFunction = logFunction;
    this.buffer = [];

    // Set up a timer to flush the buffer at regular intervals
    this.flushTimer = setInterval(this.flush.bind(this), this.flushInterval);
  }

  log(message) {
    console.log("log:"+this.buffer.length)
    this.buffer.push(message);

    // Check if the buffer size has been reached, and flush if necessary
    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
  }

  flush() {
    console.log("flush:"+this.buffer.length)
    if (this.buffer.length === 0) {
      return;
    }

    // Concatenate the buffered log messages and call the log function
    const logMessage = this.buffer.join('\n');
    this.logFunction(logMessage);

    // Clear the buffer
    this.buffer = [];
  }

  close() {
    // Flush any remaining logs and stop the flush timer
    this.flush();
    clearInterval(this.flushTimer);
  }
}

const buffer = new LogBuffer(30, 60000, ocilogging);

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
console.log("Inside ocilogging")
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
      //opcMetaLoggrpid: "ocid1.loganalyticsloggroup.oc1.iad.anandae5xv5jia25z5hocr7gtkep3i7ifxfrqw6lrmfzqnt7tdbhnuanaq",
      uploadLogFileBody: bodytext,
    };

    // Send request to the Client.
    //const uploadLogFileResponse = await client.uploadLogFile(uploadLogFileRequest);
    try{
    const uploadLogFileResponse = await client.uploadLogFile(uploadLogFileRequest);
    } catch (err) {
        console.log('requestId: ', err.opcRequestId);
    }
  } catch (error) {
    console.log("uploadLogFile Failed with error  " + JSON.stringify(error));
  }
})();

}

function InfoStream() {}

InfoStream.prototype.write = function(data) {
  buffer.log(data)
}

function DebugInfoStream() {}

DebugInfoStream.prototype.write = function(data) {
  buffer.log(data)
}

function ErrorInfoStream() {}

ErrorInfoStream.prototype.write = function(data) {
  buffer.log(data)
}

function WarnInfoStream() {}

WarnInfoStream.prototype.write = function(data) {
  buffer.log(data)
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




