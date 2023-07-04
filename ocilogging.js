// JavaScript
"use strict";
const loganalytics = require("oci-loganalytics");
const common = require("oci-common");

// Using personal configuration
const configurationFilePath = "~/.oci/config";
const configProfile = "DEFAULT";
const provider = new common.ConfigFileAuthenticationDetailsProvider(
  configurationFilePath,
  configProfile
);

(async () => {
  try {
    // Create a service client
    const client = new loganalytics.LogAnalyticsClient({ authenticationDetailsProvider: provider });
    var bodytext = Buffer.from("ExampleStreamValue", 'utf8');
    // Create a request and dependent object(s).
    const uploadLogFileRequest = {
      namespaceName: "omcinternal",
      uploadName: "Test_anand",
      logSourceName: "Mern_App",
      filename: "Node.log",
      opcMetaLoggrpid: "ocid1.loganalyticsloggroup.oc1.iad.amaaaaaae5xv5jia25z5hocr7gtkep3i7ifxfrqw6lrmfzqnt7tdbhnuanaq",
      // Create a Stream, for example, by calling a helper function like below.
      uploadLogFileBody: bodytext,
    };

    // Send request to the Client.
    const uploadLogFileResponse = await client.uploadLogFile(uploadLogFileRequest);
    console.log("Upload Log File Response "+ JSON.stringify(uploadLogFileResponse));
  } catch (error) {
    console.log("uploadLogFile Failed with error  " + JSON.stringify(error));
  }
})();

function generateStreamFromString(data) {
  let Readable = require("stream").Readable;
  let stream = new Readable();
  stream.push(data); // the string you want
  stream.push(null);
  return stream;
}